// ============================================================
// GET    /api/customers/[id] — get customer + order history (admin only)
// PUT    /api/customers/[id] — update customer (admin only)
// DELETE /api/customers/[id] — delete customer (admin only)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  // Fetch order history
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data: { ...data, orders: orders ?? [] } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { id: _id, created_at, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("customers")
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
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
