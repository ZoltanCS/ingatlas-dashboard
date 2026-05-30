import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AUTH_API = 'https://auth.ingatlas.hu/silent-auth?json=1'

export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    const load = async () => {
      // 1. Check localStorage first
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!mounted.current) return
        if (s) {
          setSession(s)
          setUser(s.user ?? null)
          setLoading(false)
          return
        }
      } catch { /* ignore */ }

      // 2. No local session — check auth server via JSON API
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
      } catch { /* network error */ }

      if (!mounted.current) return
      setSession(null)
      setUser(null)
      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, s) => {
        if (!mounted.current) return
        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setLoading(false)
          return
        }
        setSession(s)
        setUser(s?.user ?? null)
        setLoading(false)
      },
    )

    const poll = setInterval(async () => {
      if (!mounted.current) return
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        if (s) {
          const { error } = await supabase.auth.refreshSession()
          if (error && mounted.current) {
            setSession(null)
            setUser(null)
          }
        }
      } catch { /* ignore */ }
    }, 10000)

    return () => {
      mounted.current = false
      subscription.unsubscribe()
      clearInterval(poll)
    }
  }, [])

  return { user, session, loading }
}
