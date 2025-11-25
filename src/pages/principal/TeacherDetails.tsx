import PrincipalNav from "@/components/principal/PrincipalNav";
import { useParams, useNavigate } from "react-router-dom";
import { mockTeachers } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Smartphone, MapPin, Calendar, User } from "lucide-react";

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = mockTeachers.find((t) => t.id === id);

  if (!teacher) {
    return (
      <PrincipalNav>
        <div className="flex items-center justify-center h-full">
          <p>Teacher not found</p>
        </div>
      </PrincipalNav>
    );
  }

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/principal/staff")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">Teacher Details</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-8 max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-36 h-36 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-primary/60" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-2xl mb-1">{teacher.name}</h2>
              <p className="text-base text-muted-foreground">{teacher.email}</p>
            </div>
          </div>

          {/* Details Cards */}
          <div className="space-y-4 mt-8">
            {/* ID Number */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">ID Number</p>
                    <p className="text-base text-muted-foreground">
                      {teacher.idNumber || "12133043"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Address</p>
                    <p className="text-base text-muted-foreground">
                      {teacher.address || "123 Maple St, Springfield"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Joining Date */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Joining Date</p>
                    <p className="text-base text-muted-foreground">
                      {teacher.joiningDate || "March 12, 2021"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default TeacherDetails;
