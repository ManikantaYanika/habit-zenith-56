import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/hooks/useHabits";
import Index from "./pages/Index";
import Daily from "./pages/Daily";
import Weekly from "./pages/Weekly";
import Monthly from "./pages/Monthly";
import Goals from "./pages/Goals";
import Categories from "./pages/Categories";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { settings } = useHabits();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/daily" element={
        <AppLayout username={settings.username}>
          <Daily />
        </AppLayout>
      } />
      <Route path="/weekly" element={
        <AppLayout username={settings.username}>
          <Weekly />
        </AppLayout>
      } />
      <Route path="/monthly" element={
        <AppLayout username={settings.username}>
          <Monthly />
        </AppLayout>
      } />
      <Route path="/goals" element={
        <AppLayout username={settings.username}>
          <Goals />
        </AppLayout>
      } />
      <Route path="/categories" element={
        <AppLayout username={settings.username}>
          <Categories />
        </AppLayout>
      } />
      <Route path="/reminders" element={
        <AppLayout username={settings.username}>
          <Reminders />
        </AppLayout>
      } />
      <Route path="/settings" element={
        <AppLayout username={settings.username}>
          <Settings />
        </AppLayout>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
