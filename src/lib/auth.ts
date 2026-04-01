// ============================================================
// YAYA BABY – Server-side auth helper
// Used in API routes to verify the calling user is an admin
// ============================================================
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AdminUser } from "@/app/types";

/** Returns the authenticated AdminUser or null if unauthorized */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();

    if (!data) return null;

    return { ...data, email: user.email ?? data.email } as AdminUser;
  } catch {
    return null;
  }
}

/** Returns true only if the admin has super_admin role */
export async function requireSuperAdmin(): Promise<AdminUser | null> {
  const admin = await getAdminUser();
  if (!admin || admin.role !== "super_admin") return null;
  return admin;
}
