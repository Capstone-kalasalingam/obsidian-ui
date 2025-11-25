import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FloatingActionButton({
  icon: Icon,
  label,
  position = "bottom-right",
  size = "default",
  className,
  ...props
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  return (
    <Button
      size={size}
      className={cn(
        "fixed z-50 shadow-lg hover:shadow-xl transition-all md:hidden",
        positionClasses[position],
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5" />
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
