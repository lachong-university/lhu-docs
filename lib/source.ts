import { docs } from 'collections/server';
import { type InferPageType, loader, update } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { i18n } from './i18n';



// const filteredSource = update(docs.toFumadocsSource())
//   .files((files) =>
//     files.filter((file) => {
//       // keep meta files (e.g. `meta.json`)
//       if (file.type === 'meta') return true;
//       // access file data (type-safe)
//       return file.data.permission === 'public';
//     }),
//   )
//   .build();

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  i18n,
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],

});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
