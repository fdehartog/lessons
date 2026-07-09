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

- **Lesoverzicht** (`app/page.tsx`, `app/les/[slug]/page.tsx`, `app/wetenschappers/page.tsx`) — praat al met Supabase via `lib/supabase.ts`. Dit is de enige van de drie die al een echte database heeft.
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

## Nog te doen (Robert-Hein's kant)

- Supabase-schema voor `sessie` / `kwestie` / `expert` / `oordeel`, veldnamen zoals in `mock/data.ts`.
- Echte magic-token generatie + validatie (nu: vaste demo-tokens in mock-data).
- Video/audio/foto-upload naar echte storage.
- E-mailversturing van de uitnodiging (bundelt meestal ~3 kwesties per wetenschapper).
- Coördinator-dashboard ombouwen van statische HTML naar een echte pagina in deze app, met dezelfde datalaag-aanpak als de antwoordpagina.
