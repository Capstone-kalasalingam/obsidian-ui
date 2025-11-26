import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Edit, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const initialProfile = {
  name: "Kishor",
  role: "Principal",
  schoolName: "Geethanjali High School"
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      setProfile(tempProfile);
    } else {
      setTempProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <PrincipalNav>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl mb-20 sm:mb-6">
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur animate-fade-in overflow-hidden">
          <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6 space-y-4">
            <div className="mx-auto relative w-28 h-28 sm:w-32 sm:h-32 mb-2 sm:mb-4">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={profileImage || undefined} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                  <User className="h-14 w-14 sm:h-16 sm:w-16" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label htmlFor="profile-image" className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2.5 sm:p-3 cursor-pointer hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="text-2xl sm:text-3xl font-bold text-center bg-muted/50 px-4 py-2.5 sm:py-3 rounded-lg w-full border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            ) : (
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {profile.name || "Enter your name"}
              </CardTitle>
            )}
            <CardDescription className="text-base sm:text-lg font-medium text-muted-foreground">
              {profile.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground/90 px-1">School Information</h3>
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-0.5 p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1.5 sm:mb-2">School Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.schoolName}
                      onChange={(e) => setTempProfile({ ...tempProfile, schoolName: e.target.value })}
                      className="font-semibold text-sm sm:text-base bg-background/80 px-3 py-2 sm:py-2.5 rounded-lg w-full border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter school name"
                    />
                  ) : (
                    <p className="font-semibold text-sm sm:text-base text-foreground break-words">
                      {profile.schoolName || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-2 sm:gap-3">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleEdit} 
                    className="flex-1 sm:flex-none h-11 sm:h-12 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    className="flex-1 sm:flex-none h-11 sm:h-12 text-sm sm:text-base font-medium border-2 hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEdit} 
                  className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PrincipalNav>
  );
};

export default Profile;
