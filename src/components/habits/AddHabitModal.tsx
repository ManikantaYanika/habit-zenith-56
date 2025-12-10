import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, categoryIcons } from "@/types/habit";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  onAdd: (habit: {
    name: string;
    icon: string;
    category: Category;
    frequency: 'daily' | 'weekly';
    targetDays: number[];
    color: string;
  }) => void;
  trigger?: React.ReactNode;
}

const icons = ['🏃', '📖', '💧', '🧘', '💪', '🎯', '💵', '📝', '🎨', '🌱', '😴', '🍎'];
const categories: Category[] = ['health', 'finance', 'work', 'learning'];
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryColorMap: Record<Category, string> = {
  health: 'hsl(var(--success))',
  finance: 'hsl(var(--chart-4))',
  work: 'hsl(var(--warning))',
  learning: 'hsl(var(--primary))',
};

export function AddHabitModal({ onAdd, trigger }: AddHabitModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('health');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onAdd({
      name,
      icon: selectedIcon,
      category: selectedCategory,
      frequency: 'daily',
      targetDays: selectedDays,
      color: categoryColorMap[selectedCategory],
    });
    
    setName("");
    setSelectedIcon(icons[0]);
    setSelectedCategory('health');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="gradient" size="icon-lg" className="rounded-full shadow-glow">
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Name input */}
          <div className="space-y-2">
            <Label>Habit Name</Label>
            <Input
              placeholder="e.g., Morning Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Icon selector */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "w-10 h-10 text-xl rounded-xl border transition-all",
                    selectedIcon === icon
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Category selector */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "p-3 rounded-xl border flex items-center gap-2 transition-all capitalize",
                    selectedCategory === category
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

          {/* Days selector */}
          <div className="space-y-2">
            <Label>Repeat on</Label>
            <div className="flex gap-1">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  onClick={() => toggleDay(index)}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                    selectedDays.includes(index)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <Button 
            variant="gradient" 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!name.trim() || selectedDays.length === 0}
          >
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
