import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { ReactNode } from "react";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  return (
    <HomeLayout
      {...baseOptions(lang)}
      links={[
        {
          type: "menu",
          text: "Documentation",
          items: [
            {
              text: "LMS Moodle System",
              description: "Learn how to use the Moodle LMS System",
              url: "/docs/lms-learn-system",
            },
            {
              text: "LMS Canvas System",
              description: "Learn how to use the Canvas LMS System",
              url: "/docs/canvas-lms-system",
            },
            {
              text: "AM Portal",
              description:
                "Learn how to use the AM Portal to manage admissions and student information",
              url: "/docs/am-system",
            },
          ],
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
