import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Image } from 'fumadocs-core/framework';
import type { MDXComponents } from 'mdx/types';

function DocsImage(props: React.ComponentProps<'img'>) {
  const staticImage =
    typeof props.src === 'object' && props.src !== null && 'width' in props.src
      ? (props.src as { width?: number; height?: number })
      : null;
  const width = Number(props.width ?? staticImage?.width);
  const height = Number(props.height ?? staticImage?.height);
  const isInlineIcon =
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    height <= 80 &&
    width <= 640;

  return (
    <Image
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
      {...(props as React.ComponentProps<typeof Image>)}
      className={['rounded-lg', isInlineIcon ? 'doc-inline-icon' : null, props.className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: DocsImage,
    ...components,
    IconItem,
    InlineWrap,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
