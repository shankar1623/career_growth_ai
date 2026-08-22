import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerGrowth AI | AI Resume Analyzer, Job Match & Video Mock Interview",
  description:
    "Analyze your resume, match it with real job descriptions, practice AI-powered video interviews with speech & coding rounds, and follow a personalized learning roadmap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkKeySet = publishableKey && !publishableKey.includes("placeholder");

  const content = (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );

  if (isClerkKeySet) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
