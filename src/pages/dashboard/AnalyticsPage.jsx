import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import BarChart from '../../components/dashboard/BarChart'
import { getMonthlyVisits, getDailyVisits } from '../../lib/api'

export default function AnalyticsPage() {
  const [monthly, setMonthly] = useState([])
  const [daily, setDaily] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMonthlyVisits(), getDailyVisits()]).then(([m, d]) => {
      setMonthly(m)
      setDaily(d)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />

  const totalMonthly = monthly.reduce((s, m) => s + m.value, 0)
  const totalDaily = daily.reduce((s, d) => s + d.value, 0)
  const avgMonthly = Math.round(totalMonthly / 12)
  const avgDaily = Math.round(totalDaily / daily.length)

  return (
    <>
      <Helmet>
        <title>Analitika — Dashboard | Ingatlas</title>
      </Helmet>

      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Analitika</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            Részletes látogatói statisztikák
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Éves összes látogató', value: new Intl.NumberFormat('hu').format(totalMonthly) },
            { label: 'Havi átlag', value: new Intl.NumberFormat('hu').format(avgMonthly) },
            { label: 'Napi átlag (elmúlt 30 nap)', value: Math.round(avgDaily) },
            { label: 'Legjobb hónap', value: `${monthly.reduce((best, m) => m.value > best.value ? m : best).month} (${monthly.reduce((best, m) => m.value > best.value ? m : best).value})` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
                borderRadius: '6px', padding: '14px 20px', flex: '1 1 180px',
              }}
            >
              <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Monthly chart */}
        <div style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
          borderRadius: '6px', padding: '20px 24px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Havi látogatók — 2026</div>
              <div style={{ fontSize: '10px', color: '#ccc', fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>
                Összesen: {new Intl.NumberFormat('hu').format(totalMonthly)}
              </div>
            </div>
          </div>
          <BarChart data={monthly} labelKey="month" valueKey="value" height={160} />
        </div>

        {/* Daily chart */}
        <div style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
          borderRadius: '6px', padding: '20px 24px',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Napi látogatók — Elmúlt 30 nap</div>
            <div style={{ fontSize: '10px', color: '#ccc', fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>
              Átlag: {Math.round(avgDaily)} / nap
            </div>
          </div>
          <BarChart data={daily} labelKey="date" valueKey="value" color="#555" height={140} />
        </div>

        {/* Source breakdown — static for now */}
        <div style={{
          marginTop: '20px',
          display: 'flex', flexWrap: 'wrap', gap: '12px',
        }}>
          {[
            { source: 'Közvetlen', pct: 45, color: '#0a0a0a' },
            { source: 'Közösségi média', pct: 28, color: '#333' },
            { source: 'Kereső', pct: 18, color: '#666' },
            { source: 'Hirdetés', pct: 9, color: '#999' },
          ].map(({ source, pct, color }) => (
            <div
              key={source}
              style={{
                background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
                borderRadius: '6px', padding: '16px 20px', flex: '1 1 150px',
              }}
            >
              <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '8px' }}>{source}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 500, color: '#0a0a0a' }}>{pct}%</span>
              </div>
              <div style={{ marginTop: '8px', height: '4px', background: '#f0f0f1', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
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
