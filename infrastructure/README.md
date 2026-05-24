# Infrastructure

## Local database

```bash
docker compose up -d
```

Set in `.env.local`:

```
DATABASE_URL=postgresql://axis:axis@localhost:5432/axis_auto_imports
```

Then:

```bash
npx prisma db push
npm run seed
```

## Production

- **Hosting:** Vercel
- **Database:** Neon, Supabase, or Vercel Postgres
- **Media:** Cloudinary or S3 + CloudFront
- **Email:** Resend for lead notifications
