// ============================================================
// PUT    /api/admins/[id] — update admin (super_admin only)
// DELETE /api/admins/[id] — delete admin (super_admin only)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent super_admin from deactivating themselves
  if (id === admin.id) {
    return NextResponse.json(
      { error: "Cannot modify your own account" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { full_name, role, is_active } = body;

  const updates: Record<string, unknown> = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (role !== undefined) updates.role = role;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  // Delete from auth.users (cascades to admin_users)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
