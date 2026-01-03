import { useState } from "react";
import { format, isPast, isToday, isTomorrow, differenceInDays } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  BookOpen,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import StudentNav from "@/components/student/StudentNav";
import { homeworkData } from "@/data/studentMockData";

const subjectColors: Record<string, string> = {
  Mathematics: "from-blue-500 to-indigo-600",
  English: "from-emerald-500 to-teal-600",
  Science: "from-orange-500 to-red-600",
  Telugu: "from-yellow-500 to-amber-600",
  Hindi: "from-pink-500 to-rose-600",
  "Social Studies": "from-purple-500 to-violet-600",
};

const priorityConfig = {
  high: { label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  medium: { label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  low: { label: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" },
};

export default function Homework() {
  const [homework, setHomework] = useState(homeworkData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = [...new Set(homeworkData.map((h) => h.subject))];

  const pendingHomework = homework.filter((h) => h.status === "pending");
  const completedHomework = homework.filter((h) => h.status === "completed");

  const filteredPending = pendingHomework.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || h.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredCompleted = completedHomework.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || h.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const markAsCompleted = (id: number) => {
    setHomework((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, status: "completed", completedDate: format(new Date(), "yyyy-MM-dd") }
          : h
      )
    );
    toast.success("Homework marked as completed! +10 XP earned 🎉");
  };

  const markAsPending = (id: number) => {
    setHomework((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, status: "pending", completedDate: undefined }
          : h
      )
    );
    toast.info("Homework marked as pending");
  };

  const getDueDateInfo = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (isToday(due)) {
      return { text: "Due Today", urgent: true, color: "text-red-400" };
    }
    if (isTomorrow(due)) {
      return { text: "Due Tomorrow", urgent: true, color: "text-orange-400" };
    }
    if (isPast(due)) {
      return { text: "Overdue", urgent: true, color: "text-red-500" };
    }
    const daysLeft = differenceInDays(due, today);
    if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, urgent: false, color: "text-yellow-400" };
    }
    return { text: `${daysLeft} days left`, urgent: false, color: "text-muted-foreground" };
  };

  const HomeworkCard = ({
    item,
    isCompleted,
  }: {
    item: typeof homeworkData[0];
    isCompleted: boolean;
  }) => {
    const dueDateInfo = getDueDateInfo(item.dueDate);
    const gradient = subjectColors[item.subject] || "from-gray-500 to-gray-600";

    return (
      <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <button
              onClick={() => (isCompleted ? markAsPending(item.id) : markAsCompleted(item.id))}
              className="mt-1 transition-transform hover:scale-110"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs`}
                >
                  {item.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className={priorityConfig[item.priority as keyof typeof priorityConfig].color}
                >
                  {priorityConfig[item.priority as keyof typeof priorityConfig].label}
                </Badge>
              </div>

              <h3
                className={`font-semibold text-foreground mb-1 ${isCompleted ? "line-through opacity-60" : ""}`}
              >
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {item.teacher}
                </span>

                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed on{" "}
                    {format(new Date((item as any).completedDate), "MMM d, yyyy")}
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 ${dueDateInfo.color}`}>
                    {dueDateInfo.urgent ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {dueDateInfo.text}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <StudentNav>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Homework Tracker</h1>
          <p className="text-muted-foreground">
            Stay on top of your assignments and earn XP by completing them on time!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{pendingHomework.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-500">{completedHomework.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">
                {pendingHomework.filter((h) => h.priority === "high").length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-500">
                {pendingHomework.filter((h) => isPast(new Date(h.dueDate))).length}
              </p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search homework..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSubject === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(null)}
              className="rounded-full"
            >
              All
            </Button>
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                className="rounded-full"
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Circle className="w-4 h-4" />
              Pending ({filteredPending.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed ({filteredCompleted.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {filteredPending.length > 0 ? (
              filteredPending
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((item) => <HomeworkCard key={item.id} item={item} isCompleted={false} />)
            ) : (
              <Card className="p-12 text-center border-dashed">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">You have no pending homework.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredCompleted.length > 0 ? (
              filteredCompleted.map((item) => (
                <HomeworkCard key={item.id} item={item} isCompleted={true} />
              ))
            ) : (
              <Card className="p-12 text-center border-dashed">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No completed homework</h3>
                <p className="text-muted-foreground">
                  Complete your assignments to see them here.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentNav>
  );
}
