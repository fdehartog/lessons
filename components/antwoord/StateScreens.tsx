export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <span style={{ fontSize: 28 }}>🔔</span>
      <p style={{ fontSize: 13.5, color: '#8B91B8', fontWeight: 700 }}>Even kijken wie je bent…</p>
    </div>
  )
}

export function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14, textAlign: 'center', padding: '0 12px' }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 19, color: '#EDEEFC' }}>{message}</h1>
      <p style={{ fontSize: 13.5, color: '#8B91B8', lineHeight: 1.5 }}>
        Vraag de coördinator om je een nieuwe uitnodiging te sturen.
      </p>
    </div>
  )
}
