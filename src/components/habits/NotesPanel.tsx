import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Smile, Meh, Frown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  date: string;
  initialNote?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
  onSave?: (note: string, mood?: string) => void;
  className?: string;
}

const moods = [
  { value: 'great', icon: Sparkles, label: 'Great', color: 'text-success' },
  { value: 'good', icon: Smile, label: 'Good', color: 'text-primary' },
  { value: 'okay', icon: Meh, label: 'Okay', color: 'text-warning' },
  { value: 'bad', icon: Frown, label: 'Bad', color: 'text-destructive' },
];

export function NotesPanel({ 
  date, 
  initialNote = "", 
  mood: initialMood,
  onSave,
  className 
}: NotesPanelProps) {
  const [note, setNote] = useState(initialNote);
  const [selectedMood, setSelectedMood] = useState(initialMood);

  return (
    <Card variant="glass" className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="w-4 h-4 text-primary" />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood selector */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">How are you feeling?</p>
          <div className="flex gap-2">
            {moods.map(({ value, icon: Icon, label, color }) => (
              <button
                key={value}
                onClick={() => setSelectedMood(value as any)}
                className={cn(
                  "flex-1 p-2 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1",
                  selectedMood === value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <Icon className={cn("w-5 h-5", selectedMood === value && color)} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note textarea */}
        <Textarea
          placeholder="Write a quick note about your day..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] resize-none bg-background/50"
        />

        <Button 
          variant="gradient" 
          size="sm" 
          className="w-full"
          onClick={() => onSave?.(note, selectedMood)}
        >
          Save Note
        </Button>
      </CardContent>
    </Card>
  );
}
