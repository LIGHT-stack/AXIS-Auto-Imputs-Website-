# Security

## Secrets

- Store API keys in `.env.local` only — never commit.
- Rotate `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, and CRM keys on staff changes.

## Admin

- Replace demo login in legacy admin with NextAuth or Clerk before production.
- Protect `/admin` via `src/middleware.ts` once sessions exist.

## API

- Validate all POST bodies with Zod (`/api/leads`).
- Rate-limit `/api/chat` in production (Vercel WAF or Upstash).
- Sanitize user messages before logging.

## Data

- Encrypt `DATABASE_URL` connections (TLS).
- Minimize PII in chat logs; define retention policy.

## Dependencies

Run `npm audit` monthly; enable Dependabot on GitHub.
