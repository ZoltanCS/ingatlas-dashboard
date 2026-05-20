import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/dashboard',         label: 'Áttekintő',    icon: OverviewIcon, end: true },
  { to: '/dashboard/listings', label: 'Felvételeim',  icon: ListingsIcon },
  { to: '/dashboard/chatbot',  label: 'AI Chatbot',   icon: ChatbotIcon },
  { to: '/dashboard/heatmap',  label: 'Hőtérképek',   icon: HeatmapIcon },
  { to: '/dashboard/seo',      label: 'SEO Szövegek', icon: SeoIcon },
  { to: '/dashboard/analytics',label: 'Analitika',    icon: AnalyticsIcon },
  { to: '/dashboard/team',     label: 'Csapat',       icon: TeamIcon },
  { to: '/dashboard/settings', label: 'Beállítások',  icon: SettingsIcon },
]

const linkBase = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 16px', marginBottom: '1px',
  fontSize: '12px', fontWeight: 400,
  textDecoration: 'none', fontFamily: 'inherit',
  borderLeft: '2px solid transparent',
  transition: 'all 0.15s ease',
  color: '#888',
}
const linkActive = {
  ...linkBase,
  color: '#0a0a0a',
  background: '#f3f3f4',
  borderLeft: '2px solid #0a0a0a',
  fontWeight: 500,
}

function OverviewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function ListingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="5.5" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="10" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function ChatbotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="5.5" cy="6.5" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="6.5" r="0.8" fill="currentColor" />
      <path d="M5 9.5c.5.6 1.2 1 2 1s1.5-.4 2-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function HeatmapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.25" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.5" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="5.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.5" y="5.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.25" y="9.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.5" y="9.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function SeoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M2 7h10M2 10h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function AnalyticsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="7" width="2.5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.75" y="4" width="2.5" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="1.5" width="2.5" height="10.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 11c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 11c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.5 2.5l1.5 1.5M10 10l1.5 1.5M2.5 11.5l1.5-1.5M10 4l1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function Sidebar({ collapsed, onClose }) {
  return (
    <aside style={{
      width: collapsed ? '56px' : '200px',
      flexShrink: 0,
      background: '#fafafa',
      borderRight: '0.5px solid rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      transition: 'width 0.2s ease',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 20,
    }}>
      <div style={{
        padding: collapsed ? '0 10px 20px' : '0 16px 20px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '0.28em',
        color: '#0a0a0a',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {collapsed ? 'I' : 'Ingatlas'}
      </div>

      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={({ isActive }) => isActive ? linkActive : linkBase}
          onMouseEnter={e => {
            if (e.currentTarget.className !== 'active') {
              e.currentTarget.style.background = '#f0f0f1'
              e.currentTarget.style.color = '#0a0a0a'
            }
          }}
          onMouseLeave={e => {
            if (e.currentTarget.className !== 'active') {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#888'
            }
          }}
        >
          <Icon />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </aside>
  )
}
