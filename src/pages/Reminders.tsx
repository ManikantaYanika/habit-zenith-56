import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Clock, Plus, Trash2, Calendar, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reminder {
  id: string;
  time: string;
  days: number[];
  enabled: boolean;
  label: string;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', time: '08:00', days: [1, 2, 3, 4, 5], enabled: true, label: 'Morning habits' },
    { id: '2', time: '21:00', days: [0, 1, 2, 3, 4, 5, 6], enabled: true, label: 'Evening review' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: '09:00',
    days: [1, 2, 3, 4, 5],
    label: '',
  });

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleDay = (day: number) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort(),
    }));
  };

  const addReminder = () => {
    if (!newReminder.label.trim()) return;
    
    setReminders(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newReminder,
        enabled: true,
      },
    ]);
    setNewReminder({ time: '09:00', days: [1, 2, 3, 4, 5], label: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <Bell className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reminders</h1>
            <p className="text-sm text-muted-foreground">Never miss a habit</p>
          </div>
        </div>
        <Button variant="gradient" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Info Card */}
      <Card variant="gradient" className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enable browser notifications to receive reminders. This feature requires notification permissions.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Enable Notifications
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Reminder Form */}
      {showAdd && (
        <Card className="p-6 animate-slide-up">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">New Reminder</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="e.g., Morning routine"
                value={newReminder.label}
                onChange={(e) => setNewReminder(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                className="max-w-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Repeat on
              </Label>
              <div className="flex gap-1">
                {weekDays.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(index)}
                    className={cn(
                      "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                      newReminder.days.includes(index)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                variant="gradient" 
                onClick={addReminder} 
                className="flex-1"
                disabled={!newReminder.label.trim() || newReminder.days.length === 0}
              >
                Save Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your Reminders</h2>
        
        {reminders.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No reminders yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a reminder to stay on track with your habits
            </p>
            <Button variant="gradient" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </Card>
        ) : (
          reminders.map(reminder => (
            <Card 
              key={reminder.id}
              className={cn(
                "p-4 transition-opacity",
                !reminder.enabled && "opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-semibold">
                      {reminder.time}
                    </span>
                    <span className="text-sm font-medium">{reminder.label}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {weekDays.map((day, index) => (
                      <span
                        key={day}
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          reminder.days.includes(index)
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
