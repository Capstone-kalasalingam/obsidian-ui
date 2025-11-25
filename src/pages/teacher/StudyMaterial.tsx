import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload as UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudyMaterial() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!title || !file) {
      toast({
        title: "Error",
        description: "Please provide both title and file",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success!",
      description: "Study material uploaded successfully (Demo mode)",
    });
    setTitle("");
    setFile(null);
  };

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Class Info */}
        <div className="mb-6">
          <p className="text-lg font-semibold">Class 9 · Section B</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 text-base border-0 bg-background shadow-sm"
            />
          </div>

          {/* File Upload Area */}
          <Card className="border-2 border-dashed border-border bg-background">
            <CardContent className="p-8">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl border-2 border-border flex items-center justify-center mb-4">
                  <UploadIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">
                  {file ? file.name : "Tap to upload file"}
                </p>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>

          {/* Upload Button */}
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>
      </div>
    </TeacherNav>
  );
}
