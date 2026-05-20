import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import KpiCard from '../../components/dashboard/KpiCard'
import BarChart from '../../components/dashboard/BarChart'
import ListingTable from '../../components/dashboard/ListingTable'
import QuestionList from '../../components/dashboard/QuestionList'
import { getKpis, getMonthlyVisits, getProperties, getChatbotQuestions } from '../../lib/api'

export default function OverviewPage() {
  const [kpis, setKpis] = useState(null)
  const [visits, setVisits] = useState([])
  const [properties, setProperties] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getKpis(),
      getMonthlyVisits(),
      getProperties(),
      getChatbotQuestions(),
    ]).then(([k, v, p, q]) => {
      setKpis(k)
      setVisits(v)
      setProperties(p)
      setQuestions(q.slice(0, 8))
      setLoading(false)
    })
  }, [])

  if (loading) {
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
          <KpiCard label="Aktív felvétel" value={kpis.activeListings} delta="+3 ez a hét" positive={true} />
          <KpiCard label="Összes látogató" value={new Intl.NumberFormat('hu').format(kpis.totalVisitors)} delta="+22,4%" positive={true} />
          <KpiCard label="Chatbot kérdés" value={kpis.chatbotQuestions} delta={`Ma: ${kpis.chatbotQuestionsToday}`} positive={null} />
          <KpiCard label="Konverziós ráta" value={`${kpis.conversionRate}%`} delta="+1.2%" positive={true} />
          <KpiCard label="Átlagos idő" value={kpis.avgViewTime} />
        </div>

        {/* Chart + recent listings row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: '1.4', minWidth: '380px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '2px' }}>Havi látogatók</div>
            <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace' }}>2026</div>
            <BarChart data={visits} labelKey="month" valueKey="value" height={130} />
          </div>

          <div style={{ flex: '1', minWidth: '320px' }}>
            <ListingTable properties={properties.slice(0, 6)} />
          </div>
        </div>

        {/* Recent questions */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>Legutóbbi chatbot kérdések</h2>
          <QuestionList questions={questions} />
        </div>
      </div>
    </>
  )
}
