import { useState, useRef, useEffect } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Sparkles, BookOpen, Lightbulb, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-ai-chat`;

const examplePrompts = [
  { icon: BookOpen, text: "Explain photosynthesis in simple terms" },
  { icon: Lightbulb, text: "Help me understand quadratic equations" },
  { icon: GraduationCap, text: "What are Newton's laws of motion?" },
  { icon: Sparkles, text: "Explain the water cycle step by step" },
];

const StudyMaterials = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const trimmedInput = (messageText || input).trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
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
            content: m.content
          }))
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
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
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment! 🙏"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleExampleClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <StudentNav>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mb-6 shadow-lg">
              <Bot className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
              How can I help you learn today?
            </h1>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Ask me anything about your studies. I'll guide you through concepts step by step!
            </p>

            {/* Example Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
              {examplePrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group"
                  onClick={() => handleExampleClick(prompt.text)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <prompt.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{prompt.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-4",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-br from-primary to-violet-600 text-primary-foreground"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-5 py-3",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-muted rounded-2xl px-5 py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="border-t bg-background px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="min-h-[52px] max-h-40 resize-none rounded-xl"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="shrink-0 h-[52px] w-[52px] rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              I'll guide you to understand concepts, not give direct answers 💡
            </p>
          </div>
        </div>
      </div>
    </StudentNav>
  );
};

export default StudyMaterials;
