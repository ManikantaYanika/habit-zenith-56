import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
  username: string;
}

export function AppLayout({ children, username }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar username={username} />
        
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
