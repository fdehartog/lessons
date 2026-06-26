'use client'

import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Overzicht', icon: '⊞', active: false, href: '/' },
  { label: 'Voortgang', icon: '◎', active: false, href: null },
  { label: 'Wetenschappers', icon: '🔬', active: true, href: '/wetenschappers' },
  { label: 'Bibliotheek', icon: '☰', active: false, href: null },
  { label: 'Reflectie', icon: '◇', active: false, href: null },
  { label: 'Docenten', icon: '👤', active: false, href: null },
  { label: 'Instellingen', icon: '⚙', active: false, href: null },
]

const WETENSCHAPPERS = [
  {
    name: 'Bas Haring',
    title: 'Filosoof & hoogleraar',
    instelling: 'Universiteit Leiden',
    omschrijving: 'Bas Haring is hoogleraar "Publiek begrip van wetenschap" aan de Universiteit Leiden. Hij schrijft boeken, maakt televisie en geeft lezingen over filosofie en wetenschap voor een breed publiek. Hij is bekend om zijn toegankelijke en speelse manier van uitleggen, waarbij hij complexe ideeën vertaalt naar herkenbare, alledaagse situaties.',
    website: 'https://www.universiteitleiden.nl',
    photo: '/illustrations/expert-bas-haring.png',
    initials: 'BH',
    color: '#FFB347',
  },
  {
    name: 'Alexander Pleijter',
    title: 'Journalist & onderzoeker',
    instelling: 'Hogeschool Windesheim',
    omschrijving: 'Alexander Pleijter is lector Journalistiek aan Hogeschool Windesheim en doet onderzoek naar de kwaliteit van journalistiek en de rol van media in de samenleving. Hij is gespecialiseerd in mediagebruik, bronnengebruik en journalistieke werkpraktijken. Als docent en onderzoeker verbindt hij wetenschappelijke inzichten met de dagelijkse journalistieke praktijk.',
    website: 'https://www.windesheim.nl',
    photo: null,
    initials: 'AP',
    color: '#5BC0EB',
  },
  {
    name: 'Ili Ma',
    title: 'Psycholoog & onderzoeker',
    instelling: 'Universiteit Leiden',
    omschrijving: 'Ili Ma is universitair docent Ontwikkelingspsychologie aan de Universiteit Leiden. Haar onderzoek richt zich op hoe kinderen en jongeren leren redeneren, beslissingen nemen en omgaan met onzekerheid. Ze onderzoekt hoe cognitieve ontwikkeling samenhangt met het vermogen om kritisch na te denken over informatie.',
    website: 'https://www.universiteitleiden.nl',
    photo: null,
    initials: 'IM',
    color: '#B594F7',
  },
  {
    name: 'Caspar Jacobs',
    title: 'Filosoof',
    instelling: 'Universiteit van Amsterdam',
    omschrijving: 'Caspar Jacobs is filosoof en doet onderzoek naar logica, argumentatietheorie en de grondslagen van de wetenschapsfilosofie. Hij is gespecialiseerd in het analyseren van redeneringen en het blootleggen van drogredeneringen. Als filosoof verbindt hij abstracte logica met herkenbare voorbeelden uit het dagelijks leven.',
    website: 'https://www.uva.nl',
    photo: null,
    initials: 'CJ',
    color: '#6BCF7F',
  },
  {
    name: 'Peter Burger',
    title: 'Folklorist & onderzoeker',
    instelling: 'Universiteit Leiden',
    omschrijving: 'Peter Burger is universitair docent aan de Universiteit Leiden en gespecialiseerd in hedendaagse folklore, hoaxes en geruchten. Hij is oprichter van Nieuwscheckers, het Nederlandse factcheckplatform. Zijn onderzoek richt zich op hoe verhalen en misvattingen zich verspreiden via sociale media en mondeling contact.',
    website: 'https://nieuwscheckers.nl',
    photo: null,
    initials: 'PB',
    color: '#FF6B8A',
  },
  {
    name: 'Suzan Verberne',
    title: 'Computerlinguïst & hoogleraar',
    instelling: 'Universiteit Leiden',
    omschrijving: 'Suzan Verberne is hoogleraar Informatiekunde aan de Universiteit Leiden. Haar onderzoek richt zich op natural language processing, informatie-extractie en de detectie van misleidende en gegenereerde tekst. Ze werkt aan methoden om AI-gegenereerde content te herkennen en de betrouwbaarheid van online informatie te beoordelen.',
    website: 'https://www.universiteitleiden.nl',
    photo: null,
    initials: 'SV',
    color: '#B594F7',
  },
  {
    name: 'Szuszika Sjoerds',
    title: 'Psycholoog & onderzoeker',
    instelling: 'Erasmus Universiteit Rotterdam',
    omschrijving: 'Szuszika Sjoerds is onderzoeker in de cognitieve en sociale psychologie, gespecialiseerd in nieuwsgierigheid, leren en informatieverwerking. Haar onderzoek gaat over hoe mensen informatie opzoeken, beoordelen en opslaan — en hoe motivatie en emotie daarin een rol spelen. Ze verbindt fundamenteel wetenschappelijk onderzoek aan praktische toepassingen in onderwijs en communicatie.',
    website: 'https://www.eur.nl',
    photo: null,
    initials: 'SS',
    color: '#FFB347',
  },
  {
    name: 'Sebo Uithol',
    title: 'Filosoof & neurowetenschapper',
    instelling: 'Radboud Universiteit Nijmegen',
    omschrijving: 'Sebo Uithol is filosoof en doet onderzoek naar de relatie tussen hersenen, gedrag en bewustzijn. Hij is gespecialiseerd in de filosofie van de cognitieve wetenschap en bestudeert hoe onze hersenen beslissingen nemen, informatie integreren en tot overtuigingen komen. Zijn werk verbindt neurowetenschappen met filosofische vragen over rationaliteit en vrije wil.',
    website: 'https://www.ru.nl',
    photo: null,
    initials: 'SU',
    color: '#6BCF7F',
  },
]

const FACTCHECKERS = [
  {
    name: 'Nieuwscheckers',
    titel: 'Onafhankelijk factcheckplatform',
    instelling: 'Universiteit Leiden',
    omschrijving: 'Nieuwscheckers is het Nederlandse platform voor factchecking, verbonden aan de Universiteit Leiden. Het team van journalisten en onderzoekers controleert uitspraken van politici, wetenschappers en media op juistheid. Nieuwscheckers is lid van het International Fact-Checking Network (IFCN).',
    website: 'https://nieuwscheckers.nl',
    initials: 'NC',
    color: '#FFB347',
  },
  {
    name: 'AFP Fact Check',
    titel: 'Internationaal factcheckbureau',
    instelling: 'Agence France-Presse',
    omschrijving: 'AFP Fact Check is de factcheckdivisie van het internationale persbureau AFP. Het team verifieert viraal gaande berichten, foto\'s en video\'s wereldwijd en publiceert bevindingen in meerdere talen, waaronder Nederlands.',
    website: 'https://factcheck.afp.com',
    initials: 'AF',
    color: '#4A9EFF',
  },
]

export default function WetenschappersPage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0F1335' }}>
      {/* Sidebar */}
      <aside style={{ width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', background: '#181D45', borderRight: '1px solid #2F3565' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #FFB347, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🔔
          </div>
          <span style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>
            Zin <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#FFB347' }}>of</em> Onzin?
          </span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => item.href && router.push(item.href)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 12, textAlign: 'left', cursor: item.href ? 'pointer' : 'default', border: 'none',
                background: item.active ? 'rgba(139,111,224,0.15)' : 'transparent',
                color: item.active ? '#FFFFFF' : '#8B91B8',
                fontWeight: item.active ? 700 : 500, fontSize: 15,
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                borderLeft: `3px solid ${item.active ? '#B594F7' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderTop: '1px solid #2F3565' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>S</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Sanne</p>
            <p style={{ fontSize: 13, color: '#8B91B8', fontWeight: 500, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Leerling</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #2F3565', flexShrink: 0 }}>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#20264F', color: '#C5C9E8', border: '1px solid #2F3565', cursor: 'pointer', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            ← Terug naar overzicht
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>S</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          {/* Page header */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Wetenschappers
            </h1>
            <p style={{ fontSize: 16, color: '#C5C9E8', lineHeight: 1.6, maxWidth: 640 }}>
              De experts en wetenschappers die bijdragen aan <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>Zin of Onzin?</em> — in de video's en met de inhoudelijke onderbouwing.
            </p>
          </div>

          {/* Section 1: Wetenschappers in de video's */}
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ height: 3, width: 32, borderRadius: 99, background: 'linear-gradient(90deg, #B594F7, #8B6FE0)' }} />
              <h2 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 20, color: '#FFFFFF' }}>
                In de video's
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {WETENSCHAPPERS.map(w => (
                <div key={w.name} style={{ background: '#20264F', borderRadius: 20, overflow: 'hidden', display: 'flex', minHeight: 180 }}>
                  {/* Portrait */}
                  <div style={{
                    width: 180, flexShrink: 0,
                    background: w.photo
                      ? `url(${w.photo}) center/cover no-repeat`
                      : `linear-gradient(135deg, ${w.color}33, ${w.color}11)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {!w.photo && (
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${w.color}, ${w.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                        {w.initials}
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div style={{ padding: '24px 28px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div>
                        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 20, marginBottom: 2 }}>{w.name}</p>
                        <p style={{ fontSize: 14, color: w.color, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', marginBottom: 2 }}>{w.title}</p>
                        <p style={{ fontSize: 13, color: '#8B91B8', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', marginBottom: 12 }}>{w.instelling}</p>
                      </div>
                      <a
                        href={w.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', background: `${w.color}18`, color: w.color, border: `1px solid ${w.color}44`, textDecoration: 'none', flexShrink: 0, marginLeft: 16 }}
                      >
                        Website →
                      </a>
                    </div>
                    <p style={{ fontSize: 15, color: '#C5C9E8', lineHeight: 1.65, maxWidth: 680 }}>{w.omschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Factcheckers */}
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ height: 3, width: 32, borderRadius: 99, background: 'linear-gradient(90deg, #FFB347, #FF9F1C)' }} />
              <h2 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 20, color: '#FFFFFF' }}>
                Factcheckers
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FACTCHECKERS.map(f => (
                <div key={f.name} style={{ background: '#20264F', borderRadius: 20, overflow: 'hidden', display: 'flex', minHeight: 140 }}>
                  <div style={{ width: 180, flexShrink: 0, background: `linear-gradient(135deg, ${f.color}33, ${f.color}11)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${f.color}, ${f.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {f.initials}
                    </div>
                  </div>
                  <div style={{ padding: '24px 28px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div>
                        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 20, marginBottom: 2 }}>{f.name}</p>
                        <p style={{ fontSize: 14, color: f.color, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', marginBottom: 2 }}>{f.titel}</p>
                        <p style={{ fontSize: 13, color: '#8B91B8', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', marginBottom: 12 }}>{f.instelling}</p>
                      </div>
                      <a
                        href={f.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}44`, textDecoration: 'none', flexShrink: 0, marginLeft: 16 }}
                      >
                        Website →
                      </a>
                    </div>
                    <p style={{ fontSize: 15, color: '#C5C9E8', lineHeight: 1.65, maxWidth: 680 }}>{f.omschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
