import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

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
    ...components,
    IconItem,
    InlineWrap,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
