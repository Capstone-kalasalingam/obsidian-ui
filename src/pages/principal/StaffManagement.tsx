import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockTeachers, Teacher } from "@/data/mockData";
import { Search, Plus, User } from "lucide-react";
import { toast } from "sonner";

const StaffManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || teacher.status === filter;
    return matchesSearch && matchesFilter;
  });

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
          
          <div className="flex gap-2">
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className="rounded-xl flex-1 h-10"
            >
              ✓ ACTIVE
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-xl flex-1 h-10"
            >
              ALL
            </Button>
          </div>
        </div>

        {/* Staff List */}
        <div className="space-y-3">
          {filteredTeachers.map((teacher) => (
            <Card 
              key={teacher.id} 
              className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/principal/teacher/${teacher.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base mb-0.5">{teacher.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {teacher.classAssigned || "No class assigned"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                      teacher.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {teacher.status === "active" ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Add Button */}
        <Button
          size="lg"
          onClick={() => navigate("/principal/add-staff")}
          className="fixed bottom-6 right-6 rounded-full w-auto h-12 px-6 shadow-lg z-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Staff
        </Button>
      </div>
    </PrincipalNav>
  );
};

export default StaffManagement;
