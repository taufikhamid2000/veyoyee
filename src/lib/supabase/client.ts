import { createBrowserClient } from "@supabase/ssr";

// Create a client-side Supabase client that persists session in cookies
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}

// Export legacy function for backward compatibility
export const getServiceSupabase = () => {
  return createClient();
};
