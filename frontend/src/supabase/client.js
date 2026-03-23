import { createClient } from "@supabase/supabase-js";
// console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
// console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or Key is missing! Check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
