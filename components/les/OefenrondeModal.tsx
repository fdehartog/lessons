'use client'

import { useMemo, useState } from 'react'
import { CASUSSEN_PER_LES } from '@/lib/casussen'
import type { CasusVerdict } from '@/lib/casussen'
import {
  MOTIEF_OPTIES, MOTIEF_PER_CASUS, ZEKERHEID_OPTIES, STAPPEN_PER_LES, STANDAARD_STAPPEN, shuffle,
} from '@/lib/motieven'
import type { MotiefKey, ZekerheidKey, OefenstapType } from '@/lib/motieven'
import AfzenderAvatar from './AfzenderAvatar'

const VERDICT_INFO: Record<CasusVerdict, { label: string; kleur: string; emoji: string }> = {
  zin: { label: 'Zin', kleur: '#6BCF7F', emoji: '🟢' },
  genuanceerd: { label: 'Genuanceerd', kleur: '#FFB347', emoji: '🟡' },
  onzin: { label: 'Onzin', kleur: '#FF6B8A', emoji: '🔴' },
}

const VERDICT_OPTIES: CasusVerdict[] = ['zin', 'genuanceerd', 'onzin']

const STAP_ICOON: Record<OefenstapType, string> = {
  motief: '🎯',
  verdict: '⚖️',
  zekerheid: '🎚️',
}

const STAP_VRAAG: Record<OefenstapType, string> = {
  motief: 'Wil deze afzender iets (behalve informeren)?',
  verdict: 'Klopt deze stelling, ondanks de alarmbel?',
  zekerheid: 'Hoe zeker ben je van je antwoord?',
}

export default function OefenrondeModal({
  lessonSlug, lessonTitle, accentFrom, accentTo, onClose, onFinished,
}: {
  lessonSlug: string
  lessonTitle: string
  accentFrom: string
  accentTo: string
  onClose: () => void
  onFinished?: (score: number, total: number) => void
}) {
  const casussen = CASUSSEN_PER_LES[lessonSlug] ?? []
  const stappen = STAPPEN_PER_LES[lessonSlug] ?? STANDAARD_STAPPEN

  const [index, setIndex] = useState(0)
  const [stapIndex, setStapIndex] = useState(0)
  const [motiefAntwoord, setMotiefAntwoord] = useState<MotiefKey | null>(null)
  const [verdictAntwoord, setVerdictAntwoord] = useState<CasusVerdict | null>(null)
  const [zekerheidAntwoord, setZekerheidAntwoord] = useState<ZekerheidKey | null>(null)
  const [score, setScore] = useState(0)
  const [motiefScore, setMotiefScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const casus = casussen[index]
  const stap = stappen[stapIndex]
  const isLaatsteStap = stapIndex === stappen.length - 1
  const isLaatsteCasus = index === casussen.length - 1
  const heeftMotiefStap = stappen.includes('motief')

  const motiefOptiesGeshuffeld = useMemo(
    () => shuffle(Object.keys(MOTIEF_OPTIES) as MotiefKey[]),
    [casus?.id],
  )

  const motiefGoed = casus ? MOTIEF_PER_CASUS[casus.id] : null
  const verdictGoed = casus?.verdict
  const motiefCorrect = motiefAntwoord !== null && motiefAntwoord === motiefGoed
  const verdictCorrect = verdictAntwoord !== null && verdictAntwoord === verdictGoed

  function kiesMotief(m: MotiefKey) {
    if (motiefAntwoord) return
    setMotiefAntwoord(m)
    if (m === motiefGoed) setMotiefScore(s => s + 1)
  }

  function kiesVerdict(v: CasusVerdict) {
    if (verdictAntwoord) return
    setVerdictAntwoord(v)
    if (v === verdictGoed) setScore(s => s + 1)
  }

  function kiesZekerheid(z: ZekerheidKey) {
    if (zekerheidAntwoord) return
    setZekerheidAntwoord(z)
  }

  function volgende() {
    if (!isLaatsteStap) {
      setStapIndex(i => i + 1)
      return
    }
    if (isLaatsteCasus) {
      setFinished(true)
      onFinished?.(score, casussen.length)
      return
    }
    setIndex(i => i + 1)
    setStapIndex(0)
    setMotiefAntwoord(null)
    setVerdictAntwoord(null)
    setZekerheidAntwoord(null)
  }

  function volgendeLabel() {
    if (!isLaatsteStap) return 'Volgende vraag →'
    if (isLaatsteCasus) return 'Bekijk resultaat →'
    return 'Volgende casus →'
  }

  if (casussen.length === 0) {
    return (
      <Overlay onClose={onClose}>
        <div style={{ padding: 32, textAlign: 'center', color: '#C5C9E8' }}>
          <p>Voor deze les zijn nog geen oefenvragen beschikbaar.</p>
          <CloseButton onClose={onClose} />
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #2F3565', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 11, color: '#8B91B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Het spel · {lessonTitle}
            </p>
            {!finished && (
              <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: '#EDEEFC' }}>
                Vraag {index + 1} van {casussen.length}
                {stappen.length > 1 && <span style={{ color: '#8B91B8', fontWeight: 700 }}> · stap {stapIndex + 1}/{stappen.length}</span>}
              </p>
            )}
          </div>
          <button onClick={onClose} aria-label="Sluiten" style={{ width: 36, height: 36, borderRadius: 12, background: '#181D45', border: '1px solid #2F3565', color: '#8B91B8', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {!finished && (
          <div style={{ display: 'flex', gap: 5, padding: '14px 24px 0', flexShrink: 0 }}>
            {casussen.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i < index ? accentFrom : i === index ? `linear-gradient(90deg, ${accentFrom}, ${accentTo})` : '#2F3565' }} />
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {finished ? (
            <ResultaatScherm
              score={score} total={casussen.length}
              motiefScore={heeftMotiefStap ? motiefScore : null}
              accentFrom={accentFrom} accentTo={accentTo} onClose={onClose}
            />
          ) : (
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              {/* Ruimte voor een illustratie bij deze casus (nog niet ingevuld) */}
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '16/7', borderRadius: 14, overflow: 'hidden', marginBottom: 16,
                background: casus.afbeelding ? undefined : 'repeating-linear-gradient(45deg, #2A3060 0px, #2A3060 4px, #181D45 4px, #181D45 12px)',
              }}>
                {casus.afbeelding ? (
                  <img src={casus.afbeelding} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: 20, opacity: 0.35 }}>🖼️</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>afbeelding volgt</span>
                  </div>
                )}
              </div>

              {/* Afzender — bewust klein en gedempt, maar vlak boven de uitspraak: ze horen bij elkaar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AfzenderAvatar casus={casus} size={28} />
                <span style={{ fontSize: 12.5, color: '#8B91B8', fontWeight: 600 }}>
                  {casus.afzender}{casus.context ? ` — ${casus.context}` : ''}
                </span>
              </div>

              {/* Uitspraak — het citaat zelf, duidelijk als quote gestyled */}
              {casus.stelling ? (
                <p style={{ fontFamily: 'Nunito, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 20, color: '#EDEEFC', lineHeight: 1.45, margin: '0 0 6px' }}>
                  "{casus.stelling}"
                </p>
              ) : (
                <p style={{ fontFamily: 'Nunito, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: 17, color: '#C5C9E8', lineHeight: 1.45, margin: '0 0 6px' }}>
                  {casus.afzender}{casus.context ? ` — ${casus.context}` : ''}
                </p>
              )}
              {casus.noot && (
                <p style={{ fontSize: 12.5, color: '#6E74AC', fontStyle: 'italic', marginBottom: 16 }}>({casus.noot})</p>
              )}

              {/* Vraag — duidelijk gemarkeerd als dé vraag die nu beantwoord moet worden */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '18px 0 12px' }}>
                <span style={{ fontSize: 19 }}>{STAP_ICOON[stap]}</span>
                <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: '#EDEEFC' }}>
                  {STAP_VRAAG[stap]}
                </p>
              </div>

              {stap === 'motief' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {motiefOptiesGeshuffeld.map(optie => {
                      const info = MOTIEF_OPTIES[optie]
                      const isSelected = motiefAntwoord === optie
                      const isCorrectOptie = motiefAntwoord !== null && optie === motiefGoed
                      return (
                        <button
                          key={optie}
                          onClick={() => kiesMotief(optie)}
                          disabled={motiefAntwoord !== null}
                          style={{
                            textAlign: 'left', padding: '13px 14px', borderRadius: 14, cursor: motiefAntwoord ? 'default' : 'pointer',
                            fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14,
                            background: isSelected || isCorrectOptie ? `${accentFrom}22` : '#181D45',
                            border: isSelected || isCorrectOptie ? `2px solid ${isCorrectOptie ? '#6BCF7F' : accentFrom}` : '1px solid #2F3565',
                            color: isSelected || isCorrectOptie ? (isCorrectOptie ? '#6BCF7F' : '#EDEEFC') : '#C5C9E8',
                            transition: 'all 0.15s',
                          }}
                        >
                          {info.emoji} {info.label}
                        </button>
                      )
                    })}
                  </div>

                  {motiefAntwoord && (
                    <RevealPanel correct={motiefCorrect} accentFrom={accentFrom} accentTo={accentTo} onVolgende={volgende} label={volgendeLabel()}>
                      <p style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 15, color: motiefCorrect ? '#6BCF7F' : '#FF6B8A', marginBottom: 10 }}>
                        {motiefCorrect ? '✓ Klopt!' : `✕ Niet helemaal — het juiste antwoord is "${MOTIEF_OPTIES[motiefGoed!].label}"`}
                      </p>
                      <p style={{ fontSize: 13.5, color: '#C5C9E8', lineHeight: 1.55 }}>
                        <strong style={{ color: '#EDEEFC' }}>Waarom: </strong>
                        {casus.trigger}.
                      </p>
                    </RevealPanel>
                  )}
                </>
              )}

              {stap === 'verdict' && (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {VERDICT_OPTIES.map(optie => {
                      const info = VERDICT_INFO[optie]
                      const isSelected = verdictAntwoord === optie
                      const isCorrectOptie = verdictAntwoord !== null && optie === casus.verdict
                      return (
                        <button
                          key={optie}
                          onClick={() => kiesVerdict(optie)}
                          disabled={verdictAntwoord !== null}
                          style={{
                            flex: 1, padding: '14px 6px', borderRadius: 14, cursor: verdictAntwoord ? 'default' : 'pointer',
                            fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14,
                            background: isSelected || isCorrectOptie ? `${info.kleur}22` : '#181D45',
                            border: isSelected || isCorrectOptie ? `2px solid ${info.kleur}` : '1px solid #2F3565',
                            color: isSelected || isCorrectOptie ? info.kleur : '#C5C9E8',
                            transition: 'all 0.15s',
                          }}
                        >
                          {info.emoji} {info.label}
                        </button>
                      )
                    })}
                  </div>

                  {verdictAntwoord && (
                    <RevealPanel correct={verdictCorrect} accentFrom={accentFrom} accentTo={accentTo} onVolgende={volgende} label={volgendeLabel()}>
                      <p style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 15, color: verdictCorrect ? '#6BCF7F' : '#FF6B8A', marginBottom: 10 }}>
                        {verdictCorrect ? '✓ Klopt!' : `✕ Niet helemaal — het juiste antwoord is "${VERDICT_INFO[casus.verdict].label}"`}
                      </p>
                      <p style={{ fontSize: 13.5, color: '#C5C9E8', lineHeight: 1.55, marginBottom: 10 }}>
                        <strong style={{ color: '#EDEEFC' }}>Waarom deze alarmbel afgaat: </strong>
                        {casus.trigger}.
                      </p>
                      <p style={{ fontSize: 13.5, color: '#C5C9E8', lineHeight: 1.55 }}>
                        <strong style={{ color: VERDICT_INFO[casus.verdict].kleur }}>{VERDICT_INFO[casus.verdict].emoji} {VERDICT_INFO[casus.verdict].label}: </strong>
                        {casus.uitleg}
                      </p>
                    </RevealPanel>
                  )}
                </>
              )}

              {stap === 'zekerheid' && (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {ZEKERHEID_OPTIES.map(optie => {
                      const isSelected = zekerheidAntwoord === optie.key
                      return (
                        <button
                          key={optie.key}
                          onClick={() => kiesZekerheid(optie.key)}
                          disabled={zekerheidAntwoord !== null}
                          style={{
                            flex: '1 1 auto', minWidth: 120, padding: '14px 6px', borderRadius: 14, cursor: zekerheidAntwoord ? 'default' : 'pointer',
                            fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14,
                            background: isSelected ? `${accentFrom}22` : '#181D45',
                            border: isSelected ? `2px solid ${accentFrom}` : '1px solid #2F3565',
                            color: isSelected ? '#EDEEFC' : '#C5C9E8',
                            transition: 'all 0.15s',
                          }}
                        >
                          {optie.emoji} {optie.label}
                        </button>
                      )
                    })}
                  </div>

                  {zekerheidAntwoord && (
                    <button
                      onClick={volgende}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 14, cursor: 'pointer', border: 'none',
                        fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14.5, color: '#0F1335',
                        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                      }}
                    >
                      {volgendeLabel()}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

function RevealPanel({
  correct, accentFrom, accentTo, onVolgende, label, children,
}: {
  correct: boolean
  accentFrom: string
  accentTo: string
  onVolgende: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#181D45', borderRadius: 16, padding: 18,
      border: `1px solid ${correct ? '#6BCF7F44' : '#FF6B8A44'}`,
    }}>
      {children}
      <button
        onClick={onVolgende}
        style={{
          width: '100%', marginTop: 16, padding: '14px', borderRadius: 14, cursor: 'pointer', border: 'none',
          fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14.5, color: '#0F1335',
          background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        }}
      >
        {label}
      </button>
    </div>
  )
}

function ResultaatScherm({
  score, total, motiefScore, accentFrom, accentTo, onClose,
}: {
  score: number
  total: number
  motiefScore: number | null
  accentFrom: string
  accentTo: string
  onClose: () => void
}) {
  const pct = Math.round((score / total) * 100)
  return (
    <div style={{ maxWidth: 420, margin: '40px auto 0', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%', margin: '0 auto 20px',
        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Nunito', fontWeight: 900, fontSize: 28, color: '#0F1335',
      }}>
        {score}/{total}
      </div>
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22, color: '#EDEEFC', marginBottom: 8 }}>
        Spel afgerond!
      </h2>
      <p style={{ fontSize: 14.5, color: '#C5C9E8', lineHeight: 1.5, marginBottom: motiefScore !== null ? 12 : 28 }}>
        Je had {score} van de {total} vragen goed ({pct}%). {pct >= 80 ? 'Sterk werk — je herkent deze alarmbel goed.' : pct >= 50 ? 'Goed bezig, met nog wat oefening zit dit er helemaal in.' : 'Bekijk de les nog eens terug om deze alarmbel scherper te herkennen.'}
      </p>
      {motiefScore !== null && (
        <p style={{ fontSize: 13.5, color: '#8B91B8', lineHeight: 1.5, marginBottom: 28 }}>
          Motief herkend: {motiefScore} van de {total} keer goed.
        </p>
      )}
      <button
        onClick={onClose}
        style={{
          padding: '14px 32px', borderRadius: 14, cursor: 'pointer', border: 'none',
          fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14.5, color: '#0F1335',
          background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        }}
      >
        Terug naar de les
      </button>
    </div>
  )
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,14,42,0.85)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640, maxHeight: '88vh', background: '#20264F', borderRadius: 24,
          border: '1px solid #2F3565', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 12, background: '#181D45', border: '1px solid #2F3565', color: '#C5C9E8', cursor: 'pointer', fontFamily: 'Nunito' }}>
      Sluiten
    </button>
  )
}
