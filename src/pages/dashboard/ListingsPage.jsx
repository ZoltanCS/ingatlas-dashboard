import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ListingTable from '../../components/dashboard/ListingTable'
import { getListings } from '../../lib/api'

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
  { key: 'agency', label: 'Iroda' },
]

export default function ListingsPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getListings()
      .then(p => setProperties(p))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = properties
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (planFilter !== 'all') list = list.filter(p => p.plan === planFilter)
    if (search) list = list.filter(p => p.address.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [properties, statusFilter, planFilter, search])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} />

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

        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Keresés cím alapján..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '8px 14px', fontSize: '12px',
                  border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '5px',
                  background: '#fff', outline: 'none', fontFamily: 'inherit',
                  minWidth: '240px',
                }}
              />
              <FilterGroup options={STATUS_FILTERS} selected={statusFilter} onChange={setStatusFilter} />
              <FilterGroup options={PLAN_FILTERS} selected={planFilter} onChange={setPlanFilter} />
            </div>

            <ListingTable properties={filtered} onRowClick={setSelected} />

            {selected && <DetailPanel listing={selected} onClose={() => setSelected(null)} />}
          </>
        )}
      </div>
    </>
  )
}

function FilterGroup({ options, selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '4px', background: '#f0f0f1', borderRadius: '5px', padding: '2px' }}>
      {options.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          style={{
            padding: '5px 12px', fontSize: '10px', fontFamily: 'inherit',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            background: selected === f.key ? '#fff' : 'transparent',
            color: selected === f.key ? '#0a0a0a' : '#999',
            fontWeight: selected === f.key ? 500 : 400,
          }}
        >{f.label}</button>
      ))}
    </div>
  )
}

function DetailPanel({ listing, onClose }) {
  return (
    <div style={{ marginTop: '20px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>{listing.address}</h2>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{listing.type} · {listing.rooms} szoba · {listing.sqm} m²</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#bbb' }}>✕</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <DetailItem label="Látogatók" value={listing.visits} />
        <DetailItem label="Chatbot kérdések" value={listing.chatbotQuestions} />
        <DetailItem label="Csomag" value={listing.plan === 'basic' ? 'Alap' : listing.plan === 'premium' ? 'Prémium' : listing.plan} />
        <DetailItem label="Státusz" value={STATUS_FILTERS.find(s => s.key === listing.status)?.label || listing.status} />
        <DetailItem label="Létrehozva" value={new Date(listing.createdAt).toLocaleDateString('hu')} />
        <DetailItem label="Lejárat" value={listing.expiresAt ? new Date(listing.expiresAt).toLocaleDateString('hu') : '—'} />
      </div>
      {listing.embedUrl && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <Btn primary onClick={() => navigator.clipboard.writeText(listing.embedUrl)}>Link másolása</Btn>
          <Btn onClick={() => window.open(listing.embedUrl, '_blank')}>Megnyitás</Btn>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div style={{ minWidth: '140px' }}>
      <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{value}</div>
    </div>
  )
}

function Btn({ primary, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px', fontSize: '11px', fontFamily: 'inherit',
        background: primary ? '#0a0a0a' : '#f0f0f1',
        color: primary ? '#fff' : '#0a0a0a',
        border: 'none', borderRadius: '4px', cursor: 'pointer',
        letterSpacing: '0.06em',
      }}
    >{children}</button>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>🏠</div>
      <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>Még nincsenek felvételeid</h3>
      <p style={{ fontSize: '13px', color: '#bbb', maxWidth: 400, margin: '0 auto' }}>
        A felvételek itt jelennek meg, miután elkészült az első 360°-os ingatlan bemutatód.
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
