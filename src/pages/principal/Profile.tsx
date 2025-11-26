import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building, IdCard, Edit, GraduationCap, Calendar } from "lucide-react";

const principalProfile = {
  name: "Dr. Sarah Johnson",
  role: "Principal",
  email: "sarah.johnson@school.edu",
  phone: "+1 (555) 123-4567",
  employeeId: "EMP2024001",
  department: "Administration",
  joinDate: "January 2020",
  qualification: "Ph.D. in Educational Leadership"
};

const Profile = () => {
  return (
    <PrincipalNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Card */}
        <Card className="shadow-lg border animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">{principalProfile.name}</CardTitle>
            <CardDescription className="text-base">
              {principalProfile.role}
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
                    <p className="font-medium">{principalProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{principalProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <IdCard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium">{principalProfile.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{principalProfile.department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="font-medium">{principalProfile.qualification}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium">{principalProfile.joinDate}</p>
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
    </PrincipalNav>
  );
};

export default Profile;
