import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerGrowth AI | AI Resume Analyzer, Job Match & Video Mock Interview",
  description:
    "Analyze your resume, match it with real job descriptions, practice AI-powered video interviews with speech & coding rounds, and follow a personalized learning roadmap.",
};

const themeScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkKeySet = publishableKey && !publishableKey.includes("placeholder");

  const content = (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbf9f5] dark:bg-[#090d16] text-stone-900 dark:text-stone-100 selection:bg-indigo-600 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );

  if (isClerkKeySet) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
