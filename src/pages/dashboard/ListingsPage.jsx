import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ListingTable from '../../components/dashboard/ListingTable'
import { getProperties } from '../../lib/api'

const STATUS_FILTERS = [
  { key: 'all', label: 'Mind' },
  { key: 'active', label: 'Aktív' },
  { key: 'expired', label: 'Lejárt' },
  { key: 'processing', label: 'Feldolgozás alatt' },
]

const PLAN_FILTERS = [
  { key: 'all', label: 'Mind' },
  { key: 'basic', label: 'Alap' },
  { key: 'premium', label: 'Prémium' },
]

export default function ListingsPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getProperties().then(p => { setProperties(p); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    let list = properties
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (planFilter !== 'all') list = list.filter(p => p.plan === planFilter)
    if (search) list = list.filter(p => p.address.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [properties, statusFilter, planFilter, search])

  if (loading) return <Spinner />

  return (
    <>
      <Helmet>
        <title>Felvételeim — Dashboard | Ingatlas</title>
      </Helmet>

      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Felvételeim</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            {filtered.length} / {properties.length} ingatlan
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Keresés cím alapján..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              border: '0.5px solid rgba(0,0,0,0.12)',
              borderRadius: '5px',
              background: '#fff',
              outline: 'none',
              fontFamily: 'inherit',
              minWidth: '240px',
            }}
          />

          <div style={{ display: 'flex', gap: '4px', background: '#f0f0f1', borderRadius: '5px', padding: '2px' }}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                style={{
                  padding: '5px 12px',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: statusFilter === f.key ? '#fff' : 'transparent',
                  color: statusFilter === f.key ? '#0a0a0a' : '#999',
                  fontWeight: statusFilter === f.key ? 500 : 400,
                  transition: 'all 0.15s ease',
                }}
              >{f.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '4px', background: '#f0f0f1', borderRadius: '5px', padding: '2px' }}>
            {PLAN_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setPlanFilter(f.key)}
                style={{
                  padding: '5px 12px',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: planFilter === f.key ? '#fff' : 'transparent',
                  color: planFilter === f.key ? '#0a0a0a' : '#999',
                  fontWeight: planFilter === f.key ? 500 : 400,
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        <ListingTable properties={filtered} onRowClick={setSelected} />

        {/* Detail panel */}
        {selected && (
          <div style={{
            marginTop: '20px',
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.07)',
            borderRadius: '6px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>{selected.address}</h2>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{selected.type} · {selected.rooms} szoba · {selected.sqm} m²</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '16px', color: '#bbb', padding: '4px',
                }}
              >✕</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {[
                { label: 'Látogatók', value: selected.visits },
                { label: 'Chatbot kérdések', value: selected.chatbotQuestions },
                { label: 'Csomag', value: selected.plan === 'basic' ? 'Alap' : 'Prémium' },
                { label: 'Státusz', value: selected.status === 'active' ? 'Aktív' : selected.status === 'expired' ? 'Lejárt' : 'Feldolgozás alatt' },
                { label: 'Létrehozva', value: new Date(selected.createdAt).toLocaleDateString('hu') },
                { label: 'Lejárat', value: new Date(selected.expiresAt).toLocaleDateString('hu') },
              ].map(({ label, value }) => (
                <div key={label} style={{ minWidth: '140px' }}>
                  <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{value}</div>
                </div>
              ))}
            </div>

            {selected.embedUrl && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button style={{
                  padding: '8px 20px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  background: '#0a0a0a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}>Link másolása</button>
                <button style={{
                  padding: '8px 20px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  background: '#f0f0f1',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}>Megnyitás</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
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
