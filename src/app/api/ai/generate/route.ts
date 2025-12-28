import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function POST(req: Request) {
  try {
    const { prompt, keywords } = await req.json();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    if (!prompt || prompt.length < 3) {
      return NextResponse.json({ error: "Prompt is too short" }, { status: 400 });
    }

    const models = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
      "microsoft/phi-3-mini-128k-instruct:free"
    ];

    let generatedText = "";
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Trying AI model: ${model}...`);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "Admin Dashboard",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
         messages: [
  {
    role: "system",
    content: "You are an e-commerce copywriter. Generate 3-5 concise, professional product description bullet points based on the product name and keywords provided. Do not add conversational filler. Just the bullets."
  },
  {
    role: "user",
    content: `Product Name: ${prompt}\nKeywords/Features: ${keywords || "General features"}`
  }
],
            temperature: 0.7,
            max_tokens: 200,
          })
        });

        const data = await response.json();

        if (!response.ok) {
           throw new Error(data.error?.message || "Provider error");
        }

        generatedText = data.choices?.[0]?.message?.content || "";
        
        if (generatedText) {
          break;
        }
        
      } catch (error: any) {
        console.warn(`Model ${model} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!generatedText) {
      throw lastError || new Error("All AI models failed. Please try again later.");
    }

    return NextResponse.json({ text: generatedText });

  } catch (error: any) {
    console.error("AI Generation Fatal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
