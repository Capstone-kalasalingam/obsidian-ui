import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [month, setMonth] = React.useState(props.defaultMonth || new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  }, []);

  const handleMonthChange = (newMonth: string) => {
    const newDate = new Date(month);
    newDate.setMonth(parseInt(newMonth));
    setMonth(newDate);
  };

  const handleYearChange = (newYear: string) => {
    const newDate = new Date(month);
    newDate.setFullYear(parseInt(newYear));
    setMonth(newDate);
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border shadow-lg", className)}>
      {/* Custom Header */}
      <div className="bg-primary px-3 py-3">
        {/* Navigation and Title */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => {
              const newDate = new Date(month);
              newDate.setMonth(newDate.getMonth() - 1);
              setMonth(newDate);
            }}
            className="p-1 text-primary-foreground hover:bg-primary-foreground/20 rounded transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-primary-foreground font-semibold text-lg">
            {months[month.getMonth()]} {month.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => {
              const newDate = new Date(month);
              newDate.setMonth(newDate.getMonth() + 1);
              setMonth(newDate);
            }}
            className="p-1 text-primary-foreground hover:bg-primary-foreground/20 rounded transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Month/Year Dropdowns */}
        <div className="flex gap-2">
          <Select value={month.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="flex-1 h-8 bg-primary-foreground text-foreground border-0 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={m} value={index.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-24 h-8 bg-primary-foreground text-foreground border-0 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mt-3 text-primary-foreground/90 text-sm font-medium">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center py-1">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={month}
        onMonthChange={setMonth}
        className={cn("p-3 pointer-events-auto bg-card")}
        classNames={{
          months: "flex flex-col",
          month: "space-y-0",
          caption: "hidden",
          nav: "hidden",
          table: "w-full border-collapse",
          head_row: "hidden",
          head_cell: "hidden",
          row: "flex w-full",
          cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-muted"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground/50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
