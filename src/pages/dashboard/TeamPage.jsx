import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getTeamMembers } from '../../lib/api'

const ROLE_LABELS = {
  admin: 'Adminisztrátor',
  manager: 'Manager',
  editor: 'Szerkesztő',
  viewer: 'Megtekintő',
}

const ROLE_STYLES = {
  admin: { bg: '#0a0a0a', color: '#fff' },
  manager: { bg: '#333', color: '#fff' },
  editor: { bg: '#f0f0f1', color: '#555' },
  viewer: { bg: '#f8f8f8', color: '#999' },
}

export default function TeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTeamMembers()
      .then(m => setMembers(m))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} />

  return (
    <>
      <Helmet><title>Csapat — Dashboard | Ingatlas</title></Helmet>
      <div style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Csapatkezelés</h1>
            <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
              {members.length} tag
            </p>
          </div>
          <button style={{ padding: '9px 20px', fontSize: '11px', fontFamily: 'inherit', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Tag hozzáadása
          </button>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '14px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {Object.entries(ROLE_LABELS).map(([key, label]) => {
            const style = ROLE_STYLES[key]
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '3px', background: style.bg, color: style.color, fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{key}</span>
                <span style={{ fontSize: '11px', color: '#666' }}>{label}</span>
              </div>
            )
          })}
        </div>

        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>👥</div>
            <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>Még nincsenek csapattagok</h3>
            <p style={{ fontSize: '13px', color: '#bbb', maxWidth: 400, margin: '0 auto' }}>
              Adj hozzá kollégákat, hogy ők is láthassák a felvételeket és statisztikákat.
            </p>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: '#0a0a0a', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', gap: '16px' }}>
              <span style={{ flex: 2 }}>Név</span>
              <span style={{ flex: 2 }}>Email</span>
              <span style={{ flex: 1 }}>Szerepkör</span>
              <span style={{ flex: 1 }}>Csatlakozott</span>
              <span style={{ width: '80px', textAlign: 'right' }}>Műveletek</span>
            </div>
            {members.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', borderBottom: i < members.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, fontFamily: '"JetBrains Mono", monospace', flexShrink: 0 }}>{m.avatar}</div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{m.name}</span>
                </div>
                <span style={{ flex: 2, fontSize: '11px', color: '#888' }}>{m.email}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '3px', background: ROLE_STYLES[m.role]?.bg || '#f0f0f1', color: ROLE_STYLES[m.role]?.color || '#999', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.role}</span>
                </span>
                <span style={{ flex: 1, fontSize: '11px', color: '#bbb' }}>{new Date(m.joined).toLocaleDateString('hu')}</span>
                <div style={{ width: '80px', textAlign: 'right', display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                  <button style={{ padding: '4px 10px', fontSize: '9px', fontFamily: 'inherit', background: '#f0f0f1', color: '#666', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Szerk.</button>
                  <button style={{ padding: '4px 10px', fontSize: '9px', fontFamily: 'inherit', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Eltáv.</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', border: '0.5px solid rgba(0,0,0,0.12)', borderTop: '0.5px solid rgba(0,0,0,0.55)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px' }}>
      <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: 500 }}>Hiba történt</div>
      <div style={{ fontSize: '12px', color: '#999' }}>{message}</div>
    </div>
  )
}
