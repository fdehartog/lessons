// Extra oefenstap voor de les "Belang": eerst het motief van de afzender herkennen,
// vóór de zin/onzin-vraag. Vaste set opties, telkens geshuffeld per casus.

export type MotiefKey = 'verkopen' | 'overtuigen' | 'misleiden' | 'niets'

export const MOTIEF_OPTIES: Record<MotiefKey, { label: string; emoji: string }> = {
  verkopen: { label: 'Verkopen — wil dat je iets koopt', emoji: '🛒' },
  overtuigen: { label: 'Overtuigen — wil dat je iets gaat denken of doen', emoji: '📣' },
  misleiden: { label: 'Misleiden — wil je bang maken of bedriegen', emoji: '😈' },
  niets: { label: 'Niets — wil je gewoon informeren', emoji: 'ℹ️' },
}

export const MOTIEF_PER_CASUS: Record<string, MotiefKey> = {
  'belang-1': 'verkopen',
  'belang-2': 'verkopen',
  'belang-3': 'overtuigen',
  'belang-4': 'overtuigen',
  'belang-5': 'misleiden',
  'belang-6': 'overtuigen',
  'belang-7': 'overtuigen',
  'belang-8': 'verkopen',
  'belang-9': 'overtuigen',
  'belang-10': 'misleiden',
}

export type ZekerheidKey = 'zeker' | 'redelijk' | 'onzeker' | 'gokje'

export const ZEKERHEID_OPTIES: { key: ZekerheidKey; label: string; emoji: string }[] = [
  { key: 'zeker', label: 'Heel zeker', emoji: '😎' },
  { key: 'redelijk', label: 'Best wel zeker', emoji: '🙂' },
  { key: 'onzeker', label: 'Beetje onzeker', emoji: '🤔' },
  { key: 'gokje', label: 'Ik gokte', emoji: '🎲' },
]

export type OefenstapType = 'motief' | 'verdict' | 'zekerheid'

// Standaard: alleen de zin/onzin-vraag. Per les kan de volgorde afwijken.
export const STAPPEN_PER_LES: Record<string, OefenstapType[]> = {
  belang: ['motief', 'verdict', 'zekerheid'],
}

export const STANDAARD_STAPPEN: OefenstapType[] = ['verdict']

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
