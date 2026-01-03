import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, BookOpen, Users, Edit, Building2, MapPin, Globe, Award } from "lucide-react";
import { studentProfile, schoolInfo } from "@/data/studentMockData";

const Profile = () => {
  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          {/* Profile Card */}
          <Card className="border-0 bg-card overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-primary via-violet-600 to-purple-700 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{studentProfile.name}</h1>
                  <p className="text-white/70">
                    Class {studentProfile.class}-{studentProfile.section} | Roll No: {studentProfile.rollNumber}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{studentProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm">{studentProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Class & Section</p>
                      <p className="font-medium text-sm">{studentProfile.class}-{studentProfile.section}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Roll Number</p>
                      <p className="font-medium text-sm">{studentProfile.rollNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Parent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Parent Name</p>
                      <p className="font-medium text-sm">{studentProfile.parentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Parent Phone</p>
                      <p className="font-medium text-sm">{studentProfile.parentPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="pt-4 border-t border-border">
                <Button className="rounded-xl" disabled>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile (Demo Only)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Profile editing is not available in the demo version
                </p>
              </div>
            </CardContent>
          </Card>

          {/* School Information Card */}
          <Card className="border-0 bg-card overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{schoolInfo.name}</h2>
                  <p className="text-white/70 text-sm">Est. {schoolInfo.established}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <MapPin className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium text-sm">{schoolInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Phone className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm">{schoolInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Mail className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{schoolInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Globe className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <p className="font-medium text-sm">{schoolInfo.website}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <User className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Principal</p>
                    <p className="font-medium text-sm">{schoolInfo.principal}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Award className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Affiliated To</p>
                    <p className="font-medium text-sm">{schoolInfo.affiliatedTo}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentNav>
  );
};

export default Profile;