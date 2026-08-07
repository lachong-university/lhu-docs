'use client';

import { ExternalLink, RotateCw } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const GALLERY_URL = 'https://fui.vn/ex/fui-v2';

export interface FuiPreviewProps {
  /** Tên component, khớp với ?template= của module gallery. Ví dụ: "f-button". */
  template: string;
  /** Chiều cao khung xem, px. Mặc định 420. */
  height?: number;
  /** Nhãn hiển thị trên thanh tiêu đề. Mặc định là chính `template`. */
  title?: string;
}

/**
 * Khung xem trực tiếp một component FUI, nhúng từ module gallery ở ex/modules/fui-v2.
 *
 * Một module duy nhất phục vụ mọi component — chọn demo bằng query string, đúng như
 * cách FUI tự inject query lên vueData (xem docs/fui/v2/kien-truc/url-params).
 *
 * Iframe được sandbox: demo là dữ liệu giả, không cần cookie phiên của fui.vn, và không
 * được phép điều hướng trang tài liệu. Module đã đặt set.login = "" nên không bị đá sang
 * trang đăng nhập.
 */
export function FuiPreview({ template, height = 420, title }: FuiPreviewProps) {
  const [nonce, setNonce] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const url = `${GALLERY_URL}?template=${encodeURIComponent(template)}`;
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <figcaption className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-3 py-2">
        <span className="font-mono text-xs text-fd-muted-foreground">
          ?template={title ?? template}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={reload}
            title="Tải lại demo"
            aria-label="Tải lại demo"
            className="rounded p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <RotateCw className="size-3.5" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            title="Mở trong tab mới"
            className="flex items-center gap-1 rounded px-2 py-1.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            Mở riêng
            <ExternalLink className="size-3.5" />
          </a>
        </span>
      </figcaption>

      <iframe
        key={nonce}
        ref={frameRef}
        src={url}
        title={`Demo ${template}`}
        loading="lazy"
        // allow-same-origin cần cho Vuetify/AG Grid (đọc localStorage, đo layout); bỏ
        // allow-top-navigation để demo không thể điều hướng trang tài liệu.
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
        style={{ height }}
        className="w-full border-0 bg-white"
      />
    </figure>
  );
}
