import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Bell, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface TopBarProps {
  username: string;
}

export function TopBar({ username }: TopBarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left: Greeting */}
        <div className="flex flex-col">
          <h1 className="text-xl lg:text-2xl font-semibold">
            {greeting()}, <span className="text-gradient">{username}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Let's make today productive!
          </p>
        </div>

        {/* Center: Date Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-xl p-1">
          <Button 
            variant="ghost" 
            size="icon-sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-4 py-1.5 font-medium min-w-[180px] text-center">
            {format(currentDate, "EEEE, MMM d")}
          </span>
          <Button 
            variant="ghost" 
            size="icon-sm"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
