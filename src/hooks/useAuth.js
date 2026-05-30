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
