import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradientClass: string;
  delay?: number;
}

const SummaryCard = ({ title, value, subtitle, icon: Icon, gradientClass, delay = 0 }: SummaryCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible || typeof value !== "number") return;
    
    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isVisible, numericValue, value]);

  return (
    <Card 
      className={`bg-card border-0 rounded-2xl shadow-card hover-scale-soft cursor-pointer overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CardContent className="p-5 relative">
        {/* Gradient Icon Background */}
        <div className={`absolute top-4 right-4 w-12 h-12 ${gradientClass} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="pr-16">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">
            {typeof value === "number" ? displayValue : value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Decorative gradient line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradientClass} opacity-50`} />
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
