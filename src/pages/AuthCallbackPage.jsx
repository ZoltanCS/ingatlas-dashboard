import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const handle = async () => {
      // Give Supabase a moment to auto-detect tokens from URL
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.replace('/dashboard')
        return
      }

      // If no session yet, try manual token exchange as fallback
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (!error) {
          window.location.replace('/dashboard')
          return
        }
      }

      // Nothing worked — go to dashboard anyway (AuthGuard handles auth)
      window.location.replace('/dashboard')
    }

    handle()
  }, [])

  return null
}
