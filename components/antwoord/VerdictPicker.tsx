import { OORDEEL_LABELS } from '@/mock/data'
import type { OordeelWaarde } from '@/mock/data'

const OPTIES: OordeelWaarde[] = ['zin', 'nuance', 'onzin']

export default function VerdictPicker({
  value, onChange, disabled = false, baseBg = '#20264F', suggested = null,
}: {
  value: OordeelWaarde | null
  onChange: (v: OordeelWaarde) => void
  disabled?: boolean
  baseBg?: string
  /** Oordeel dat de wetenschapper al zelf via de mail koos — nog niet bevestigd, dus geen volle selectie-stijl. */
  suggested?: OordeelWaarde | null
}) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {OPTIES.map(optie => {
        const info = OORDEEL_LABELS[optie]
        const selected = value === optie
        const isEigenOordeel = !value && suggested === optie
        return (
          <button
            key={optie}
            onClick={() => onChange(optie)}
            disabled={disabled}
            style={{
              flex: 1, padding: '14px 6px', borderRadius: 14, cursor: disabled ? 'default' : 'pointer',
              fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14,
              background: selected ? `${info.kleur}22` : baseBg,
              border: selected ? `2px solid ${info.kleur}` : isEigenOordeel ? `2px dashed ${info.kleur}` : '1px solid #2F3565',
              color: selected || isEigenOordeel ? info.kleur : '#C5C9E8',
              transition: 'all 0.15s',
            }}
          >
            {info.label}
          </button>
        )
      })}
    </div>
  )
}
