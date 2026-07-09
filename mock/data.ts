// Mock-datalaag voor de wetenschapper-antwoordpagina.
// Veldnamen sluiten bewust aan op de toekomstige Supabase-tabellen (zie startdocument).

export type OordeelWaarde = 'zin' | 'nuance' | 'onzin'

export type Stemming = {
  grote_onzin: number
  beetje_onzin: number
  neutraal: number
  klopt_aardig: number
  klopt_helemaal: number
}

export type Sessie = {
  id: string
  klas: string
  school: string
  les3_datum: string
  belofte: string
}

export type Kwestie = {
  id: string
  sessie_id: string
  claim: string
  afzender: string
  alarmbellen: string[]
  stemming: Stemming
  onderwerp: string
  stage: 'uitgenodigd' | 'beantwoord'
  expert_id: string
}

export type Expert = {
  id: string
  naam: string
  titel: string
  instituut: string
  magic_token: string
}

export type Oordeel = {
  id: string
  kwestie_id: string
  expert_id: string
  oordeel: OordeelWaarde
  toelichting_video_url: string | null
  toelichting_audio_url: string | null
  toelichting_foto_url: string | null
  toelichting_tekst: string | null
  aangemaakt_op: string
}

export const ALARM_BELLEN: Record<string, { naam: string; kleur: string }> = {
  A1: { naam: 'Belang', kleur: '#FF9A6C' },
  A2: { naam: 'Gezag', kleur: '#FFB347' },
  A3: { naam: 'Herkomst', kleur: '#B594F7' },
  A4: { naam: 'Onderbouwing', kleur: '#4A9EFF' },
  A5: { naam: 'Logica', kleur: '#6BCF7F' },
  A6: { naam: 'Te simpel / te zeker', kleur: '#FF6B8A' },
  A7: { naam: 'Vaag', kleur: '#5BC0EB' },
  A8: { naam: 'Manipulatie', kleur: '#FFD166' },
  A9: { naam: 'Verspreidingskracht', kleur: '#F78FB3' },
  A10: { naam: 'AI', kleur: '#9D8DF1' },
}

export const OORDEEL_LABELS: Record<OordeelWaarde, { label: string; kleur: string }> = {
  zin: { label: 'Zin', kleur: '#6BCF7F' },
  nuance: { label: 'Onduidelijk', kleur: '#FFB347' },
  onzin: { label: 'Onzin', kleur: '#FF6B8A' },
}

export const SESSIES: Sessie[] = [
  { id: 's1', klas: '2VWO', school: 'Lorentz Casimir Lyceum', les3_datum: '2026-07-10', belofte: '2 wetenschappers antwoorden vóór Les 3' },
  { id: 's2', klas: '3VWO', school: 'Luzac College', les3_datum: '2026-07-14', belofte: '2 wetenschappers antwoorden vóór Les 3' },
  { id: 's3', klas: '1B', school: 'Het Stedelijk Lyceum', les3_datum: '2026-07-09', belofte: '2 wetenschappers antwoorden vóór Les 3' },
]

export const EXPERTS: Expert[] = [
  { id: 'e-peter-burger', naam: 'Peter Burger', titel: 'Folklorist & onderzoeker', instituut: 'Universiteit Leiden', magic_token: 'demo-peter-burger' },
  { id: 'e-ili-ma', naam: 'Ili Ma', titel: 'Psycholoog & onderzoeker', instituut: 'Universiteit Leiden', magic_token: 'demo-ili-ma' },
  { id: 'e-suzan-verberne', naam: 'Suzan Verberne', titel: 'Computerlinguïst & hoogleraar', instituut: 'Universiteit Leiden', magic_token: 'demo-suzan-verberne' },
]

export const KWESTIES: Kwestie[] = [
  {
    id: 'k-citroenwater',
    sessie_id: 's2',
    claim: 'Citroenwater drinken in de ochtend verbrandt vet en versnelt je stofwisseling.',
    afzender: 'Ingestuurd door Youssef · 3VWO Luzac',
    alarmbellen: ['A2', 'A4'],
    stemming: { grote_onzin: 4, beetje_onzin: 9, neutraal: 6, klopt_aardig: 3, klopt_helemaal: 1 },
    onderwerp: 'Voeding & gezondheid',
    stage: 'uitgenodigd',
    expert_id: 'e-peter-burger',
  },
  {
    id: 'k-maanlanding',
    sessie_id: 's1',
    claim: 'De maanlanding van 1969 was in scène gezet in een filmstudio.',
    afzender: 'Ingestuurd door Fenna · 2VWO Lorentz Casimir',
    alarmbellen: ['A3', 'A9'],
    stemming: { grote_onzin: 12, beetje_onzin: 5, neutraal: 3, klopt_aardig: 1, klopt_helemaal: 0 },
    onderwerp: 'Ruimtevaart / historisch',
    stage: 'uitgenodigd',
    expert_id: 'e-peter-burger',
  },
  {
    id: 'k-5g-straling',
    sessie_id: 's1',
    claim: '5G-masten veroorzaken gezondheidsklachten bij mensen die er dichtbij wonen.',
    afzender: 'Ingestuurd door Bram · 2VWO Lorentz Casimir',
    alarmbellen: ['A3', 'A9'],
    stemming: { grote_onzin: 9, beetje_onzin: 6, neutraal: 4, klopt_aardig: 2, klopt_helemaal: 1 },
    onderwerp: 'Techniek & gezondheid',
    stage: 'beantwoord',
    expert_id: 'e-peter-burger',
  },
  {
    id: 'k-gameverslaving',
    sessie_id: 's3',
    claim: 'Als je meer dan 3 uur per dag gamet, ben je verslaafd.',
    afzender: 'Ingestuurd door Daan · 1B Het Stedelijk',
    alarmbellen: ['A6'],
    stemming: { grote_onzin: 2, beetje_onzin: 4, neutraal: 8, klopt_aardig: 7, klopt_helemaal: 2 },
    onderwerp: 'Jongeren & media',
    stage: 'uitgenodigd',
    expert_id: 'e-ili-ma',
  },
  {
    id: 'k-chatgpt-waarheid',
    sessie_id: 's2',
    claim: 'ChatGPT weet altijd zeker of iets waar of onwaar is voordat het antwoord geeft.',
    afzender: 'Ingestuurd door Amira · 3VWO Luzac',
    alarmbellen: ['A4', 'A10'],
    stemming: { grote_onzin: 6, beetje_onzin: 10, neutraal: 5, klopt_aardig: 2, klopt_helemaal: 1 },
    onderwerp: 'AI & techniek',
    stage: 'uitgenodigd',
    expert_id: 'e-suzan-verberne',
  },
]

export const OORDELEN: Oordeel[] = [
  {
    id: 'o-5g-straling',
    kwestie_id: 'k-5g-straling',
    expert_id: 'e-peter-burger',
    oordeel: 'onzin',
    toelichting_video_url: null,
    toelichting_audio_url: null,
    toelichting_foto_url: null,
    toelichting_tekst: null,
    aangemaakt_op: '2026-07-01T10:00:00Z',
  },
]

export function findKwestieOordeel(kwestieId: string, expertId: string): Oordeel | undefined {
  return OORDELEN.find(o => o.kwestie_id === kwestieId && o.expert_id === expertId)
}

export function addOordeel(oordeel: Oordeel) {
  const bestaand = findKwestieOordeel(oordeel.kwestie_id, oordeel.expert_id)
  if (bestaand) {
    bestaand.oordeel = oordeel.oordeel
    bestaand.toelichting_video_url = oordeel.toelichting_video_url
    bestaand.toelichting_audio_url = oordeel.toelichting_audio_url
    bestaand.toelichting_foto_url = oordeel.toelichting_foto_url
    bestaand.toelichting_tekst = oordeel.toelichting_tekst
    bestaand.aangemaakt_op = oordeel.aangemaakt_op
    return
  }
  OORDELEN.push(oordeel)
}
