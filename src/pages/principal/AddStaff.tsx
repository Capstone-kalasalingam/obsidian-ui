import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Camera } from "lucide-react";
import { toast } from "sonner";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Staff member added successfully!");
    navigate("/principal/staff");
  };

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/principal/staff")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Add Staff</h1>
          </div>
        </div>

        {/* Content - Centered without scroll */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Profile Avatar with Upload */}
          <div className="relative mb-12">
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer block relative group"
            >
              <div className="w-36 h-36 bg-muted rounded-full flex items-center justify-center overflow-hidden transition-all group-hover:ring-4 group-hover:ring-primary/20">
                {avatarImage ? (
                  <img src={avatarImage} alt="Staff Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-muted-foreground" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="sr-only">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl mt-8 font-semibold"
              size="lg"
            >
              Save
            </Button>
          </form>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default AddStaff;
