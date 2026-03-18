import { RootProvider } from "fumadocs-ui/provider/next";
import "../global.css";
import { Inter } from "next/font/google";
import { i18nUI } from "@/lib/layout.shared";

const inter = Inter({
  subsets: ["latin"],
});

// export default function Layout({ children }: LayoutProps<'/'>) {
//   return (
//     <html lang="en" className={inter.className} suppressHydrationWarning>
//       <body className="flex flex-col min-h-screen">
//         <RootProvider>{children}</RootProvider>
//       </body>
//     </html>
//   );
// }

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nUI.provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}
