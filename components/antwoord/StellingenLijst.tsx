import { SESSIES } from '@/mock/data'
import type { Expert, Kwestie, OordeelWaarde } from '@/mock/data'
import StellingCard, { type Toelichting } from './StellingCard'

export default function StellingenLijst({
  expert, kwesties, highlightId, mailOordeel, onAnswered,
}: {
  expert: Expert
  kwesties: Kwestie[]
  highlightId: string | null
  mailOordeel: OordeelWaarde | null
  onAnswered: (kwestieId: string, oordeel: OordeelWaarde, toelichting: Toelichting) => Promise<void>
}) {
  if (kwesties.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, textAlign: 'center' }}>
        <span style={{ fontSize: 32 }}>🎉</span>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 18, color: '#EDEEFC' }}>Je hebt alles beantwoord</p>
        <p style={{ fontSize: 13, color: '#8B91B8' }}>Bedankt, {expert.naam}!</p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: '#8B91B8', fontWeight: 700, marginBottom: 14 }}>
        Hoi {expert.naam}, hier zijn de stellingen van je klas 👇
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {kwesties.map(k => (
          <StellingCard
            key={k.id}
            expert={expert}
            kwestie={k}
            sessie={SESSIES.find(s => s.id === k.sessie_id)}
            highlighted={k.id === highlightId}
            mailOordeel={k.id === highlightId ? mailOordeel : null}
            onAnswered={onAnswered}
          />
        ))}
      </div>
    </div>
  )
}
