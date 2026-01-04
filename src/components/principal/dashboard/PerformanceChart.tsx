import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data - will be replaced with real data when available
const weekData = [
  { name: "Mon", learning: 78, attendance: 92 },
  { name: "Tue", learning: 82, attendance: 94 },
  { name: "Wed", learning: 80, attendance: 91 },
  { name: "Thu", learning: 85, attendance: 95 },
  { name: "Fri", learning: 88, attendance: 93 },
  { name: "Sat", learning: 75, attendance: 85 },
];

const monthData = [
  { name: "Week 1", learning: 75, attendance: 90 },
  { name: "Week 2", learning: 78, attendance: 92 },
  { name: "Week 3", learning: 82, attendance: 91 },
  { name: "Week 4", learning: 85, attendance: 94 },
];

const yearData = [
  { name: "Jan", learning: 70, attendance: 88 },
  { name: "Feb", learning: 72, attendance: 89 },
  { name: "Mar", learning: 75, attendance: 90 },
  { name: "Apr", learning: 78, attendance: 91 },
  { name: "May", learning: 80, attendance: 92 },
  { name: "Jun", learning: 82, attendance: 93 },
  { name: "Jul", learning: 79, attendance: 88 },
  { name: "Aug", learning: 81, attendance: 90 },
  { name: "Sep", learning: 84, attendance: 92 },
  { name: "Oct", learning: 86, attendance: 94 },
  { name: "Nov", learning: 85, attendance: 93 },
  { name: "Dec", learning: 88, attendance: 95 },
];

type TimeRange = "week" | "month" | "year";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const getData = () => {
    switch (timeRange) {
      case "week":
        return weekData;
      case "month":
        return monthData;
      case "year":
        return yearData;
      default:
        return weekData;
    }
  };

  return (
    <Card className="bg-card border-0 rounded-2xl shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">School Performance Overview</CardTitle>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(["week", "month", "year"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              className={`rounded-lg text-xs px-3 capitalize ${
                timeRange === range 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-background"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] chart-animate">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                domain={[60, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="learning"
                name="Learning Consistency"
                stroke="hsl(220, 80%, 55%)"
                strokeWidth={3}
                dot={{ fill: "hsl(220, 80%, 55%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(220, 80%, 55%)" }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="hsl(158, 64%, 42%)"
                strokeWidth={3}
                dot={{ fill: "hsl(158, 64%, 42%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(158, 64%, 42%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
