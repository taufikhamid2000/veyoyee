import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name) {
          res.cookies.delete(name);
        },
      },
    }
  );

  // IMPORTANT: Call getUser() to refresh tokens if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle auth redirects
  const isAuthPage = pathname.startsWith("/auth/");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // If user is signed in and on an auth page, redirect to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not signed in and on a protected page, redirect to signin
  if (!user && isDashboardPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return res;
}

// only run on routes that ever touch Supabase but skip static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
