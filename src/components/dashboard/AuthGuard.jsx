import useAuth from '../../hooks/useAuth'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
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
    const returnUrl = encodeURIComponent(window.location.href)
    window.location.href = `https://auth.ingatlas.hu/login?redirect_back=${returnUrl}`
    return null
  }

  return children
}
