import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    ;(async () => {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('setSession failed:', error.message)
          window.location.replace('/dashboard')
          return
        }

        // Verify session is saved before redirecting
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          window.location.replace('/dashboard')
          return
        }

        // Retry once
        await new Promise(r => setTimeout(r, 300))
        const { data: retry } = await supabase.auth.getSession()
        if (retry?.session) {
          window.location.replace('/dashboard')
          return
        }
      }

      window.location.replace('/dashboard')
    })()
  }, [])

  return null
}
