import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("supabase url or key is not defined");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
