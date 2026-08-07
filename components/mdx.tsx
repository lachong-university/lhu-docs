import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { AiPrompt } from '@/components/ai-prompt';
import { FuiPreview } from '@/components/fui-preview';

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
    // Component có sẵn của fumadocs — đăng ký ở đây để MDX khỏi phải import từng file
    Accordion,
    Accordions,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    // Riêng của tài liệu FUI
    AiPrompt,
    FuiPreview,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
