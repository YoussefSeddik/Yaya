// ============================================================
// GET  /api/products  — list products (public: active only; admin: all)
// POST /api/products  — create product (admin only)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";

// Map DB row (image col) → Product type (image_url field)
function toProduct(row: Record<string, unknown>) {
  const { image, ...rest } = row;
  return { ...rest, image_url: image };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("search");
  const category = searchParams.get("category");
  const page     = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 20));

  // Check if caller is admin (to decide whether to include inactive products)
  const admin = await getAdminUser();

  let query = supabaseAdmin
    .from("products")
    .select("*", { count: "exact" });

  // Non-admins only see active products
  if (!admin) {
    query = query.eq("is_active", true);
  } else {
    const isActive = searchParams.get("is_active");
    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const start = (page - 1) * pageSize;
  query = query
    .range(start, start + pageSize - 1)
    .order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    data: (data ?? []).map(toProduct),
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { image_url, updated_at, ...rest } = body;

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ ...rest, image: image_url ?? "" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: toProduct(data) }, { status: 201 });
}
