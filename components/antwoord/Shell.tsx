export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0F1335', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 20px 8px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #FFB347, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
            🔔
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: '#EDEEFC' }}>
            Zin <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#FFB347' }}>of</em> Onzin?
          </span>
        </header>
        <main style={{ padding: '12px 16px 48px' }}>{children}</main>
      </div>
    </div>
  )
}
