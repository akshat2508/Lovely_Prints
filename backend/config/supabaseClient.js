// config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

const supabase = createClient(config.supabase.url, config.supabase.key);

export default supabase;