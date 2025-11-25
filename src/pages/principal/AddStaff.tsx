import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { mockClasses } from "@/data/mockData";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    assignedClass: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Staff member added successfully!");
    navigate("/principal/staff");
  };

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
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

        {/* Content */}
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 text-base rounded-2xl bg-background border-border"
                required
              />
            </div>

            {/* Assigned Class Field */}
            <div className="space-y-2">
              <Label htmlFor="class" className="sr-only">Assigned Class (Optional)</Label>
              <Select
                value={formData.assignedClass}
                onValueChange={(value) => setFormData({ ...formData, assignedClass: value })}
              >
                <SelectTrigger 
                  id="class" 
                  className="h-14 text-base rounded-2xl bg-background border-border"
                >
                  <SelectValue placeholder="Assigned Class (Optional)" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {mockClasses.map((cls) => (
                    <SelectItem 
                      key={cls.id} 
                      value={`${cls.name} - ${cls.section}`}
                    >
                      {cls.name} - {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl mt-8"
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
