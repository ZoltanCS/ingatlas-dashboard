const BADGE_STYLES = {
  active: { background: '#0a0a0a', color: '#fff' },
  expired: { background: '#f0f0f1', color: '#999' },
  processing: { background: '#fef3c7', color: '#b45309' },
}

const BADGE_LABELS = {
  active: 'Aktív',
  expired: 'Lejárt',
  processing: 'Feldolgozás alatt',
}

export default function ListingTable({ properties, onRowClick }) {
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
        <span style={{ flex: 2 }}>Cím</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Típus</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Csomag</span>
        <span style={{ flex: 0.7, textAlign: 'right' }}>Látogatók</span>
        <span style={{ flex: 0.8, textAlign: 'right' }}>Státusz</span>
      </div>
      {properties.map((p, i) => (
        <div
          key={p.id}
          onClick={() => onRowClick && onRowClick(p)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 16px',
            borderBottom: i < properties.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none',
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f9f9f9' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
        >
          <span style={{ flex: 2, fontSize: '12px', fontWeight: 500, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.address}</span>
          <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#888' }}>{p.type}</span>
          <span style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase' }}>{p.plan}</span>
          <span style={{ flex: 0.7, textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#0a0a0a', fontFamily: '"JetBrains Mono", monospace' }}>{p.visits}</span>
          <span style={{ flex: 0.8, textAlign: 'right' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '9px',
              padding: '2px 7px',
              borderRadius: '3px',
              ...(BADGE_STYLES[p.status] || BADGE_STYLES.active),
            }}>{BADGE_LABELS[p.status] || p.status}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
