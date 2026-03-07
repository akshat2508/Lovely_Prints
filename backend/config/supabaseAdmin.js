import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

export default supabaseAdmin;