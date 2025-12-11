import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/habits/GoalCard";
import { useGoals } from "@/hooks/useGoals";
import { Plus, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, categoryIcons } from "@/types/habit";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const categories: Category[] = ['health', 'finance', 'work', 'learning'];

const categoryColorMap: Record<Category, string> = {
  health: 'hsl(var(--success))',
  finance: 'hsl(var(--chart-4))',
  work: 'hsl(var(--warning))',
  learning: 'hsl(var(--primary))',
};

export default function Goals() {
  const { goals, isLoading, addGoal, updateGoalProgress } = useGoals();
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    category: 'health' as Category,
    target_value: 100,
    unit: '',
    deadline: '',
  });

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.current_value / g.target_value) * 100, 0) / goals.length)
    : 0;

  const completedGoals = goals.filter(g => g.current_value >= g.target_value).length;

  const handleAddGoal = () => {
    if (!newGoal.name.trim()) return;
    
    addGoal({
      name: newGoal.name,
      description: newGoal.description || undefined,
      category: newGoal.category,
      target_value: newGoal.target_value,
      unit: newGoal.unit || 'times',
      color: categoryColorMap[newGoal.category],
      deadline: newGoal.deadline || undefined
    });
    
    setNewGoal({
      name: '',
      description: '',
      category: 'health',
      target_value: 100,
      unit: '',
      deadline: '',
    });
    setOpen(false);
  };

  // Transform goals for GoalCard component
  const transformedGoals = goals.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description || '',
    category: g.category as Category,
    targetValue: g.target_value,
    currentValue: g.current_value,
    unit: g.unit,
    color: g.color,
    deadline: g.deadline || '',
    createdAt: g.created_at
  }));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Goals</h1>
            <p className="text-sm text-muted-foreground">Track your long-term objectives</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g., Run 100km this month"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    placeholder="km, books, $..."
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setNewGoal(prev => ({ ...prev, category }))}
                      className={cn(
                        "p-3 rounded-xl border flex items-center gap-2 transition-all capitalize",
                        newGoal.category === category
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span>{categoryIcons[category]}</span>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <Button 
                variant="gradient" 
                className="w-full" 
                onClick={handleAddGoal}
                disabled={!newGoal.name.trim()}
              >
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Goals</p>
              <p className="text-3xl font-bold font-mono">{goals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-3xl font-bold font-mono">{overallProgress}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <CheckCircle2 className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold font-mono">{completedGoals}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Goals</h2>
        
        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No goals yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set your first goal to start tracking progress
            </p>
            <Button variant="gradient" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {transformedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
