// ============================================================
// GET    /api/products/[id] — get single product (public)
// PUT    /api/products/[id] — update product (admin only)
// DELETE /api/products/[id] — delete product (admin only)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";

function toProduct(row: Record<string, unknown>) {
  const { image, ...rest } = row;
  return { ...rest, image_url: image };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ data: toProduct(data) });
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
  const { image_url, id: _id, created_at, updated_at, ...rest } = body;

  const updates: Record<string, unknown> = { ...rest };
  if (image_url !== undefined) updates.image = image_url;

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: toProduct(data) });
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
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
