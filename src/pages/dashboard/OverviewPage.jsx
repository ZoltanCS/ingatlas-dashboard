import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import KpiCard from '../../components/dashboard/KpiCard'
import BarChart from '../../components/dashboard/BarChart'
import ListingTable from '../../components/dashboard/ListingTable'
import QuestionList from '../../components/dashboard/QuestionList'
import { getKpis, getMonthlyVisits, getListings, getChatbotQuestions } from '../../lib/api'

export default function OverviewPage() {
  const [kpis, setKpis] = useState(null)
  const [visits, setVisits] = useState([])
  const [properties, setProperties] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getKpis(),
      getMonthlyVisits(),
      getListings(),
      getChatbotQuestions(),
    ]).then(([k, v, p, q]) => {
      setKpis(k)
      setVisits(v)
      setProperties(p)
      setQuestions(q.slice(0, 8))
    }).catch(err => setError(err.message))
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} />

  const hasData = properties.length > 0
  const hasQuestions = questions.length > 0
  const hasVisits = visits.some(v => v.value > 0)

  return (
    <>
      <Helmet>
        <title>Áttekintő — Dashboard | Ingatlas</title>
      </Helmet>

      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Áttekintő</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>Ingatlas Dashboard</p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <KpiCard label="Aktív felvétel" value={kpis?.activeListings ?? 0} />
          <KpiCard label="Összes látogató" value={new Intl.NumberFormat('hu').format(kpis?.totalVisitors ?? 0)} />
          <KpiCard label="Chatbot kérdés" value={kpis?.chatbotQuestions ?? 0} />
          <KpiCard label="Konverziós ráta" value={`${kpis?.conversionRate ?? 0}%`} />
          <KpiCard label="Összes felvétel" value={kpis?.totalListings ?? 0} />
        </div>

        {/* No data state */}
        {!hasData && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            color: '#aaa',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
            <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#999', marginBottom: '8px' }}>
              Még nincsenek felvételeid
            </h3>
            <p style={{ fontSize: '13px', color: '#bbb', maxWidth: 400, margin: '0 auto' }}>
              Az első 360°-os felvétel után itt jelennek meg a statisztikáid, látogatóid és chatbot kérdéseid.
            </p>
          </div>
        )}

        {/* Chart + table row */}
        {hasData && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: '1.4', minWidth: '380px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '16px 20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '2px' }}>Havi látogatók</div>
              <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace' }}>2026</div>
              {hasVisits ? (
                <BarChart data={visits} labelKey="month" valueKey="value" height={130} />
              ) : (
                <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '12px' }}>
                  Még nincs látogatói adat
                </div>
              )}
            </div>
            <div style={{ flex: '1', minWidth: '320px' }}>
              <ListingTable properties={properties.slice(0, 6)} />
            </div>
          </div>
        )}

        {/* Recent questions */}
        {hasQuestions && (
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>Legutóbbi chatbot kérdések</h2>
            <QuestionList questions={questions} />
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
