import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Edit, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const initialProfile = {
  name: "",
  role: "Principal",
  schoolName: ""
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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="shadow-lg border animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto relative w-24 h-24 mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
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
                className="text-3xl font-semibold text-center bg-muted px-4 py-2 rounded-md w-full"
                placeholder="Enter your name"
              />
            ) : (
              <CardTitle className="text-3xl">{profile.name || "Enter your name"}</CardTitle>
            )}
            <CardDescription className="text-base">
              {profile.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">School Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.schoolName}
                    onChange={(e) => setTempProfile({ ...tempProfile, schoolName: e.target.value })}
                    className="font-medium bg-background px-2 py-1 rounded w-full mt-1"
                    placeholder="Enter school name"
                  />
                ) : (
                  <p className="font-medium">{profile.schoolName || "Not set"}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleEdit} className="flex-1 md:flex-none">
                    <Edit className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 md:flex-none">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} className="w-full md:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
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
