import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  Target, 
  FolderKanban, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/daily", icon: Calendar, label: "Daily" },
  { path: "/weekly", icon: CalendarDays, label: "Weekly" },
  { path: "/monthly", icon: FolderKanban, label: "Monthly" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "p-6 border-b border-sidebar-border flex items-center gap-3",
        collapsed && "justify-center"
      )}>
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg">HabitFlow</h1>
            <p className="text-xs text-muted-foreground">Track your progress</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                collapsed && "justify-center px-3"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
