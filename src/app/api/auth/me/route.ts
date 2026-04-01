// ============================================================
// GET /api/auth/me — returns current admin user info
// ============================================================
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: admin });
}
