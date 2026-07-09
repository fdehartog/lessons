import type { Stemming } from '@/mock/data'

const SEGMENTS: { key: keyof Stemming; label: string; kleur: string }[] = [
  { key: 'grote_onzin', label: 'Grote onzin', kleur: '#FF4444' },
  { key: 'beetje_onzin', label: 'Beetje onzin', kleur: '#FF6B8A' },
  { key: 'neutraal', label: 'Neutraal', kleur: '#8B91B8' },
  { key: 'klopt_aardig', label: 'Klopt aardig', kleur: '#9DD9A6' },
  { key: 'klopt_helemaal', label: 'Klopt helemaal', kleur: '#6BCF7F' },
]

export default function StemmingBar({ stemming }: { stemming: Stemming }) {
  const totaal = SEGMENTS.reduce((sum, s) => sum + stemming[s.key], 0) || 1

  return (
    <div>
      <div style={{ display: 'flex', height: 16, borderRadius: 7, overflow: 'hidden', border: '1px solid #2F3565' }}>
        {SEGMENTS.map(s => (
          <span key={s.key} style={{ display: 'block', width: `${(stemming[s.key] / totaal) * 100}%`, background: s.kleur }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
        {SEGMENTS.map(s => (
          <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#8B91B8', fontWeight: 700 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.kleur, display: 'inline-block' }} />
            {s.label} · {stemming[s.key]}
          </span>
        ))}
      </div>
    </div>
  )
}
