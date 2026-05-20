import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getSeoTexts, getListings, generateSeoText } from '../../lib/api'

const STATUS_BADGE = {
  published: { bg: '#0a0a0a', color: '#fff', label: 'Közzétéve' },
  draft: { bg: '#f0f0f1', color: '#999', label: 'Vázlat' },
}

export default function SeoPage() {
  const [texts, setTexts] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    Promise.all([getSeoTexts(), getListings()])
      .then(([t, p]) => { setTexts(t); setProperties(p.filter(prop => prop.status === 'active')) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async (propertyId) => {
    setGenerating(propertyId)
    try {
      const newText = await generateSeoText(propertyId)
      setTexts(prev => [newText, ...prev])
      setMessage({ type: 'success', text: 'SEO szöveg sikeresen generálva!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Hiba történt a generálás során.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setGenerating(null)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} />

  return (
    <>
      <Helmet><title>SEO Szövegek — Dashboard | Ingatlas</title></Helmet>
      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>SEO Szövegek</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            AI-generált ingatlanleírások
          </p>
        </div>

        {message && (
          <div style={{ padding: '10px 16px', borderRadius: '5px', marginBottom: '16px', fontSize: '12px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `0.5px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
            {message.text}
          </div>
        )}

        {properties.length > 0 && (
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>Új SEO szöveg generálása</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {properties.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleGenerate(p.id)}
                  disabled={generating === p.id}
                  style={{
                    padding: '8px 16px', fontSize: '11px', fontFamily: 'inherit',
                    border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '5px',
                    cursor: generating === p.id ? 'wait' : 'pointer',
                    background: '#fff', color: '#333',
                    opacity: generating === p.id ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (generating !== p.id) { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.color = '#fff' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333' }}
                >
                  {generating === p.id ? 'Generálás...' : `+ ${p.address.split(',')[0]}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {texts.length === 0 && !properties.length && (
          <EmptyState />
        )}

        {texts.length === 0 && properties.length > 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Még nincsenek SEO szövegek</div>
            <p style={{ fontSize: '12px', color: '#bbb' }}>Válassz egy ingatlant fent, és generálj hozzá leírást.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {texts.map(text => {
            const badge = STATUS_BADGE[text.status] || STATUS_BADGE.draft
            return (
              <div key={text.id} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a', margin: 0 }}>{text.title}</h3>
                      <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '3px', background: badge.bg, color: badge.color, fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{badge.label}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 6px' }}>
                      {text.property} · {new Date(text.createdAt).toLocaleDateString('hu')}
                    </p>
                    {text.excerpt && (
                      <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6, margin: 0 }}>{text.excerpt}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => navigator.clipboard.writeText(text.excerpt || text.title)} style={{ padding: '5px 12px', fontSize: '10px', fontFamily: 'inherit', background: '#f0f0f1', color: '#555', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Másolás</button>
                    <button style={{ padding: '5px 12px', fontSize: '10px', fontFamily: 'inherit', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📝</div>
      <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>Nincsenek aktív felvételeid</h3>
      <p style={{ fontSize: '13px', color: '#bbb', maxWidth: 400, margin: '0 auto' }}>
        SEO szöveget csak aktív felvételekhez lehet generálni. Itt jelennek meg az AI által írt leírások.
      </p>
    </div>
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
