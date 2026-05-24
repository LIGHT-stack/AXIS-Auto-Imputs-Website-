# AI Development Guide

## Goals

1. **Sales assistant** — answer questions about stock, import timeline, clearance estimates.
2. **Vehicle-aware chat** — pass `vehicleContext` when user is on a VDP (vehicle detail page).
3. **Lead qualification** — suggest WhatsApp handoff for quotes and financing.

## Layout

```
ai/
├── prompts/           # Version-controlled system & task prompts
│   ├── system.md
│   ├── sales-assistant.md
│   └── vehicle-qa.md
├── rag/               # Ingestion scripts for inventory + FAQ
│   └── README.md
└── evals/             # Regression tests for prompt quality
    └── chat-quality.json
```

## API: `/api/chat`

- Uses [Vercel AI SDK](https://sdk.vercel.ai/) `streamText` with OpenAI-compatible models.
- Set `OPENAI_API_KEY` and optional `OPENAI_MODEL` in `.env.local`.
- Until configured, the **legacy client-side** keyword chat in `AxisApp.jsx` still works.

## Client integration (next step)

```tsx
import { useChat } from "ai/react";

const { messages, input, handleSubmit } = useChat({
  api: "/api/chat",
  body: { vehicleContext: vehicle },
});
```

## RAG (recommended)

1. Chunk vehicle descriptions + FAQ markdown from `content/`.
2. Embed with OpenAI `text-embedding-3-small` (or local model).
3. Store vectors in pgvector / Pinecone / Supabase.
4. Retrieve top-k chunks before each `streamText` call.

See `ai/rag/README.md` for ingestion outline.

## Evals

Add cases to `ai/evals/chat-quality.json` — expected topics: clearance math, shipping time, auction grades, WhatsApp escalation.

Run evals in CI before prompt changes ship.

## Safety

- Do not invent stock — ground answers in retrieved inventory or say "contact us."
- Disclose estimates are non-binding vs CEPS final assessment.
- Log sessions in `ChatSession` (Prisma) for quality review.
