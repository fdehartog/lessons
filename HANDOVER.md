# Overdracht voor Robert-Hein

Eén Next.js-app, één repo, één Vercel-deploy — drie onderdelen van "Zin of Onzin?" leven hier samen.

## Live

| Onderdeel | URL | Login nodig? |
|---|---|---|
| Lesoverzicht (klas/leerling) | https://lessons-rouge-omega.vercel.app/ | Ja, site-wachtwoord |
| Wetenschappers | https://lessons-rouge-omega.vercel.app/wetenschappers | Ja, site-wachtwoord |
| **Antwoordpagina wetenschappers** (magic-link) | https://lessons-rouge-omega.vercel.app/antwoord?token=demo-peter-burger | **Nee** — expres, zie hieronder |
| **Coördinator-dashboard** (mockup) | https://lessons-rouge-omega.vercel.app/coordinator-dashboard.html | Ja, site-wachtwoord |

Demo-tokens voor de antwoordpagina (zie `mock/data.ts`): `demo-peter-burger`, `demo-ili-ma`, `demo-suzan-verberne`. Voeg `&k=<kwestie-id>` toe om direct op één kwestie te landen.

Het site-wachtwoord staat als env var `SITE_PASSWORD` in de Vercel-projectinstellingen — deel dat los (niet via dit document) met Robert-Hein.

## Repo

`github.com/fdehartog/lessons`, branch `master`. Elke push naar `master` deployt automatisch via Vercel.

## Wat is al echt, wat is nog mock

- **Lesoverzicht** (`app/page.tsx` → `app/HomeClient.tsx`, `app/les/[slug]/` → `LesDetailClient.tsx`, `app/wetenschappers/` → `WetenschappersClient.tsx`) — praat al met Supabase via `lib/supabase.ts`. Dit is de enige van de drie die al een echte database heeft. Elke `page.tsx` is bewust een dun server-wrappertje (zie "Beveiliging & deploy-valkuilen" hieronder) — de echte pagina-logica zit ongewijzigd in het bijbehorende `*Client.tsx`-bestand.
- **Antwoordpagina** (`app/antwoord/`) — volledig tegen mock-data. Zie "Het swap-punt" hieronder.
- **Coördinator-dashboard** (`public/coordinator-dashboard.html`) — losse, statische HTML/JS-mockup uit Claude chat. Geen React, geen gedeelde datalaag, alle state leeft alleen in de browser van wie 'm openheeft. Nog niet verbonden met de rest.

## Het swap-punt voor de antwoordpagina

Alle dataverkeer van de antwoordpagina loopt via `lib/answerData.ts` — vier functies:

```
resolveToken(token)      // -> { expert } | { error }
getInbox(expertId)       // -> open kwesties van deze wetenschapper
getKwestie(kwestieId)    // -> kwestie incl. sessie-context + stemming
submitOordeel({...})     // -> schrijft het oordeel weg (+ evt. video/audio/foto/tekst)
```

Dit is de enige plek die moet worden vervangen door echte Supabase-calls — de React-componenten eromheen hoeven niet aangepast. De mock-veldnamen in `mock/data.ts` (`sessie`, `kwestie`, `expert`, `oordeel`) zijn met opzet zo genoemd dat ze direct op toekomstige Supabase-tabellen aansluiten.

Let op: video/audio/foto-opnames worden nu opgeslagen als browser-lokale `blob:`-URL's (verdwijnen bij herladen) — dat moet naar echte storage (bv. Supabase Storage) zodra dat deel gebouwd wordt.

## Beveiliging & deploy-valkuilen (nuttig voordat je hierin gaat bouwen)

Drie dingen die niet vanzelfsprekend zijn en die je waarschijnlijk opnieuw tegenkomt als je iets aan routing/auth verandert:

1. **`middleware.ts`, niet `proxy.ts`.** Deze Next.js-versie noemt de conventie zelf deprecated en wijst naar `proxy.ts` — lokaal bouwt dat ook prima — maar Vercel's productie-omgeving voert `proxy.ts` niet uit als edge-middleware. Resultaat: de wachtwoordcheck draaide simpelweg nooit. Blijf bij `middleware.ts` totdat je dit expliciet opnieuw hebt getest op een preview-deploy.
2. **Statische pagina's slaan middleware over.** `/`, `/wetenschappers` en `/les/[slug]` waren static-prerendered; Vercel's CDN serveerde ze rechtstreeks uit cache zónder middleware aan te roepen (zie ook `node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md`, die dit exact zo documenteert). Elke wachtwoord-beveiligde route heeft daarom een server-`page.tsx` met `export const dynamic = 'force-dynamic'` nodig — die export wordt genegeerd in een `'use client'`-bestand, vandaar de split in dunne server-wrapper + `*Client.tsx`.
3. **`/api/login` moet zelf buiten de wachtwoordcheck vallen.** Voor de hand liggende val: het endpoint dat het wachtwoord controleert, werd zelf ook geblokkeerd door diezelfde check, waardoor niemand kon inloggen. Staat nu in `OPEN_PATHS` in `middleware.ts` samen met `/login` en `/antwoord`.

Env var wijzigen? `SITE_PASSWORD` staat in Vercel → Settings → Environment Variables (Production). Het dashboard heeft hier een keer een waarde niet opgeslagen zonder foutmelding — als dat weer gebeurt, gebruik de CLI (`vercel env add SITE_PASSWORD production`, typ de waarde in je eigen terminal) en trigger daarna een nieuwe deploy — env-var-wijzigingen worden pas meegenomen bij de eerstvolgende build, niet met terugwerkende kracht.

## Nog te doen (Robert-Hein's kant)

- Supabase-schema voor `sessie` / `kwestie` / `expert` / `oordeel`, veldnamen zoals in `mock/data.ts`.
- Echte magic-token generatie + validatie (nu: vaste demo-tokens in mock-data).
- Video/audio/foto-upload naar echte storage.
- E-mailversturing van de uitnodiging (bundelt meestal ~3 kwesties per wetenschapper).
- Coördinator-dashboard ombouwen van statische HTML naar een echte pagina in deze app, met dezelfde datalaag-aanpak als de antwoordpagina.
