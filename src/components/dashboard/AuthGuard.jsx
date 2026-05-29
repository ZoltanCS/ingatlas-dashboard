import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('auth_ok') === '1') {
      sessionStorage.removeItem('auth_ok')
      setWaiting(true)
      const t = setTimeout(() => setWaiting(false), 200)
      return () => clearTimeout(t)
    }
  }, [])

  if (loading || waiting) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '0.5px solid rgba(0,0,0,0.12)',
          borderTop: '0.5px solid rgba(0,0,0,0.55)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    window.location.href = `https://auth.ingatlas.hu/login?redirect_back=${encodeURIComponent(window.location.href)}`
    return null
  }

  return children
}
