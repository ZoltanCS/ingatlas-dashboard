import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import QuestionList from '../../components/dashboard/QuestionList'
import BarChart from '../../components/dashboard/BarChart'
import { getChatbotQuestions, getCategoryCounts } from '../../lib/api'

export default function ChatbotAnalyticsPage() {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getChatbotQuestions(), getCategoryCounts()]).then(([q, c]) => {
      setQuestions(q)
      setCategories(c)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />

  const totalQuestions = questions.reduce((s, q) => s + q.count, 0)
  const catData = Object.entries(categories).map(([name, value]) => ({ name, value }))
  const catLabels = {
    belmagasság: 'Belmagasság', tájolás: 'Tájolás', parkolás: 'Parkolás',
    költség: 'Költség', közlekedés: 'Közlekedés', alapterület: 'Alapterület',
    felszereltség: 'Felszereltség', épület: 'Épület', környék: 'Környék',
  }

  return (
    <>
      <Helmet>
        <title>AI Chatbot Analitika — Dashboard | Ingatlas</title>
      </Helmet>

      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>AI Chatbot Analitika</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            Összesen {totalQuestions} kérdés
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {/* Category breakdown */}
          <div style={{ flex: '1', minWidth: '380px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '2px' }}>Kérdések kategóriánként</div>
            <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '16px', fontFamily: '"JetBrains Mono", monospace' }}>Összesen</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {catData.sort((a, b) => b.value - a.value).map(({ name, value }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#666', width: '110px', textAlign: 'right', flexShrink: 0 }}>
                    {catLabels[name] || name}
                  </span>
                  <div style={{ flex: 1, height: '18px', background: '#f5f5f5', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(value / catData[0].value) * 100}%`,
                      background: '#0a0a0a',
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#0a0a0a', fontFamily: '"JetBrains Mono", monospace', width: '30px' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top questions */}
          <div style={{ flex: '1', minWidth: '320px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>Leggyakoribb kérdések</div>
            {questions.sort((a, b) => b.count - a.count).slice(0, 10).map((q, i) => (
              <div
                key={q.id}
                style={{
                  background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
                  borderRadius: '6px', padding: '10px 14px', marginBottom: '6px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}
              >
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
                  color: '#bbb', fontWeight: 300, width: '18px',
                }}>{`${(i + 1).toString().padStart(2, '0')}`}</span>
                <span style={{ flex: 1, fontSize: '12px', color: '#0a0a0a', fontWeight: 400 }}>{q.question}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', fontFamily: '"JetBrains Mono", monospace' }}>{q.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', marginBottom: '12px' }}>Összes kérdés</h2>
          <QuestionList questions={questions} />
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
