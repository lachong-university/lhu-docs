'use client';

import { Check, Copy, Sparkles } from 'lucide-react';
import { type ReactNode, useCallback, useRef, useState } from 'react';

export interface AiPromptProps {
  children: ReactNode;
  /** Nhãn thay cho mặc định "Prompt cho AI". */
  title?: string;
}

/**
 * Khối prompt copy được, để dán thẳng vào Claude Code / Codex khi nhờ AI dựng module FUI.
 *
 * Nội dung copy lấy từ `innerText` của chính khối đã render, nên children viết tự do trong
 * MDX (đoạn văn, danh sách, khối code) mà vẫn copy ra đúng phần chữ người đọc nhìn thấy —
 * không phải bê nguyên chuỗi vào prop.
 */
export function AiPrompt({ children, title = 'Prompt cho AI' }: AiPromptProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const text = bodyRef.current?.innerText?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bị chặn (không phải https, hoặc user từ chối quyền) — để người đọc tự bôi đen.
    }
  }, []);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-3 py-2">
        <Sparkles className="size-3.5 text-fd-muted-foreground" />
        <span className="text-xs font-medium text-fd-muted-foreground">{title}</span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Đã copy' : 'Copy'}
        </button>
      </div>

      <div
        ref={bodyRef}
        className="px-4 py-3 text-sm [&_p]:my-2 [&_pre]:my-2 [&_ul]:my-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      >
        {children}
      </div>
    </div>
  );
}
