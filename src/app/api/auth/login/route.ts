// ============================================================
// POST /api/auth/login
// Validates that the Supabase-authenticated user is an admin.
// The actual sign-in happens client-side via supabase.auth.signInWithPassword().
// This endpoint is called after that to confirm admin status.
// ============================================================
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";

export async function POST() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json(
      { error: "Not authorized as an admin" },
      { status: 403 }
    );
  }

  return NextResponse.json({ data: admin });
}
