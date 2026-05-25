import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const handle = async () => {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (!error) {
          window.history.replaceState({}, document.title, '/dashboard')
          navigate('/dashboard', { replace: true })
          return
        }
      }

      navigate('/dashboard', { replace: true })
    }

    handle()
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
        Bejelentkezés folyamatban...
      </div>
    </div>
  )
}
