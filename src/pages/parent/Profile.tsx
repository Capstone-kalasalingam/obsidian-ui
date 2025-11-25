import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockChildren } from "@/data/parentMockData";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";

const ParentProfile = () => {
  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <User className="h-8 w-8" />
              Parent Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your profile information
            </p>
          </div>

          {/* Profile Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details (Demo data)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mr. Rajesh Sharma</h2>
                  <p className="text-muted-foreground">Parent</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Rajesh Sharma" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input id="email" type="email" defaultValue="rajesh.sharma@example.com" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input id="phone" type="tel" defaultValue="+91 98765 43210" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input id="address" defaultValue="Mumbai, Maharashtra" disabled />
                </div>
              </div>

              <Button variant="outline" disabled className="w-full md:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile (Demo Mode)
              </Button>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Linked Children</CardTitle>
              <CardDescription>Children associated with your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockChildren.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Class {child.class}{child.section} • Roll No: {child.rollNumber}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" disabled>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentProfile;
