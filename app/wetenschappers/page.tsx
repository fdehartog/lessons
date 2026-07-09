import WetenschappersClient from './WetenschappersClient'

// Zie app/page.tsx voor waarom dit hier staat: forceert dynamische rendering
// zodat de CDN dit wachtwoord-beveiligde pad niet cachet vóór middleware.ts kan draaien.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <WetenschappersClient />
}
