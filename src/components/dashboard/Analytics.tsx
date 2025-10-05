import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Users, CheckCircle, Calendar } from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Meeting Efficiency",
      value: "92%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Avg Meeting Duration",
      value: "28 min",
      change: "-8 min",
      trend: "up",
      icon: Clock,
    },
    {
      title: "Team Engagement",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Task Completion Rate",
      value: "94%",
      change: "+3%",
      trend: "up",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Track your productivity metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="glass-effect p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-primary" />
                <Badge variant={metric.trend === "up" ? "default" : "destructive"}>
                  {metric.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.title}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-6">Meeting Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 80, 75, 90, 85, 95, 88].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <h3 className="text-xl font-semibold mb-6">Task Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-semibold">68%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-gradient-primary"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">In Progress</span>
                <span className="text-sm font-semibold">22%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[22%] bg-gradient-to-r from-accent to-accent-foreground"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Pending</span>
                <span className="text-sm font-semibold">10%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[10%] bg-muted-foreground"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-effect p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          AI-Powered Insights
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold mb-2">Peak Productivity</h4>
            <p className="text-sm text-muted-foreground">
              Your team performs best between 10 AM - 12 PM. Consider scheduling important meetings during this window.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="font-semibold mb-2">Meeting Optimization</h4>
            <p className="text-sm text-muted-foreground">
              Meetings are 15% more effective when kept under 30 minutes. AI can help enforce time limits.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold mb-2">Task Completion Patterns</h4>
            <p className="text-sm text-muted-foreground">
              94% task completion rate this week - up from 87% last week. Great momentum!
            </p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="font-semibold mb-2">Engagement Score</h4>
            <p className="text-sm text-muted-foreground">
              Average participant engagement is 87%. Consider interactive elements to boost this further.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
