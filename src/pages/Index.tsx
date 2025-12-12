import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./Dashboard";
import { useProfile } from "@/hooks/useProfile";
import { useHabitsData } from "@/hooks/useHabitsData";
import { Onboarding } from "@/components/habits/Onboarding";
import { Category } from "@/types/habit";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { addHabitAsync, isLoading: habitsLoading } = useHabitsData();
  const { toast } = useToast();
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  
  const handleOnboardingComplete = async (data: {
    username: string;
    categories: Category[];
    habits: { name: string; icon: string; category: Category }[];
  }) => {
    setIsCompletingOnboarding(true);
    
    try {
      // Add all selected habits
      for (const habit of data.habits) {
        await addHabitAsync({
          name: habit.name,
          icon: habit.icon,
          category: habit.category
        });
      }
      
      // Update profile with username and mark onboarding as completed
      updateProfile({
        username: data.username,
        onboarding_completed: true
      });
      
      toast({
        title: "Welcome to HabitFlow!",
        description: `Great start, ${data.username}! You've added ${data.habits.length} habits.`,
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  if (profileLoading || habitsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (!profile?.onboarding_completed) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
      />
    );
  }
  
  return (
    <AppLayout username={profile?.username || 'User'}>
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
