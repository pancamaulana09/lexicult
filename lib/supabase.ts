import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

export const createBrowserSupabaseClientTyped = () => {
  return createBrowserSupabaseClient<Database>();
};
