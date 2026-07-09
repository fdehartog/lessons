// Data-laagje voor de wetenschapper-antwoordpagina.
// Nu mock; Robert-Hein vervangt straks alleen de binnenkant van deze functies met Supabase-calls.

import { EXPERTS, KWESTIES, findKwestieOordeel, addOordeel } from '@/mock/data'
import type { Expert, Kwestie, OordeelWaarde } from '@/mock/data'

const NETWORK_DELAY = 400

function wait<T>(value: T, ms = NETWORK_DELAY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export async function resolveToken(token: string | null): Promise<{ expert: Expert } | { error: string }> {
  if (!token) return wait({ error: 'Deze link is niet meer geldig.' })
  const expert = EXPERTS.find(e => e.magic_token === token)
  if (!expert) return wait({ error: 'Deze link is niet meer geldig.' })
  return wait({ expert })
}

export async function getInbox(expertId: string): Promise<Kwestie[]> {
  const open = KWESTIES.filter(k => k.expert_id === expertId && k.stage === 'uitgenodigd')
  return wait(open)
}

export async function getKwestie(kwestieId: string): Promise<Kwestie | null> {
  const kwestie = KWESTIES.find(k => k.id === kwestieId) ?? null
  return wait(kwestie)
}

export async function submitOordeel(input: {
  kwestieId: string
  expertId: string
  oordeel: OordeelWaarde
  toelichtingVideo?: string | null
  toelichtingAudio?: string | null
  toelichtingFoto?: string | null
  toelichtingTekst?: string | null
}): Promise<{ ok: true } | { error: string }> {
  const kwestie = KWESTIES.find(k => k.id === input.kwestieId)
  if (!kwestie) return wait({ error: 'Deze kwestie bestaat niet (meer).' })

  addOordeel({
    id: `oordeel-${Date.now()}`,
    kwestie_id: input.kwestieId,
    expert_id: input.expertId,
    oordeel: input.oordeel,
    toelichting_video_url: input.toelichtingVideo ?? null,
    toelichting_audio_url: input.toelichtingAudio ?? null,
    toelichting_foto_url: input.toelichtingFoto ?? null,
    toelichting_tekst: input.toelichtingTekst ?? null,
    aangemaakt_op: new Date().toISOString(),
  })
  kwestie.stage = 'beantwoord'

  return wait({ ok: true })
}

export function heeftAlOordeel(kwestieId: string, expertId: string) {
  return findKwestieOordeel(kwestieId, expertId)
}
