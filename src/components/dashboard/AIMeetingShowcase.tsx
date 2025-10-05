import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Brain, Calendar, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIMeetingShowcase = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Auto-Calendar Block Optimizer",
      description: "Automatically blocks focus time based on your meeting patterns",
      icon: Calendar,
      priority: "Quick Win"
    },
    {
      title: "Post-Meeting Task Automation",
      description: "Creates and assigns tasks from meeting action items",
      icon: CheckCircle,
      priority: "Quick Win"
    },
    {
      title: "Smart Document Generator",
      description: "Generates documents automatically from meeting discussions",
      icon: FileText,
      priority: "Quick Win"
    },
    {
      title: "Vendor/Client Portal Integration",
      description: "Automatically update external stakeholders after meetings",
      icon: Brain,
      priority: "Game Changer"
    }
  ];

  return (
    <Card className="glass-effect p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Meeting Assistant
          </h3>
          <p className="text-sm text-muted-foreground">
            World-first practical features to automate your meetings
          </p>
        </div>
        <Button 
          onClick={() => navigate("/ai-meeting-assistant")}
          className="mt-4 md:mt-0"
        >
          <Zap className="h-4 w-4 mr-2" />
          Explore Features
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all cursor-pointer group"
              onClick={() => navigate("/ai-meeting-assistant")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{feature.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feature.priority === "Quick Win" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {feature.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AIMeetingShowcase;