import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeachers } from "@/hooks/usePrincipalData";
import { Search, User, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "name" | "class";

const StaffManagement = () => {
  const navigate = useNavigate();
  const { teachers, loading } = useTeachers();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filteredAndSortedTeachers = teachers
    .filter((teacher) => {
      const name = teacher.profile?.full_name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.profile?.full_name || "").localeCompare(b.profile?.full_name || "");
        case "class":
          const classA = a.assignments?.[0]?.class?.name || "zzzz";
          const classB = b.assignments?.[0]?.class?.name || "zzzz";
          return classA.localeCompare(classB);
        default:
          return 0;
      }
    });

  const getAssignedClass = (teacher: typeof teachers[0]) => {
    const classTeacherAssignment = teacher.assignments?.find(a => a.is_class_teacher);
    if (classTeacherAssignment?.class) {
      return `${classTeacherAssignment.class.name} - ${classTeacherAssignment.class.section}`;
    }
    return "No class assigned";
  };

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-background border-border rounded-xl"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="h-10 rounded-xl border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="class">Sort by Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Staff List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-card border border-border rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredAndSortedTeachers.length === 0 ? (
            <Card className="bg-card border border-border rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No teachers found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedTeachers.map((teacher) => (
              <Card 
                key={teacher.id} 
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/principal/teacher/${teacher.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {teacher.profile?.avatar_url ? (
                          <img 
                            src={teacher.profile.avatar_url} 
                            alt={teacher.profile.full_name || ""} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base mb-0.5">
                          {teacher.profile?.full_name || "Unknown"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getAssignedClass(teacher)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap bg-green-100 text-green-700">
                      ACTIVE
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PrincipalNav>
  );
};

export default StaffManagement;