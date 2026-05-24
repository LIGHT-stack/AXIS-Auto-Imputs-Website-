import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Admin login not configured" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const secret = body?.secret;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "axis_admin",
      value: process.env.ADMIN_SECRET,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
