import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./Dashboard";
import { useHabits } from "@/hooks/useHabits";

const Index = () => {
  const { settings } = useHabits();
  
  return (
    <AppLayout username={settings.username}>
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
