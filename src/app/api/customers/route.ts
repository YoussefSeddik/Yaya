// ============================================================
// GET  /api/customers  — list customers (admin only)
// POST /api/customers  — create customer (public — checkout flow)
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("search");
  const page     = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 20));

  let query = supabaseAdmin
    .from("customers")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
    );
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
    data: data ?? [],
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone, email, address_street, address_area, address_city, address_governorate, notes } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("customers")
    .insert({ name, phone, email, address_street, address_area, address_city, address_governorate, notes })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
