import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  vehicleId: z.number().optional(),
  message: z.string().min(10),
  source: z.enum(["web", "whatsapp", "chat"]).default("web"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: persist via Prisma + notify CRM (HubSpot / Resend)
  console.info("[lead]", parsed.data);

  return NextResponse.json({ ok: true, id: `lead_${Date.now()}` });
}
