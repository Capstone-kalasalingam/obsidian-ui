import { useState, useRef } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ImagePlus, 
  Send, 
  X, 
  Camera, 
  FileImage,
  Loader2,
  Bot,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-ai-chat`;

const exampleQueries = [
  "Explain this math problem step by step",
  "Help me understand this science diagram",
  "What concept is shown in this textbook page?",
  "Break down this Hindi poem for me"
];

export default function LearnFromImage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Maximum 5MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setMessages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview && !question.trim()) {
      toast.error("Please upload an image or ask a question");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question.trim() || "Please explain this image step by step",
      imageUrl: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
            imageUrl: m.imageUrl
          }))
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get explanation. Please try again.");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble processing that. Please try again!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearAll = () => {
    setImagePreview(null);
    setMessages([]);
    setQuestion("");
  };

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Learn from Image</h1>
          <p className="text-muted-foreground">
            Upload a photo of your textbook, homework, or notes — I'll explain it step by step!
          </p>
        </div>

        {/* Upload Section */}
        {!imagePreview && messages.length === 0 && (
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileImage className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
                <p className="text-muted-foreground mb-6">
                  Take a photo or upload an image of your textbook, homework, or blackboard notes
                </p>
                <div className="flex gap-3 justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button onClick={() => cameraInputRef.current?.click()}>
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview & Chat */}
        {(imagePreview || messages.length > 0) && (
          <div className="space-y-4">
            {/* Image Preview */}
            {imagePreview && (
              <Card>
                <CardContent className="p-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="max-h-64 rounded-lg"
                    />
                    <button
                      onClick={clearAll}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {msg.role === "user" ? "You" : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {msg.imageUrl && msg.role === "user" && (
                              <img src={msg.imageUrl} alt="Uploaded" className="max-h-32 rounded-lg mb-2" />
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-muted rounded-2xl px-4 py-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Input */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 items-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <ImagePlus className="w-4 h-4" />
                  </Button>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question..."
                    className="min-h-[44px] max-h-32 resize-none"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Example Queries */}
        {!imagePreview && messages.length === 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Example Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {exampleQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(query)}
                    className="text-left p-3 rounded-lg border hover:bg-muted transition-colors text-sm"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Notice */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          🛡️ I'll explain concepts step-by-step but won't give direct answers to homework or exams
        </p>
      </div>
    </StudentNav>
  );
}
