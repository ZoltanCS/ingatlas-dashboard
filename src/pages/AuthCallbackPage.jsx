import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const go = async () => {
      const p = new URLSearchParams(window.location.search)
      const at = p.get('access_token')
      const rt = p.get('refresh_token')

      if (at && rt) {
        await supabase.auth.setSession({ access_token: at, refresh_token: rt })
      }

      sessionStorage.setItem('auth_ok', '1')
      window.location.replace('/dashboard')
    }

    go()
  }, [])

  return null
}
