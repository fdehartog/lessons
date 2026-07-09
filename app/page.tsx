import HomeClient from './HomeClient'

// Dwingt dynamische rendering af zodat Vercel's CDN deze pagina nooit cachet
// vóórdat middleware.ts (het wachtwoord-gate) kan draaien. Zie
// node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md: "If your
// deployment places proxy.js behind the CDN, configure the cache layer to
// bypass caching for routes that depend on proxy.js decisions." Deze export
// wordt genegeerd in een 'use client'-bestand, dus staat 'm in deze dunne
// server-wrapper — de eigenlijke pagina blijft ongewijzigd in HomeClient.tsx.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <HomeClient />
}
