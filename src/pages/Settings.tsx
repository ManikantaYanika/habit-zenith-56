import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Download, 
  Trash2, 
  Clock,
  Palette,
  Settings as SettingsIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [username, setUsername] = useState("Alex");
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const { toast } = useToast();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked);
    document.documentElement.classList.toggle('dark', checked);
    toast({
      title: `${checked ? 'Dark' : 'Light'} mode enabled`,
      description: "Theme preference saved",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your data is being prepared for download...",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-primary">
          <SettingsIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="outline" size="sm">Change Avatar</Button>
              <p className="text-xs text-muted-foreground">JPG, PNG. Max 2MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  {isDark ? "Currently using dark theme" : "Currently using light theme"}
                </p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure reminders and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminded to complete your habits
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {notifications && (
            <div className="space-y-2">
              <Label htmlFor="reminder-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reminder Time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Delete All Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Export your habits, goals, and notes as a JSON file. This data can be used for backup purposes.
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card variant="gradient">
        <CardContent className="py-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">HabitFlow v1.0</h3>
            <p className="text-sm text-muted-foreground">
              Build better habits, one day at a time.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button variant="ghost" size="sm">Privacy Policy</Button>
              <Button variant="ghost" size="sm">Terms of Service</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
