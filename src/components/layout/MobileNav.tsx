import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  Target, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Home" },
  { path: "/daily", icon: Calendar, label: "Daily" },
  { path: "/weekly", icon: CalendarDays, label: "Weekly" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive && "bg-primary/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
