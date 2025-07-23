// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js'

/**
 * Admin‑level client for API routes, webhooks, edge functions, etc.
 * Uses the service‑role key (NEVER expose this in the browser!).
 */
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

/**
 * (Optional) If you ever need cookie‑based user sessions
 * in a Server Component or route handler, uncomment and use:
 *
 * import { cookies } from 'next/headers'
 *
 * export const supabaseServer = () => {
 *   const cookieStore = cookies()
 *   return createClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *     { global: { headers: { cookie: cookieStore.toString() } } }
 *   )
 * }
 */
