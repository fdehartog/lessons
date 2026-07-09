'use client'

import { useEffect, useRef, useState } from 'react'
import { controleerApparaten, verklaarFout } from './mediaError'

type Status = 'idle' | 'recording' | 'recorded' | 'error'

export default function VideoRecorder({
  initialUrl, onRecorded, onClose,
}: {
  initialUrl: string | null
  onRecorded: (url: string | null) => void
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>(initialUrl ? 'recorded' : 'idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(initialUrl)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  // De <video>-preview bestaat pas in de DOM zodra status 'recording' is,
  // dus de stream moet ná die render aan de ref gekoppeld worden — niet ervoor.
  useEffect(() => {
    if (status === 'recording' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [status])

  async function startRecording() {
    setErrorMsg(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Deze browser/pagina heeft geen toegang tot camera en microfoon. Werkt dit alleen op "localhost"? Via een IP-adres of een niet-https-domein wordt cameratoegang door de browser geblokkeerd.')
      setStatus('error')
      return
    }

    const apparaatFout = await controleerApparaten({ video: true, audio: true })
    if (apparaatFout) {
      setErrorMsg(apparaatFout)
      setStatus('error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        streamRef.current?.getTracks().forEach(t => t.stop())
        setVideoUrl(url)
        setStatus('recorded')
        onRecorded(url)
      }
      recorder.start()
      recorderRef.current = recorder
      setStatus('recording')
    } catch (err) {
      console.error('Camera/microfoon-opname mislukt:', err)
      setErrorMsg(verklaarFout(err))
      setStatus('error')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function opnieuw() {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setStatus('idle')
    onRecorded(null)
  }

  return (
    <div style={{ background: '#20264F', borderRadius: 14, padding: 14, border: '1px solid #FFB347', marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13.5, color: '#EDEEFC' }}>Videotoelichting</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8B91B8', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Sluiten</button>
      </div>

      {(status === 'idle' || status === 'error') && (
        <div>
          <button
            onClick={startRecording}
            style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#FF6B8A', color: '#0F1335', border: 'none', fontWeight: 900, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
          >
            ● Start opname
          </button>
          {errorMsg && <p style={{ fontSize: 12, color: '#FF6B8A', marginTop: 8 }}>{errorMsg}</p>}
        </div>
      )}

      {status === 'recording' && (
        <div>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 10, background: '#0A0E2A', display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF4444', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#8B91B8', fontWeight: 700 }}>Bezig met opnemen…</span>
          </div>
          <button
            onClick={stopRecording}
            style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#20264F', color: '#EDEEFC', border: '1px solid #2F3565', fontWeight: 900, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
          >
            ■ Stop opname
          </button>
        </div>
      )}

      {status === 'recorded' && videoUrl && (
        <div>
          <video src={videoUrl} controls playsInline style={{ width: '100%', borderRadius: 10, background: '#0A0E2A', display: 'block' }} />
          <button
            onClick={opnieuw}
            style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'transparent', color: '#8B91B8', border: '1px solid #2F3565', fontWeight: 800, fontSize: 13, cursor: 'pointer', marginTop: 10, fontFamily: 'Nunito, sans-serif' }}
          >
            Opnieuw opnemen
          </button>
        </div>
      )}
    </div>
  )
}
