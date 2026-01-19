// src/services/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Don't persist during password recovery
      autoRefreshToken: false,
      detectSessionInUrl: false, // We'll handle it manually
    },
  }
);