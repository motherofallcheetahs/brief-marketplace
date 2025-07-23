// app/debug/page.tsx
'use client'

import { useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function Debug() {
  useEffect(() => {
    ;(async () => {
      const supabase = supabaseBrowser()
      const { data, error } = await supabase
        .from('users_profile')            // any public table works
        .select('*')
      console.log('Supabase data →', data, 'error →', error)
    })()
  }, [])

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Debug page</h1>
      <p>
        Open DevTools → Console & Network. You should see a <code>users_profile</code>{' '}
        request and the data/error logged.
      </p>
    </div>
  )
}
