'use client'

import { useState } from 'react'

export default function TekstToelichting({
  initialTekst, onChange, onClose,
}: {
  initialTekst: string | null
  onChange: (tekst: string | null) => void
  onClose: () => void
}) {
  const [tekst, setTekst] = useState(initialTekst ?? '')

  return (
    <div style={{ background: '#181D45', borderRadius: 14, padding: 14, border: '1px dashed #2F3565', marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, color: '#8B91B8' }}>Geschreven toelichting</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8B91B8', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Sluiten</button>
      </div>
      <p style={{ fontSize: 11.5, color: '#6E74AC', lineHeight: 1.4, marginBottom: 10 }}>
        Dit is een noodoplossing. Een video of audio-opname met gezicht komt veel persoonlijker over bij de klas.
      </p>
      <textarea
        value={tekst}
        onChange={e => setTekst(e.target.value)}
        placeholder="Typ hier je korte toelichting…"
        rows={4}
        style={{
          width: '100%', borderRadius: 10, border: '1px solid #2F3565', background: '#0F1335',
          color: '#EDEEFC', fontSize: 13.5, padding: 10, fontFamily: 'Nunito, sans-serif', resize: 'vertical',
        }}
      />
      <button
        onClick={() => onChange(tekst.trim() || null)}
        disabled={!tekst.trim()}
        style={{
          width: '100%', padding: '10px', borderRadius: 10, marginTop: 10, border: 'none',
          background: tekst.trim() ? '#8B91B8' : '#2F3565', color: '#0F1335',
          fontWeight: 800, fontSize: 13, cursor: tekst.trim() ? 'pointer' : 'default', fontFamily: 'Nunito, sans-serif',
        }}
      >
        Toelichting opslaan
      </button>
    </div>
  )
}
