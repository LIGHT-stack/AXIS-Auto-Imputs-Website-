/**
 * Server-side AI helpers for inventory Q&A, lead qualification, and RAG.
 * Wire to /api/chat and future vector search (see ai/rag/).
 */

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function streamChat(
  messages: ChatMessage[],
  options?: { vehicleContext?: Record<string, unknown> }
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      vehicleContext: options?.vehicleContext,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Chat request failed");
  }

  return res;
}
