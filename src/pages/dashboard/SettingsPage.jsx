import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import useAuth from '../../hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [emailReports, setEmailReports] = useState(true)
  const [language, setLanguage] = useState('hu')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <Helmet>
        <title>Beállítások — Dashboard | Ingatlas</title>
      </Helmet>

      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', margin: '0 0 4px' }}>Beállítások</h1>
          <p style={{ fontSize: '12px', color: '#aaa', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em', margin: 0 }}>
            Fiók és értesítési beállítások
          </p>
        </div>

        {/* Account */}
        <div style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
          borderRadius: '6px', padding: '20px 24px', marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 16px' }}>Fiók</h2>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>Email cím</label>
            <input
              type="email"
              defaultValue={user?.email || 'felhasznalo@ingatlas.hu'}
              style={{
                padding: '8px 12px', fontSize: '12px', fontFamily: 'inherit',
                border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '5px',
                width: '100%', maxWidth: '360px', outline: 'none', background: '#fafafa',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>Név</label>
            <input
              type="text"
              defaultValue={user?.user_metadata?.full_name || ''}
              placeholder="Teljes név"
              style={{
                padding: '8px 12px', fontSize: '12px', fontFamily: 'inherit',
                border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '5px',
                width: '100%', maxWidth: '360px', outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>Nyelv</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                padding: '8px 12px', fontSize: '12px', fontFamily: 'inherit',
                border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '5px',
                width: '100%', maxWidth: '200px', outline: 'none', background: '#fff',
              }}
            >
              <option value="hu">Magyar</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
          borderRadius: '6px', padding: '20px 24px', marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 16px' }}>Értesítések</h2>

          <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>Push értesítések</div>
              <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>Azonnali értesítés új látogatókról és kérdésekről</div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                width: '40px', height: '22px',
                borderRadius: '11px',
                border: 'none',
                cursor: 'pointer',
                background: notifications ? '#0a0a0a' : '#d1d1d1',
                position: 'relative',
                transition: 'background 0.2s ease',
                padding: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: notifications ? '20px' : '2px',
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s ease',
              }} />
            </button>
          </div>

          <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>Heti email összesítő</div>
              <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>Hetente egyszer összesített statisztika emailben</div>
            </div>
            <button
              onClick={() => setEmailReports(!emailReports)}
              style={{
                width: '40px', height: '22px',
                borderRadius: '11px',
                border: 'none',
                cursor: 'pointer',
                background: emailReports ? '#0a0a0a' : '#d1d1d1',
                position: 'relative',
                transition: 'background 0.2s ease',
                padding: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: emailReports ? '20px' : '2px',
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s ease',
              }} />
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div style={{
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)',
          borderRadius: '6px', padding: '20px 24px', marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 16px' }}>Előfizetés</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '6px 14px',
              borderRadius: '4px',
              background: '#0a0a0a',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 500,
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Prémium</div>
            <span style={{ fontSize: '12px', color: '#666' }}>Aktív előfizetés</span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              fontSize: '10px', fontFamily: 'inherit',
              background: '#f0f0f1', color: '#555',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
            }}>Előfizetés kezelése</button>
            <button style={{
              padding: '8px 16px',
              fontSize: '10px', fontFamily: 'inherit',
              background: '#f0f0f1', color: '#555',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
            }}>Számlázási előzmények</button>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 28px',
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 500,
              background: '#0a0a0a',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >Mentés</button>
          {saved && (
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
              Beállítások elmentve!
            </span>
          )}
        </div>
      </div>
    </>
  )
}
