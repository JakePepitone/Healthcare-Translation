import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (for development)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= limit) {
    return false;
  }
  
  userRequests.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { inputText, inputLang, outputLang } = await req.json();

    // Validate input
    if (!inputText || !inputLang || !outputLang) {
      return NextResponse.json(
        { error: "Missing required fields: inputText, inputLang, outputLang" },
        { status: 400 }
      );
    }

    // Simple rate limiting (10 requests per minute per IP)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIP, 10, 60000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before making another request." },
        { status: 429 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    console.log(`Translating from ${inputLang} to ${outputLang}: ${inputText.substring(0, 50)}...`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional healthcare translation assistant specializing in medical terminology and patient communication. Your role is to provide accurate, clear translations that maintain medical accuracy while being easily understandable.

Key guidelines:
1. Translate medical terms accurately using appropriate terminology in the target language
2. Maintain the professional but compassionate tone typical in healthcare settings
3. Ensure the translation is natural and conversational, not robotic
4. Preserve any medical context or urgency in the message
5. Use formal language appropriate for healthcare communication
6. If there are medical terms that don't have direct translations, provide the closest equivalent and consider adding a brief explanation if needed

Translate the following text from ${inputLang} to ${outputLang}. Provide only the translated text without any additional explanations, formatting, or metadata.`,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      console.error("Response status:", response.status);
      console.error("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (response.status === 429) {
        console.error("Rate limit details:", errorData);
        return NextResponse.json(
          { error: `OpenAI rate limit exceeded. Details: ${JSON.stringify(errorData)}` },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorData)}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content?.trim();
    
    if (!translated) {
      return NextResponse.json(
        { error: "No translation received from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error during translation" },
      { status: 500 }
    );
  }
}
