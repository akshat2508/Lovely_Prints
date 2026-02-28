import { createClient } from "@supabase/supabase-js";
import { config } from './env.js';

const supabaseAdmin = createClient(
  config.supabase.url ,   process.env.SUPABASE_SERVICE_ROLE_KEY

);

export default supabaseAdmin;