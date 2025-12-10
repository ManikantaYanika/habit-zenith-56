import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Category, categoryIcons } from "@/types/habit";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: (data: {
    username: string;
    categories: Category[];
    habits: { name: string; icon: string; category: Category }[];
  }) => void;
}

const suggestedHabits = [
  { name: "Morning Exercise", icon: "🏃", category: "health" as Category },
  { name: "Drink 8 glasses of water", icon: "💧", category: "health" as Category },
  { name: "Meditate for 10 minutes", icon: "🧘", category: "health" as Category },
  { name: "Read for 30 minutes", icon: "📖", category: "learning" as Category },
  { name: "Learn something new", icon: "🎯", category: "learning" as Category },
  { name: "Practice a skill", icon: "✨", category: "learning" as Category },
  { name: "Save $10", icon: "💵", category: "finance" as Category },
  { name: "Track expenses", icon: "📊", category: "finance" as Category },
  { name: "Review budget", icon: "💰", category: "finance" as Category },
  { name: "Complete top 3 tasks", icon: "📝", category: "work" as Category },
  { name: "No social media until noon", icon: "📵", category: "work" as Category },
  { name: "Plan tomorrow", icon: "📅", category: "work" as Category },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<typeof suggestedHabits>([]);

  const categories: { id: Category; label: string; icon: string; color: string }[] = [
    { id: "health", label: "Health & Fitness", icon: "💪", color: "bg-success/20 border-success/50" },
    { id: "learning", label: "Learning & Growth", icon: "📚", color: "bg-primary/20 border-primary/50" },
    { id: "finance", label: "Finance & Savings", icon: "💰", color: "bg-chart-4/20 border-chart-4/50" },
    { id: "work", label: "Work & Productivity", icon: "💼", color: "bg-warning/20 border-warning/50" },
  ];

  const filteredHabits = suggestedHabits.filter(h => 
    selectedCategories.includes(h.category)
  );

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleHabit = (habit: typeof suggestedHabits[0]) => {
    setSelectedHabits(prev =>
      prev.find(h => h.name === habit.name)
        ? prev.filter(h => h.name !== habit.name)
        : [...prev, habit]
    );
  };

  const handleComplete = () => {
    onComplete({
      username,
      categories: selectedCategories,
      habits: selectedHabits,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : i < step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <Card className="p-8 text-center space-y-6 animate-slide-up">
            <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome to HabitFlow</h1>
              <p className="text-muted-foreground">
                Build better habits, one day at a time. Let's set up your account.
              </p>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="What's your name?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center text-lg h-12"
              />
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => setStep(1)}
                disabled={!username.trim()}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 1: Categories */}
        {step === 1 && (
          <Card className="p-8 space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Choose your focus areas</h2>
              <p className="text-muted-foreground">
                Select the categories you want to build habits in.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all duration-200",
                    selectedCategories.includes(cat.id)
                      ? cat.color + " scale-[1.02]"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-3xl mb-2 block">{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.label}</span>
                  {selectedCategories.includes(cat.id) && (
                    <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button
                variant="gradient"
                onClick={() => setStep(2)}
                disabled={selectedCategories.length === 0}
                className="flex-1"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Habits */}
        {step === 2 && (
          <Card className="p-8 space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Pick your first habits</h2>
              <p className="text-muted-foreground">
                Choose at least 3 habits to start with. You can always add more later.
              </p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredHabits.map(habit => (
                <button
                  key={habit.name}
                  onClick={() => toggleHabit(habit)}
                  className={cn(
                    "w-full p-3 rounded-xl border flex items-center gap-3 transition-all",
                    selectedHabits.find(h => h.name === habit.name)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{habit.icon}</span>
                  <span className="flex-1 text-left font-medium">{habit.name}</span>
                  {selectedHabits.find(h => h.name === habit.name) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {selectedHabits.length} habits selected
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                variant="gradient"
                onClick={handleComplete}
                disabled={selectedHabits.length < 1}
                className="flex-1"
              >
                Start Tracking
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
