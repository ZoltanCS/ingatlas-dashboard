import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Sidebar from '../../components/dashboard/Sidebar'
import useAuth from '../../hooks/useAuth'
import useMobile from '../../hooks/useMobile'

export default function DashboardLayout() {
  const { user, loading } = useAuth()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : user?.user_metadata?.full_name
      ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '??'

  return (
    <>
      <Helmet>
        <title>Dashboard — Ingatlas</title>
      </Helmet>

      <div style={{ display: 'flex', height: '100vh', background: '#f8f8f9' }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 30,
              background: 'rgba(0,0,0,0.15)',
            }}
          />
        )}

        {/* Sidebar — visible always on desktop, toggle on mobile */}
        <div style={{
          ...(isMobile ? {
            position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-220px', bottom: 0, zIndex: 40,
            transition: 'left 0.2s ease',
          } : {}),
        }}>
          <Sidebar collapsed={false} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* Top bar */}
          <header style={{
            height: '48px',
            flexShrink: 0,
            background: '#fff',
            borderBottom: '0.5px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', color: '#666', display: 'flex',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: '#aaa',
                textTransform: 'uppercase',
              }}>
                Dashboard
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Auth state */}
              {!loading && (
                user ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '11px', color: '#0a0a0a', fontWeight: 400,
                  }}>
                    <div style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      background: '#0a0a0a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 500,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      {userInitials}
                    </div>
                    <span style={{ color: '#666' }}>{user.email}</span>
                  </div>
                ) : (
                  <a
                    href="https://auth.ingatlas.hu/login?redirect_back=https://dashboard.ingatlas.hu"
                    style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      letterSpacing: '0.08em',
                      color: '#0a0a0a',
                      textDecoration: 'none',
                      padding: '6px 14px',
                      border: '0.5px solid rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Belépés
                  </a>
                )
              )}
            </div>
          </header>

          {/* Scrollable content */}
          <main style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
