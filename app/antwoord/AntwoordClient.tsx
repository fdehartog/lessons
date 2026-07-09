'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { resolveToken, getInbox, getKwestie, submitOordeel } from '@/lib/answerData'
import type { Expert, Kwestie, OordeelWaarde } from '@/mock/data'
import Shell from '@/components/antwoord/Shell'
import { LoadingScreen, ErrorScreen } from '@/components/antwoord/StateScreens'
import StellingenLijst from '@/components/antwoord/StellingenLijst'
import type { Toelichting } from '@/components/antwoord/StellingCard'

type ScreenState =
  | { name: 'loading' }
  | { name: 'error'; message: string }
  | { name: 'ready'; expert: Expert; kwesties: Kwestie[] }

const GELDIGE_OORDELEN: OordeelWaarde[] = ['zin', 'nuance', 'onzin']

export default function AntwoordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const kParam = searchParams.get('k')
  const oordeelParam = searchParams.get('oordeel')
  // Dit oordeel komt uit de knop die de wetenschapper zelf al in de mail koos —
  // geen suggestie, maar zijn/haar eigen antwoord dat hier nog bevestigd moet worden.
  const mailOordeel = GELDIGE_OORDELEN.includes(oordeelParam as OordeelWaarde) ? (oordeelParam as OordeelWaarde) : null

  const [state, setState] = useState<ScreenState>({ name: 'loading' })

  const load = useCallback(async () => {
    setState({ name: 'loading' })
    const result = await resolveToken(token)
    if ('error' in result) { setState({ name: 'error', message: result.error }); return }
    const { expert } = result

    const inbox = await getInbox(expert.id)

    if (kParam && !inbox.some(k => k.id === kParam)) {
      const losseKwestie = await getKwestie(kParam)
      if (losseKwestie) inbox.unshift(losseKwestie)
    } else if (kParam) {
      inbox.sort((a, b) => (a.id === kParam ? -1 : b.id === kParam ? 1 : 0))
    }

    setState({ name: 'ready', expert, kwesties: inbox })
  }, [token, kParam])

  useEffect(() => { load() }, [load])

  if (state.name === 'loading') return <Shell><LoadingScreen /></Shell>
  if (state.name === 'error') return <Shell><ErrorScreen message={state.message} /></Shell>

  const { expert, kwesties } = state

  async function handleAnswered(kwestieId: string, oordeel: OordeelWaarde, toelichting: Toelichting) {
    await submitOordeel({
      kwestieId,
      expertId: expert.id,
      oordeel,
      toelichtingVideo: toelichting.video,
      toelichtingAudio: toelichting.audio,
      toelichtingFoto: toelichting.foto,
      toelichtingTekst: toelichting.tekst,
    })
  }

  return (
    <Shell>
      <StellingenLijst
        expert={expert}
        kwesties={kwesties}
        highlightId={kParam}
        mailOordeel={mailOordeel}
        onAnswered={handleAnswered}
      />
    </Shell>
  )
}
