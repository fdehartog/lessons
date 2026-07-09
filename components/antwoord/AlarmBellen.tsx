import { ALARM_BELLEN } from '@/mock/data'

export default function AlarmBellen({ codes }: { codes: string[] }) {
  if (codes.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {codes.map(code => {
        const bel = ALARM_BELLEN[code]
        if (!bel) return null
        return (
          <span
            key={code}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 12px', borderRadius: 999,
              background: `${bel.kleur}22`, border: `1px solid ${bel.kleur}55`,
              fontSize: 12.5, fontWeight: 800, color: '#EDEEFC',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: 3, background: bel.kleur, display: 'inline-block' }} />
            {bel.naam}
          </span>
        )
      })}
    </div>
  )
}
