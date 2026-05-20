export default function KpiCard({ label, value, delta, positive, icon }) {
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid rgba(0,0,0,0.07)',
      borderRadius: '6px',
      padding: '16px 20px',
      flex: '1 1 180px',
      minWidth: '180px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '11px',
          color: '#999',
          fontWeight: 400,
        }}>{label}</span>
        {icon && <span style={{ color: '#ccc' }}>{icon}</span>}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 500,
        color: '#0a0a0a',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>{value}</div>
      {delta && (
        <div style={{
          fontSize: '11px',
          fontWeight: 500,
          color: positive === true ? '#16a34a' : positive === false ? '#dc2626' : '#999',
        }}>{delta}</div>
      )}
    </div>
  )
}
