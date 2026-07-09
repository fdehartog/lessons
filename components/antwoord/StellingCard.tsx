'use client'

import { useState } from 'react'
import { OORDEEL_LABELS, findKwestieOordeel } from '@/mock/data'
import type { Expert, Kwestie, Sessie, OordeelWaarde } from '@/mock/data'
import StemmingBar from './StemmingBar'
import AlarmBellen from './AlarmBellen'
import VideoRecorder from './VideoRecorder'
import AudioFotoRecorder from './AudioFotoRecorder'
import TekstToelichting from './TekstToelichting'
import VerdictPicker from './VerdictPicker'

export type Toelichting = { video: string | null; audio: string | null; foto: string | null; tekst: string | null }

type Modus = 'gesloten' | 'video' | 'fallbackMenu' | 'audioFoto' | 'tekst'

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function StellingCard({
  expert, kwestie, sessie, highlighted, mailOordeel, onAnswered,
}: {
  expert: Expert
  kwestie: Kwestie
  sessie: Sessie | undefined
  highlighted: boolean
  mailOordeel: OordeelWaarde | null
  onAnswered: (kwestieId: string, oordeel: OordeelWaarde, toelichting: Toelichting) => Promise<void>
}) {
  const bestaandOordeel = findKwestieOordeel(kwestie.id, expert.id)

  const [oordeel, setOordeel] = useState<OordeelWaarde | null>(bestaandOordeel?.oordeel ?? null)
  const [beantwoord, setBeantwoord] = useState(Boolean(bestaandOordeel))
  const [video, setVideo] = useState<string | null>(bestaandOordeel?.toelichting_video_url ?? null)
  const [audio, setAudio] = useState<string | null>(bestaandOordeel?.toelichting_audio_url ?? null)
  const [foto, setFoto] = useState<string | null>(bestaandOordeel?.toelichting_foto_url ?? null)
  const [tekst, setTekst] = useState<string | null>(bestaandOordeel?.toelichting_tekst ?? null)
  const [modus, setModus] = useState<Modus>('gesloten')
  const [infoOpen, setInfoOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const heeftToelichting = Boolean(video || audio || tekst)

  // De wetenschapper koos dit oordeel al zelf via de knop in de mail — dit is dus
  // zíjn/haar eigen antwoord, geen suggestie. Pas na een klik telt het als bevestigd.
  const jouwOordeelUitMail = !beantwoord ? mailOordeel : null

  async function bewaar(v: OordeelWaarde, t: Toelichting) {
    setSaving(true)
    await onAnswered(kwestie.id, v, t)
    setSaving(false)
  }

  async function kiesOordeel(v: OordeelWaarde) {
    setOordeel(v)
    setBeantwoord(true)
    await bewaar(v, { video, audio, foto, tekst })
  }

  async function videoOpgenomen(url: string | null) {
    setVideo(url)
    if (oordeel) await bewaar(oordeel, { video: url, audio, foto, tekst })
  }

  async function audioFotoGewijzigd(audioUrl: string | null, fotoUrl: string | null) {
    setAudio(audioUrl)
    setFoto(fotoUrl)
    if (oordeel) await bewaar(oordeel, { video, audio: audioUrl, foto: fotoUrl, tekst })
  }

  async function tekstOpgeslagen(t: string | null) {
    setTekst(t)
    setModus('gesloten')
    if (oordeel) await bewaar(oordeel, { video, audio, foto, tekst: t })
  }

  const guidance = jouwOordeelUitMail
    ? `👉 Jouw oordeel: ${OORDEEL_LABELS[jouwOordeelUitMail].label}. Klik om te bevestigen.`
    : !beantwoord
      ? '👉 Kies Zin, Onduidelijk of Onzin.'
      : !heeftToelichting
        ? '🎥 Belangrijk: neem een korte video op — de klas wil je zien en horen!'
        : '✓ Toelichting toegevoegd. Dankjewel!'

  return (
    <div
      style={{
        background: '#20264F', borderRadius: 18, padding: 18,
        border: highlighted ? '2px solid #FFB347' : '1px solid #2F3565',
      }}
    >
      <span style={{ fontSize: 11, color: '#FFB347', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {kwestie.onderwerp}
      </span>
      <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 19, color: '#EDEEFC', lineHeight: 1.4, margin: '8px 0 6px' }}>
        "{kwestie.claim}"
      </p>
      <p style={{ fontSize: 12, color: '#6E74AC', fontWeight: 700, marginBottom: 14 }}>{kwestie.afzender}</p>

      {/* Oordeel-knoppen */}
      <div style={{ marginBottom: 10 }}>
        <VerdictPicker value={oordeel} onChange={kiesOordeel} disabled={saving} baseBg="#181D45" suggested={jouwOordeelUitMail} />
      </div>

      {/* Gesuggereerde volgende stap */}
      <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 12.5, color: beantwoord || jouwOordeelUitMail ? '#FFB347' : '#8B91B8', marginBottom: 12 }}>
        {guidance}
      </p>

      {beantwoord && modus === 'gesloten' && (
        heeftToelichting ? (
          <button
            onClick={() => setModus(video ? 'video' : audio || foto ? 'audioFoto' : 'tekst')}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14, border: 'none',
              background: '#6BCF7F', color: '#0F1335',
            }}
          >
            ✓ Toelichting toegevoegd — bekijken / wijzigen
          </button>
        ) : (
          <div>
            <button
              onClick={() => setModus('video')}
              style={{
                width: '100%', padding: '16px', borderRadius: 14, cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, border: 'none',
                background: 'linear-gradient(135deg, #FFB347, #FF9F1C)', color: '#0F1335',
              }}
            >
              🎥 Neem een video op
            </button>
            <button
              onClick={() => setModus('fallbackMenu')}
              style={{
                display: 'block', width: '100%', textAlign: 'center', marginTop: 8, padding: '6px',
                background: 'none', border: 'none', color: '#6E74AC', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', textDecoration: 'underline',
              }}
            >
              Ik kan nu even niet opnemen
            </button>
          </div>
        )
      )}

      {modus === 'video' && (
        <VideoRecorder initialUrl={video} onRecorded={videoOpgenomen} onClose={() => setModus('gesloten')} />
      )}

      {modus === 'fallbackMenu' && (
        <div style={{ background: '#181D45', borderRadius: 14, padding: 14, border: '1px solid #2F3565', marginTop: 10 }}>
          <p style={{ fontSize: 12.5, color: '#C5C9E8', fontWeight: 700, marginBottom: 12 }}>
            Jammer — een video maakt echt het verschil voor de klas. Geen moment nu?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => setModus('gesloten')}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#20264F', border: '1px solid #FFB347', color: '#FFB347', fontWeight: 900, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
            >
              ⏰ Ik doe de video later alsnog
            </button>
            <button
              onClick={() => setModus('audioFoto')}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#20264F', border: '1px solid #2F3565', color: '#C5C9E8', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
            >
              🎙️ Audio-opname + profielfoto
            </button>
          </div>
          <button
            onClick={() => setModus('tekst')}
            style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 12, background: 'none', border: 'none', color: '#6E74AC', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
          >
            (last resort) alleen een geschreven toelichting
          </button>
        </div>
      )}

      {modus === 'audioFoto' && (
        <AudioFotoRecorder initialAudioUrl={audio} initialFotoUrl={foto} onChange={audioFotoGewijzigd} onClose={() => setModus('gesloten')} />
      )}

      {modus === 'tekst' && (
        <TekstToelichting initialTekst={tekst} onChange={tekstOpgeslagen} onClose={() => setModus('gesloten')} />
      )}

      {/* Meer info — ingeklapt tenzij opgevraagd */}
      <div style={{ marginTop: 14 }}>
        <button
          onClick={() => setInfoOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: '#8B91B8', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: 0 }}
        >
          {infoOpen ? '▾ Verberg klasstemming & context' : '▸ Toon klasstemming & context'}
        </button>
        {infoOpen && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sessie && (
              <p style={{ fontSize: 12, color: '#8B91B8', fontWeight: 600 }}>
                {sessie.klas} · {sessie.school} · Les 3 op {formatDatum(sessie.les3_datum)}
              </p>
            )}
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: '#EDEEFC', marginBottom: 8 }}>Zo stemde de klas</p>
              <StemmingBar stemming={kwestie.stemming} />
            </div>
            {kwestie.alarmbellen.length > 0 && (
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 800, color: '#EDEEFC', marginBottom: 8 }}>Gemarkeerde alarmbellen</p>
                <AlarmBellen codes={kwestie.alarmbellen} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
