import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { useProfile } from "@/hooks/useProfile";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Daily from "./pages/Daily";
import Weekly from "./pages/Weekly";
import Monthly from "./pages/Monthly";
import Goals from "./pages/Goals";
import Categories from "./pages/Categories";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  
  return (
    <AppLayout username={profile?.username || 'User'}>
      {children}
    </AppLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/daily" element={
        <ProtectedRoute>
          <ProtectedLayout><Daily /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/weekly" element={
        <ProtectedRoute>
          <ProtectedLayout><Weekly /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/monthly" element={
        <ProtectedRoute>
          <ProtectedLayout><Monthly /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/goals" element={
        <ProtectedRoute>
          <ProtectedLayout><Goals /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/categories" element={
        <ProtectedRoute>
          <ProtectedLayout><Categories /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/reminders" element={
        <ProtectedRoute>
          <ProtectedLayout><Reminders /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <ProtectedLayout><Settings /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
