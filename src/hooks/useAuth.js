import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AUTH_API = 'https://auth.ingatlas.hu/api/me'

export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    const checkAuth = async () => {
      // 1. Check localStorage first (fast path)
      try {
        const { data: { session: localSession } } = await supabase.auth.getSession()
        if (!mounted.current) return
        if (localSession) {
          setSession(localSession)
          setUser(localSession.user ?? null)
          setLoading(false)
          return
        }
      } catch { /* ignore */ }

      // 2. No local session — fetch from auth API (cross-domain cookie session)
      try {
        const res = await fetch(AUTH_API, { credentials: 'include' })
        if (!mounted.current) return
        if (res.ok) {
          const data = await res.json()
          if (data.session) {
            const { error } = await supabase.auth.setSession({
              access_token: data.session.accessToken,
              refresh_token: data.session.refreshToken,
            })
            if (!error) {
              const { data: { session: s } } = await supabase.auth.getSession()
              if (!mounted.current) return
              if (s) {
                setSession(s)
                setUser(s.user ?? null)
                setLoading(false)
                return
              }
            }
          }
        }
      } catch { /* network error — treat as not authenticated */ }

      if (!mounted.current) return
      setSession(null)
      setUser(null)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes on this domain
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (!mounted.current) return
        setSession(s)
        setUser(s?.user ?? null)
        setLoading(false)
      },
    )

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, session, loading }
}
