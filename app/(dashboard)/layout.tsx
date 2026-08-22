import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex bg-[#fbf9f5] dark:bg-[#090d16] overflow-hidden relative selection:bg-indigo-600 selection:text-white text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Subtle Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45 dark:opacity-25 bg-dot-grid" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-400/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 w-96 h-96 bg-amber-400/5 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Left Sidebar */}
      <div className="h-screen sticky top-0 shrink-0 z-30 flex">
        <AppSidebar />
      </div>

      {/* Main Content Viewport with independent scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <AppHeader />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
