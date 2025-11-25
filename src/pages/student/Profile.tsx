import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, BookOpen, Users, Edit } from "lucide-react";
import { studentProfile } from "@/data/studentMockData";

const Profile = () => {
  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Card */}
        <Card className="shadow-lg border animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">{studentProfile.name}</CardTitle>
            <CardDescription className="text-base">
              Class {studentProfile.class}-{studentProfile.section} | Roll No: {studentProfile.rollNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{studentProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{studentProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Class & Section</p>
                    <p className="font-medium">{studentProfile.class}-{studentProfile.section}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{studentProfile.rollNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Parent Name</p>
                    <p className="font-medium">{studentProfile.parentName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Parent Phone</p>
                    <p className="font-medium">{studentProfile.parentPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button (Disabled for Demo) */}
            <div className="pt-4 border-t">
              <Button className="w-full md:w-auto" disabled>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile (Demo Only)
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Profile editing is not available in the demo version
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentNav>
  );
};

export default Profile;
