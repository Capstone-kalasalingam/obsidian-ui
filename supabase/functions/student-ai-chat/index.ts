import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Kavlion, a friendly and educational AI assistant for Indian school students. Your role is to help students learn and understand concepts, NOT to give them direct answers.

CRITICAL RULES:
1. NEVER give direct final answers to homework or exam questions
2. ALWAYS explain concepts step-by-step using simple language appropriate for the student's class level
3. Ask follow-up questions to check understanding
4. Use encouraging and positive language
5. If a student uploads a question image, break it down into steps and guide them through the thinking process
6. For math problems, show the method but let the student calculate the final answer
7. For science, explain the concept with real-life examples
8. Keep responses concise and easy to understand
9. Use Hindi/English mix if the student seems to prefer it
10. If asked to solve exam papers or give direct answers, politely refuse and offer to explain the concepts instead

RESPONSE FORMAT:
- Start with encouragement when appropriate
- Break complex topics into simple steps
- End with a question to check understanding or encourage further thinking
- Use emojis sparingly to keep it friendly 📚

Remember: You're building thinking ability, not dependency!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, imageUrl } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Build messages array
    const apiMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add conversation history
    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        if (msg.role === "user" && msg.imageUrl) {
          // Handle image in message
          apiMessages.push({
            role: "user",
            content: [
              { type: "text", text: msg.content || "Please explain this image" },
              { type: "image_url", image_url: { url: msg.imageUrl } }
            ]
          });
        } else {
          apiMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Use OpenRouter API with a vision-capable model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kalvion.lovable.app",
        "X-Title": "Kalvion Student AI"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
