#!/usr/bin/env node
/**
 * Trích xuất "bản đồ component" của FUI từ source thật trong resource/skills/fui-skill.
 *
 * Vì sao cần: source component FUI được cập nhật hàng tuần. Script này chạy lại sau mỗi
 * `npm run skill:update`, ghi đè fui-components.json, rồi `git diff` cho thấy ngay
 * component nào đổi props / đổi default / đổi import → trang tài liệu nào cần sửa.
 *
 * Đây là công cụ PHÁT HIỆN DRIFT, không phải bộ sinh tài liệu. Mô tả, ví dụ và cạm bẫy
 * vẫn viết tay trong content/docs/fui/.
 *
 * Cách làm: không regex. Các file scripts/*.js là JS thuần, chỉ gán `defaultControlAttr`
 * rồi gọi `Vue.component(name, options)`. Nên ta chạy thẳng chúng trong node:vm với một
 * bộ global giả (Vue, jQuery, lodash, $isPhone...) và thu lại object options nguyên vẹn.
 *
 *   node lhu-docs/scripts/extract-fui-components.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
// Nguồn sự thật duy nhất — bản đã commit, không phụ thuộc node_modules. Xem CLAUDE.md.
const SKILL_DIR = join(REPO_ROOT, 'resource/skills/fui-skill');
const OUT_FILE = join(__dirname, 'fui-components.json');

/** Mỗi phiên bản FUI có bộ script riêng. V3 dùng hậu tố -3.0. */
const VERSIONS = {
  v2: ['scripts/component.js', 'scripts/componentTable.js', 'scripts/fechart.js'],
  v3: ['scripts/component-3.0.js', 'scripts/componentTable-3.0.js'],
};

/**
 * Bộ global giả đủ để các file scripts chạy tới cuối mà không cần trình duyệt.
 * jQuery được stub bằng Proxy trả về chính nó cho mọi thuộc tính/lời gọi — các script
 * chỉ dùng jQuery bên trong hàm (không chạy lúc load), nên không cần đúng ngữ nghĩa.
 */
function makeSandbox(collected) {
  const chainable = new Proxy(function () {}, {
    get: (t, p) => (p === Symbol.toPrimitive || p === 'toString' ? () => '' : chainable),
    apply: () => chainable,
    construct: () => chainable,
  });

  const sandbox = {
    Vue: {
      component(name, options) {
        // Vue.component(name) 1 tham số = tra cứu, không phải đăng ký
        if (options) collected.set(name, options);
        return options;
      },
      directive() {},
      use() {},
      mixin() {},
      nextTick(cb) {
        if (typeof cb === 'function') cb();
      },
    },
    $: chainable,
    jQuery: chainable,
    _: chainable,
    moment: chainable,
    numeral: chainable,
    echarts: chainable,
    agGrid: chainable,
    // Cờ user-agent do defaultfunction.js đặt; component.js đọc lúc dựng defaultControlAttr
    $isMobile: false,
    $isPhone: false,
    $isApple: false,
    $awt: '',
    vueData: {},
    console: { log() {}, warn() {}, error() {}, info() {} },
    window: {},
    document: chainable,
    navigator: { userAgent: '' },
    location: { href: '', origin: '', search: '' },
    setTimeout() {},
    setInterval() {},
    clearTimeout() {},
    clearInterval() {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

/** Chuẩn hoá `props` về dạng thống nhất, bất kể source khai mảng hay object. */
function normalizeProps(props) {
  if (!props) return [];
  if (Array.isArray(props)) {
    // props: ['value', 'headers', ...] — không có kiểu/mặc định
    return props.map((name) => ({ name, type: null, default: null, required: null }));
  }
  if (typeof props !== 'object') return [];

  return Object.entries(props).map(([name, def]) => {
    // props: { label: String } hoặc props: { label: {} }
    if (typeof def === 'function') return { name, type: def.name || null, default: null, required: null };
    if (!def || typeof def !== 'object') return { name, type: null, default: null, required: null };

    let type = null;
    if (Array.isArray(def.type)) type = def.type.map((t) => t?.name ?? String(t)).join(' | ');
    else if (typeof def.type === 'function') type = def.type.name;
    else if (def.type != null) type = String(def.type);

    let dflt = null;
    if ('default' in def) {
      // default: () => ({}) — gọi factory để lấy giá trị thật
      if (typeof def.default === 'function') {
        try {
          dflt = def.default();
        } catch {
          dflt = '<factory>';
        }
      } else dflt = def.default;
    }

    return {
      name,
      type,
      default: dflt === undefined ? null : dflt,
      required: typeof def.required === 'boolean' ? def.required : null,
    };
  });
}

/** Rút các sự kiện component phát ra: this.$emit('x') / $emit("x") trong template. */
function extractEmits(options) {
  const found = new Set();
  const scan = (text) => {
    if (typeof text !== 'string') return;
    for (const m of text.matchAll(/\$emit\(\s*['"]([^'"]+)['"]/g)) found.add(m[1]);
  };
  scan(options.template);
  for (const fn of Object.values(options.methods ?? {})) scan(String(fn));
  for (const fn of Object.values(options.watch ?? {})) scan(String(fn));
  for (const key of ['created', 'mounted', 'updated', 'beforeDestroy', 'destroyed']) {
    if (options[key]) scan(String(options[key]));
  }
  return [...found].sort();
}

/** Rút tên slot khai báo trong template: <slot name="x"> và <slot> mặc định. */
function extractSlots(template) {
  if (typeof template !== 'string') return [];
  const found = new Set();
  for (const m of template.matchAll(/<slot\b([^>]*)>/g)) {
    const nameAttr = /\bname\s*=\s*["']([^"']+)["']/.exec(m[1]);
    found.add(nameAttr ? nameAttr[1] : 'default');
  }
  return [...found].sort();
}

function extractVersion(version, files) {
  const collected = new Map();
  const sandbox = makeSandbox(collected);
  const context = vm.createContext(sandbox);
  const loaded = [];

  for (const rel of files) {
    const abs = join(SKILL_DIR, rel);
    let code;
    try {
      code = readFileSync(abs, 'utf8');
    } catch {
      console.warn(`  ! bỏ qua ${rel} — không tìm thấy file`);
      continue;
    }
    const before = collected.size;
    try {
      new vm.Script(code, { filename: rel }).runInContext(context, { timeout: 15000 });
    } catch (err) {
      // Chạy tới đâu thu tới đó: một lỗi cuối file vẫn giữ được component đã đăng ký trước đó
      console.warn(`  ! ${rel} dừng giữa chừng: ${err.message}`);
    }
    loaded.push({ file: rel, registered: collected.size - before, lines: code.split('\n').length });
  }

  // defaultControlAttr chỉ có trong component.js — nguồn của attr mặc định + import bắt buộc
  const dca = context.defaultControlAttr ?? {};
  const defaults = {};
  for (const [el, cfg] of Object.entries(dca)) {
    defaults[el] = {
      attr: cfg?.attr ?? null,
      col: cfg?.col ?? null,
      import: cfg?.import ?? null,
    };
  }

  const components = {};
  for (const [name, options] of collected) {
    components[name] = {
      props: normalizeProps(options.props),
      emits: extractEmits(options),
      slots: extractSlots(options.template),
      hasTemplate: typeof options.template === 'string',
      methods: Object.keys(options.methods ?? {}).sort(),
      computed: Object.keys(options.computed ?? {}).sort(),
      // Attr FUI tự inject cho tag này — người viết module KHÔNG cần khai lại
      defaultAttr: defaults[name]?.attr ?? null,
      defaultCol: defaults[name]?.col ?? null,
      requiredImports: defaults[name]?.import ?? null,
    };
  }

  // Tag có mặt trong defaultControlAttr nhưng không do script này đăng ký:
  // component v-* của Vuetify, hoặc f-* nạp từ file import ngoài.
  const importOnly = {};
  for (const [el, cfg] of Object.entries(defaults)) {
    if (components[el]) continue;
    importOnly[el] = cfg;
  }

  return { loaded, components, importOnly };
}

let pkg = { version: null };
try {
  pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'node_modules/@fui-org/fui-mcp/package.json'), 'utf8'));
} catch {
  // node_modules không bắt buộc — resource/ đã đủ để chạy
}
let skillMeta = {};
try {
  // metadata.json mở đầu bằng BOM
  skillMeta = JSON.parse(readFileSync(join(SKILL_DIR, 'metadata.json'), 'utf8').replace(/^﻿/, ''));
} catch {
  /* metadata.json không bắt buộc */
}

const result = {
  _generated: 'Sinh tự động bởi lhu-docs/scripts/extract-fui-components.mjs — đừng sửa tay.',
  _source: 'resource/skills/fui-skill/scripts/',
  extractedAt: new Date().toISOString(),
  packageVersion: pkg.version,
  skillVersion: skillMeta.version ?? null,
  skillLastUpdated: skillMeta.last_updated ?? null,
  versions: {},
};

for (const [version, files] of Object.entries(VERSIONS)) {
  console.log(`\n${version.toUpperCase()}:`);
  const out = extractVersion(version, files);
  for (const f of out.loaded) console.log(`  ${f.file} (${f.lines} dòng) → ${f.registered} component`);
  console.log(`  tổng: ${Object.keys(out.components).length} component đăng ký, ${Object.keys(out.importOnly).length} tag chỉ có import/default`);
  result.versions[version] = out;
}

writeFileSync(OUT_FILE, `${JSON.stringify(result, null, 2)}\n`);
console.log(`\n✓ ${OUT_FILE}`);
console.log(`  skill v${result.skillVersion} (${result.skillLastUpdated})${result.packageVersion ? ` · npm @${result.packageVersion}` : ''}`);
