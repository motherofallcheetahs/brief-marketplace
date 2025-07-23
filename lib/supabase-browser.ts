// lib/supabase-browser.ts
import { createClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase client that runs in the browser.
 * Uses the public anon key.
 */
export const supabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
