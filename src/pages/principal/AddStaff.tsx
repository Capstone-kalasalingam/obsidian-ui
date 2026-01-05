import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Camera, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create user via edge function
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.phone,
          role: "teacher",
        },
      });

      if (error) throw error;
      
      // Check for error in response data (edge function returns 400 with error in body)
      if (data?.error) {
        if (data.error.includes("already been registered")) {
          toast.error("A staff member with this email already exists");
        } else {
          toast.error(data.error);
        }
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        toast.success("Staff member added successfully!");
        navigate("/principal/staff");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add staff member";
      if (errorMessage.includes("already been registered")) {
        toast.error("A staff member with this email already exists");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/95"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-xl font-semibold"
                >
                  Staff Added Successfully!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Temporary Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="sr-only">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
              />
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-base rounded-2xl mt-8 font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Adding Staff...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default AddStaff;