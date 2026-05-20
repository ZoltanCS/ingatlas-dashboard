import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const retryRef = useRef(0)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!mounted) return
        if (s) {
          setSession(s)
          setUser(s.user ?? null)
          setLoading(false)
          return
        }
        if (retryRef.current < 3) {
          retryRef.current++
          setTimeout(loadSession, 150)
          return
        }
        setSession(null)
        setUser(null)
        setLoading(false)
      } catch {
        if (!mounted) return
        setSession(null)
        setUser(null)
        setLoading(false)
      }
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (!mounted) return
        setSession(s)
        setUser(s?.user ?? null)
        setLoading(false)
        retryRef.current = 0
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, session, loading }
}
