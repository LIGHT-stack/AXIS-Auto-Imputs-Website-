# RAG pipeline (outline)

## Documents to ingest

1. All vehicle records (description, features, specs)
2. `content/legal/*.md` and FAQ content
3. `docs/INVENTORY_DATA.md` process notes
4. Static import process copy

## Steps

```bash
# 1. Export chunks (implement scripts/rag-ingest.ts)
# 2. Embed via OpenAI text-embedding-3-small
# 3. Store in pgvector column or external vector DB
# 4. At chat time: embed user query → top 5 chunks → inject into system prompt
```

## Schema addition (pgvector)

```sql
CREATE EXTENSION vector;
-- Add embedding column to Vehicle or separate document_chunks table
```

## Quality

- Re-run `ai/evals/chat-quality.json` after index updates.
- Monitor hallucinated stock in production logs.
