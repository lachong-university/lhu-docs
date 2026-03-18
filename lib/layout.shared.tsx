import { defineI18nUI } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";
import { appMetadata } from "./metadata";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "HongThaiPham",
  repo: "ldocs",
  branch: "main",
};

export const i18nUI = defineI18nUI(i18n, {
  translations: {
    vi: {
      displayName: "Tiếng Việt",
    },
    en: {
      displayName: "English",
    },
  },
});

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-notebook-icon lucide-notebook"
          >
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M16 2v20" />
          </svg>
          {appMetadata.title}
        </>
      ),
      transparentMode: "top",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [],
  };
}
