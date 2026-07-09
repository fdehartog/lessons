'use client'

import { useEffect, useRef, useState } from 'react'
import { controleerApparaten, verklaarFout } from './mediaError'

type Status = 'idle' | 'recording' | 'recorded' | 'error'

export default function AudioFotoRecorder({
  initialAudioUrl, initialFotoUrl, onChange, onClose,
}: {
  initialAudioUrl: string | null
  initialFotoUrl: string | null
  onChange: (audioUrl: string | null, fotoUrl: string | null) => void
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>(initialAudioUrl ? 'recorded' : 'idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl)
  const [fotoUrl, setFotoUrl] = useState<string | null>(initialFotoUrl)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  async function startRecording() {
    setErrorMsg(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Deze browser/pagina heeft geen toegang tot de microfoon. Werkt dit alleen op "localhost"? Via een IP-adres of een niet-https-domein wordt dat door de browser geblokkeerd.')
      setStatus('error')
      return
    }

    const apparaatFout = await controleerApparaten({ video: false, audio: true })
    if (apparaatFout) {
      setErrorMsg(apparaatFout)
      setStatus('error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        streamRef.current?.getTracks().forEach(t => t.stop())
        setAudioUrl(url)
        setStatus('recorded')
        onChange(url, fotoUrl)
      }
      recorder.start()
      recorderRef.current = recorder
      setStatus('recording')
    } catch (err) {
      console.error('Audio-opname mislukt:', err)
      setErrorMsg(verklaarFout(err))
      setStatus('error')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function opnieuw() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setStatus('idle')
    onChange(null, fotoUrl)
  }

  function fotoGekozen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setFotoUrl(url)
    onChange(audioUrl, url)
  }

  return (
    <div style={{ background: '#20264F', borderRadius: 14, padding: 14, border: '1px solid #2F3565', marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13.5, color: '#EDEEFC' }}>Audio + profielfoto</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8B91B8', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Sluiten</button>
      </div>

      {(status === 'idle' || status === 'error') && (
        <div>
          <button
            onClick={startRecording}
            style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#FF6B8A', color: '#0F1335', border: 'none', fontWeight: 900, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
          >
            ● Start audio-opname
          </button>
          {errorMsg && <p style={{ fontSize: 12, color: '#FF6B8A', marginTop: 8 }}>{errorMsg}</p>}
        </div>
      )}

      {status === 'recording' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF4444', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#8B91B8', fontWeight: 700 }}>Bezig met opnemen…</span>
          </div>
          <button
            onClick={stopRecording}
            style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#181D45', color: '#EDEEFC', border: '1px solid #2F3565', fontWeight: 900, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
          >
            ■ Stop opname
          </button>
        </div>
      )}

      {status === 'recorded' && audioUrl && (
        <div>
          <audio src={audioUrl} controls style={{ width: '100%' }} />
          <button
            onClick={opnieuw}
            style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'transparent', color: '#8B91B8', border: '1px solid #2F3565', fontWeight: 800, fontSize: 13, cursor: 'pointer', marginTop: 10, fontFamily: 'Nunito, sans-serif' }}
          >
            Opnieuw opnemen
          </button>
        </div>
      )}

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #2F3565' }}>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#C5C9E8', marginBottom: 8 }}>
          Profielfoto <span style={{ color: '#6E74AC', fontWeight: 600 }}>(erg aan te raden — zo ziet de klas toch een gezicht)</span>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {fotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt="Profielfoto" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
          )}
          <label style={{ padding: '10px 14px', borderRadius: 10, background: '#181D45', border: '1px solid #2F3565', color: '#C5C9E8', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}>
            {fotoUrl ? 'Andere foto kiezen' : 'Foto uploaden'}
            <input type="file" accept="image/*" onChange={fotoGekozen} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  )
}
