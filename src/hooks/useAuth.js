import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    const load = async () => {
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

      if (!mounted.current) return
      setSession(null)
      setUser(null)
      setLoading(false)
    }

    load()

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
