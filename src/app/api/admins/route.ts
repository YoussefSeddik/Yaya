// ============================================================
// GET  /api/admins — list all admin users (super_admin only)
// POST /api/admins — create a new admin user (super_admin only)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, password, full_name, role } = await request.json();

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "email, password, and full_name are required" },
      { status: 400 }
    );
  }

  if (role && !["super_admin", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // 1. Create the Supabase Auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create auth user" },
      { status: 500 }
    );
  }

  // 2. Insert into admin_users table
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert({
      id: authData.user.id,
      email,
      full_name,
      role: role ?? "admin",
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    // Rollback: delete the auth user we just created
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
