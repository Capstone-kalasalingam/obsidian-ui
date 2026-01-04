import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertCircle, BookOpen } from "lucide-react";

interface Insight {
  id: string;
  type: "suggestion" | "alert" | "trend" | "learning";
  message: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "learning",
    message: "Students in Grade 6 need revision in Fractions based on recent performance patterns.",
  },
  {
    id: "2",
    type: "alert",
    message: "Low engagement detected after holidays. Consider motivational activities.",
  },
  {
    id: "3",
    type: "trend",
    message: "Grade 8 showing consistent improvement in Science over the past 4 weeks.",
  },
  {
    id: "4",
    type: "suggestion",
    message: "Schedule extra practice sessions for Grade 10 Mathematics before exams.",
  },
];

const getIcon = (type: Insight["type"]) => {
  switch (type) {
    case "suggestion":
      return <Lightbulb className="w-4 h-4 text-attention" />;
    case "alert":
      return <AlertCircle className="w-4 h-4 text-attention" />;
    case "trend":
      return <TrendingUp className="w-4 h-4 text-growth" />;
    case "learning":
      return <BookOpen className="w-4 h-4 text-learning" />;
  }
};

const getBackground = (type: Insight["type"]) => {
  switch (type) {
    case "suggestion":
      return "bg-attention/10";
    case "alert":
      return "bg-attention/10";
    case "trend":
      return "bg-growth/10";
    case "learning":
      return "bg-learning/10";
  }
};

const AIInsightsCard = () => {
  return (
    <Card className="bg-card border-0 rounded-2xl shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-kalvion-blue to-kalvion-purple rounded-xl flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`p-3 rounded-xl ${getBackground(insight.type)} animate-fade-in cursor-pointer hover:opacity-80 transition-opacity`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(insight.type)}
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
