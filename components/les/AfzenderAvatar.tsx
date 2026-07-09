import type { Casus } from '@/lib/casussen'

type Archetype = 'ai' | 'instituut' | 'nieuws' | 'anoniem' | 'influencer' | 'bedrijf' | 'persoonlijk'

const ARCHETYPE_COLOR: Record<Archetype, string> = {
  ai: '#9D8DF1',
  instituut: '#6BCF7F',
  nieuws: '#FFB347',
  anoniem: '#6E74AC',
  influencer: '#FF6B8A',
  bedrijf: '#4A9EFF',
  persoonlijk: '#B594F7',
}

// Volgorde is prioriteit: eerste match wint. Vrij grof (het is sfeer, geen exacte wetenschap).
const RULES: [Archetype, RegExp][] = [
  ['ai', /\bai\b|chatgpt|deepfake/i],
  ['instituut', /rivm|knmi|\bcbs\b|politiebond|\bpolitie\b|universiteit|onderzoeker|wetenschapper|hoogleraar|professor|congres|minister|gemeente|rechtszaak|detective|\bns\b|spoorwegen|bibliotheek|astrofysicus|viroloog|wiskundeleraar|tandarts/i],
  ['nieuws', /\bnos\b|krant|tijdschrift|nieuwsplatform|nieuwskop|columnist|sportcommentator|filmreviewer|quest\b/i],
  ['anoniem', /anoniem|telegram|reddit|whatsapp-keten|wikipedia|internetforum|schoolforum/i],
  ['influencer', /influencer|tiktok|instagram|youtube|volgers|politicus|religieuze leider|campagne|coach\b|tv-kok|topvoetballer/i],
  ['bedrijf', /bedrijf|reclame|advertentie|producent|-app\b|webshop|verzekering|zonnepanelen|hondenvoer|schoonmaakmiddel|cr[eè]me|astrologie/i],
]

function classify(casus: Casus): Archetype {
  const tekst = `${casus.afzender} ${casus.context ?? ''} ${casus.trigger}`.toLowerCase()
  for (const [archetype, regex] of RULES) {
    if (regex.test(tekst)) return archetype
  }
  return 'persoonlijk'
}

function Icon({ archetype }: { archetype: Archetype }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (archetype) {
    case 'ai':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <rect x="5" y="9" width="14" height="10" rx="3" />
          <circle cx="12" cy="5" r="1.6" />
          <line x1="12" y1="6.6" x2="12" y2="9" />
          <circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" />
          <line x1="2" y1="13" x2="5" y2="13" />
          <line x1="19" y1="13" x2="22" y2="13" />
        </svg>
      )
    case 'instituut':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <polygon points="12 3 21 9 3 9" />
          <line x1="5" y1="10" x2="5" y2="21" />
          <line x1="9" y1="10" x2="9" y2="21" />
          <line x1="15" y1="10" x2="15" y2="21" />
          <line x1="19" y1="10" x2="19" y2="21" />
          <line x1="3" y1="21" x2="21" y2="21" />
        </svg>
      )
    case 'nieuws':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <line x1="6" y1="9" x2="18" y2="9" />
          <line x1="6" y1="12.5" x2="18" y2="12.5" />
          <line x1="6" y1="16" x2="13" y2="16" />
        </svg>
      )
    case 'anoniem':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="M4 10c0-1.5 3.5-2.5 8-2.5s8 1 8 2.5" />
          <path d="M4 10c0 4.2 2.2 7 8 7s8-2.8 8-7" />
          <circle cx="8.5" cy="11.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="11.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'influencer':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      )
    case 'bedrijf':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <line x1="2" y1="13" x2="22" y2="13" />
        </svg>
      )
    case 'persoonlijk':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
        </svg>
      )
  }
}

export default function AfzenderAvatar({ casus, size = 30 }: { casus: Casus; size?: number }) {
  const archetype = classify(casus)
  const kleur = ARCHETYPE_COLOR[archetype]
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `${kleur}22`, border: `1px solid ${kleur}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: kleur,
      }}
    >
      <Icon archetype={archetype} />
    </div>
  )
}
