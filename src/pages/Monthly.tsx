import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarHeatmap } from "@/components/habits/CalendarHeatmap";
import { CategoryBadge } from "@/components/habits/CategoryBadge";
import { useHabits } from "@/hooks/useHabits";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Calendar, TrendingUp, Target, BarChart3 } from "lucide-react";
import { Category } from "@/types/habit";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

export default function Monthly() {
  const { habits, getMonthlyData } = useHabits();
  const monthlyData = getMonthlyData();
  
  const monthName = format(new Date(), "MMMM yyyy");
  
  const monthlyAverage = Math.round(
    monthlyData.reduce((acc, d) => acc + d.percentage, 0) / monthlyData.length
  );

  const perfectDays = monthlyData.filter(d => d.percentage === 100).length;
  const totalCompleted = monthlyData.reduce((acc, d) => acc + d.completed, 0);

  const categories = ['health', 'finance', 'work', 'learning'] as Category[];
  const categoryContribution = categories.map(cat => {
    const catHabits = habits.filter(h => h.category === cat);
    const totalCompletions = catHabits.reduce(
      (acc, h) => acc + h.completedDates.filter(d => d.startsWith(format(new Date(), 'yyyy-MM'))).length, 
      0
    );
    return { category: cat, completions: totalCompletions };
  }).filter(c => c.completions > 0).sort((a, b) => b.completions - a.completions);

  // Prepare trend data for line chart
  const trendData = monthlyData.slice(-14).map(d => ({
    date: d.day.toString(),
    percentage: d.percentage,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-primary">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{monthName}</h1>
          <p className="text-sm text-muted-foreground">Monthly overview</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-2xl font-bold font-mono">{monthlyAverage}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Perfect Days</p>
              <p className="text-2xl font-bold font-mono">{perfectDays}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Completions</p>
              <p className="text-2xl font-bold font-mono">{totalCompleted}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-chart-4" />
            <div>
              <p className="text-xs text-muted-foreground">Days Tracked</p>
              <p className="text-2xl font-bold font-mono">{monthlyData.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Calendar Heatmap */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CalendarHeatmap data={monthlyData} />
            </CardContent>
          </Card>

          {/* Trend Line */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">14-Day Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorPercentage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Category Contributions */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Category Contributions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {categoryContribution.map(({ category, completions }) => {
                const maxCompletions = categoryContribution[0]?.completions || 1;
                const percentage = (completions / maxCompletions) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CategoryBadge category={category} size="sm" />
                      <span className="text-sm font-mono">{completions}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category === 'health' ? 'hsl(var(--success))' :
                            category === 'finance' ? 'hsl(var(--chart-4))' :
                            category === 'work' ? 'hsl(var(--warning))' :
                            'hsl(var(--primary))'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Monthly Insights */}
          <Card variant="gradient" className="p-5">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base">Monthly Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <p>Best day: {monthlyData.reduce((best, d) => d.percentage > best.percentage ? d : best, monthlyData[0])?.day}th with {Math.max(...monthlyData.map(d => d.percentage))}% completion</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">📈</span>
                <p>You're {monthlyAverage >= 70 ? 'on track' : 'building momentum'} this month!</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-warning">🔥</span>
                <p>{perfectDays} perfect days so far</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
