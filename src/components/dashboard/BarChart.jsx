export default function BarChart({ data, labelKey, valueKey, color, height = 120 }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: `${height}px`, paddingTop: '20px' }}>
      {data.map((item, i) => {
        const pct = (item[valueKey] / max) * 100
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{
              width: '100%',
              height: `${Math.max(pct * 0.7, 2)}%`,
              background: color || '#0a0a0a',
              borderRadius: '2px 2px 0 0',
              transition: 'height 0.3s ease',
              opacity: 0.85,
            }} />
            <span style={{
              fontSize: '8px',
              color: '#bbb',
              fontFamily: '"JetBrains Mono", monospace',
              whiteSpace: 'nowrap',
            }}>{item[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}
