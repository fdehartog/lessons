/**
 * getUserMedia({video:true, audio:true}) faalt in zijn geheel met NotFoundError
 * zodra één van de twee apparaten ontbreekt — ook als het andere prima werkt.
 * Deze check loopt vooraf langs enumerateDevices() zodat we precies kunnen
 * zeggen wélk apparaat mist, in plaats van de generieke combinatiefout.
 */
export async function controleerApparaten({ video, audio }: { video: boolean; audio: boolean }): Promise<string | null> {
  if (!navigator.mediaDevices?.enumerateDevices) return null

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const heeftVideo = devices.some(d => d.kind === 'videoinput')
    const heeftAudio = devices.some(d => d.kind === 'audioinput')

    if (video && audio && !heeftVideo && !heeftAudio) {
      return 'Er is geen camera én geen microfoon gevonden op dit apparaat.'
    }
    if (video && !heeftVideo) {
      return 'Er is geen camera gevonden op dit apparaat (de microfoon lijkt er wel te zijn).'
    }
    if (audio && !heeftAudio) {
      return 'Er is geen microfoon gevonden op dit apparaat (de camera lijkt er wel te zijn) — daardoor lukt de video-opname niet, want die heeft geluid nodig.'
    }
    return null
  } catch {
    return null
  }
}

export function verklaarFout(err: unknown): string {
  const name = err instanceof DOMException ? err.name : null

  switch (name) {
    case 'NotAllowedError':
      return 'Toegang tot camera/microfoon is geweigerd. Klik op het slotje/camera-icoontje links van de adresbalk en zet de toestemming aan, herlaad dan de pagina.'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'Er is geen camera of microfoon gevonden op dit apparaat.'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'De camera of microfoon wordt al gebruikt door een andere app of tab. Sluit die en probeer opnieuw.'
    case 'SecurityError':
      return 'Deze pagina draait niet op een beveiligde verbinding (https of localhost), dus de browser blokkeert cameratoegang.'
    default:
      return `Camera of microfoon niet beschikbaar${err instanceof Error ? `: ${err.message}` : ''}. Je kunt ook zonder video bevestigen.`
  }
}
