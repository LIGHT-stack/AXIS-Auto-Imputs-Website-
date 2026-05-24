# API Reference

## `GET /api/vehicles`

Query params: `brand`, `status`

Response:

```json
{ "data": [/* Vehicle[] */], "count": 8 }
```

## `POST /api/leads`

Body:

```json
{
  "name": "Emmanuel Asante",
  "phone": "+233244123456",
  "email": "optional@email.com",
  "vehicleId": 1,
  "message": "Interested in the Sportage",
  "source": "web"
}
```

## `POST /api/chat`

Streaming AI response (Vercel AI SDK data stream).

Body:

```json
{
  "messages": [{ "role": "user", "content": "How much to clear a $14,500 SUV?" }],
  "vehicleContext": { "brand": "Kia", "model": "Sportage", "price": 14500 }
}
```

Requires `OPENAI_API_KEY`.
