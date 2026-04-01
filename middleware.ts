// ============================================================
// YAYA BABY – Middleware: protect /admin routes
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through without auth check
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Validate session with Supabase (does network call to verify JWT)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Check admin_users table — user must exist and be active
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!adminUser || !adminUser.is_active) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
