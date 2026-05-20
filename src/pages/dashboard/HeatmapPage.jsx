import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { getHeatmapData } from '../../lib/api'

export default function HeatmapPage() {
  const [data, setData] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getHeatmapData()
      .then(d => { setData(d); setSelected(d[0] || null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} />

  if (data.length === 0) {
    return (
      <>
        <Helmet><title>Szoba-hőtérképek — Dashboard | Ingatlas</title></Helmet>
        <EmptyState />
      </>
    )
  }

  return (
    <>
      <Helmet><title>Szoba-hőtérképek — Dashboard | Ingatlas</title></Helmet>
      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Szoba-hőtérképek</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            Melyik szobában töltik a legtöbb időt az érdeklődők
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {data.map(d => (
            <button
              key={d.propertyId}
              onClick={() => setSelected(d)}
              style={{
                padding: '8px 16px', fontSize: '11px', fontFamily: 'inherit',
                border: selected?.propertyId === d.propertyId ? '1px solid #0a0a0a' : '0.5px solid rgba(0,0,0,0.12)',
                borderRadius: '5px', cursor: 'pointer',
                background: selected?.propertyId === d.propertyId ? '#0a0a0a' : '#fff',
                color: selected?.propertyId === d.propertyId ? '#fff' : '#666',
                fontWeight: selected?.propertyId === d.propertyId ? 500 : 400,
              }}
            >{d.property}</button>
          ))}
        </div>

        {selected && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <StatCard label="Összes megtekintési idő" value={selected.totalViewTime} />
              <StatCard label="Átlagos idő / látogató" value={selected.avgViewTime} />
              <StatCard label="Szobák száma" value={selected.rooms.length} />
            </div>

            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '20px 24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '16px' }}>
                Időeloszlás szobánként — {selected.property}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selected.rooms.map((room, i) => (
                  <div key={room.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#555', width: '130px', textAlign: 'right', flexShrink: 0 }}>{room.name}</span>
                    <div style={{ flex: 1, height: '28px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${room.timePercent}%`, background: ['#0a0a0a', '#222', '#444', '#666', '#888', '#aaa'][i] || '#0a0a0a', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: i < 3 ? '#fff' : '#555' }}>{room.timePercent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '20px 24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '16px' }}>Hőtérkép vizualizáció</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                {selected.rooms.map(room => (
                  <div key={room.name} style={{ padding: '16px 12px', borderRadius: '6px', textAlign: 'center', background: `rgba(0,0,0,${0.03 + room.timePercent * 0.008})`, border: room.timePercent > 20 ? '1px solid rgba(0,0,0,0.25)' : '0.5px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '22px', fontWeight: 500, color: '#0a0a0a', marginBottom: '4px' }}>{room.timePercent}%</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{room.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '14px 20px', flex: '1 1 160px' }}>
      <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a' }}>{value}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>🗺️</div>
      <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>Még nincsenek hőtérkép adatok</h3>
      <p style={{ fontSize: '13px', color: '#bbb', maxWidth: 400, margin: '0 auto' }}>
        A 360°-os túrák szoba-hőtérkép adatai itt jelennek meg, miután az érdeklődők elkezdték használni a virtuális bejárást.
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
