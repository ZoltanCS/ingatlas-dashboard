const CATEGORY_LABELS = {
  belmagasság: 'Belmagasság',
  tájolás: 'Tájolás',
  parkolás: 'Parkolás',
  költség: 'Költség',
  közlekedés: 'Közlekedés',
  alapterület: 'Alapterület',
  felszereltség: 'Felszereltség',
  épület: 'Épület',
  környék: 'Környék',
}

export default function QuestionList({ questions }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{
        padding: '12px 16px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#0a0a0a',
        borderBottom: '0.5px solid rgba(0,0,0,0.06)',
        display: 'flex',
        gap: '12px',
      }}>
        <span style={{ flex: 2 }}>Kérdés</span>
        <span style={{ flex: 1 }}>Ingatlan</span>
        <span style={{ flex: 1 }}>Kategória</span>
        <span style={{ flex: 0.5, textAlign: 'right' }}>Db</span>
      </div>
      {questions.map((q, i) => (
        <div
          key={q.id}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '9px 16px',
            borderBottom: i < questions.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <span style={{ flex: 2, fontSize: '12px', fontWeight: 400, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</span>
          <span style={{ flex: 1, fontSize: '10px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.property}</span>
          <span style={{ flex: 1, fontSize: '10px', color: '#bbb' }}>{CATEGORY_LABELS[q.category] || q.category}</span>
          <span style={{ flex: 0.5, textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#0a0a0a', fontFamily: '"JetBrains Mono", monospace' }}>{q.count}</span>
        </div>
      ))}
    </div>
  )
}
