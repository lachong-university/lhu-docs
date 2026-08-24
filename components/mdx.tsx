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

export function IconItem({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center [&_img]:w-full [&_img]:h-full [&_img]:object-contain [&_img]:m-0 [&_img]:rounded-sm">
        {children}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
export function InlineWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 align-middle [&_p]:m-0 [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1.5 [&_img]:m-0 [&_img]:h-5 [&_img]:w-auto [&_img]:object-contain">
      {children}
    </span>
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
