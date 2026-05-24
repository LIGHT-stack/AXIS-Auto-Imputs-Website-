import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadSystemPrompt(): string {
  try {
    return readFileSync(
      join(process.cwd(), "ai", "prompts", "system.md"),
      "utf-8"
    );
  } catch {
    return `You are the AXIS Auto Imports sales assistant. Help customers find Korean-import vehicles for Ghana, estimate landed costs, and explain the import process. Be concise and professional.`;
  }
}

export async function POST(req: Request) {
  const { messages, vehicleContext } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error: "AI not configured",
        hint: "Set OPENAI_API_KEY in .env.local — legacy client-side chat still works.",
      },
      { status: 503 }
    );
  }

  const system = [
    loadSystemPrompt(),
    vehicleContext
      ? `\n\nCustomer is viewing: ${JSON.stringify(vehicleContext)}`
      : "",
  ].join("");

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
    system,
    messages,
  });

  return result.toDataStreamResponse();
}
