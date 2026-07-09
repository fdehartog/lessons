'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, MOCK_USER_ID } from '@/lib/supabase'

type AlarmBell = {
  id: string
  position: number
  title: string
  subtitle: string
  duration_min: number
  has_vote_round: boolean
  color_solid: string
  color_from: string
  color_to: string
  illustration_path: string | null
  experts: { name: string; initials: string; role: string } | null
}

type Course = {
  title: string
  tagline_html: string
  subtitle: string
  total_duration_min: number
  vote_rounds: number
  video_count: number
  tip_of_the_day: string
}

const NAV_ITEMS = [
  { label: 'Overzicht', icon: '⊞', active: true, href: '/' },
  { label: 'Voortgang', icon: '◎', active: false, href: null },
  { label: 'Wetenschappers', icon: '🔬', active: false, href: '/wetenschappers' },
  { label: 'Bibliotheek', icon: '☰', active: false, href: null },
  { label: 'Reflectie', icon: '◇', active: false, href: null },
  { label: 'Docenten', icon: '👤', active: false, href: null },
  { label: 'Instellingen', icon: '⚙', active: false, href: null },
]

function toSlug(title: string) {
  return title.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/-$/, '')
}

export default function LesoverzichtPage() {
  const router = useRouter()
  const [alarmBells, setAlarmBells] = useState<AlarmBell[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: courseData }, { data: bellsData }, { data: progressData }] = await Promise.all([
        supabase.from('courses').select('*').single(),
        supabase
          .from('alarm_bells')
          .select('*, experts(name, initials, role)')
          .order('position'),
        supabase
          .from('student_progress')
          .select('alarm_bell_id')
          .eq('user_id', MOCK_USER_ID)
          .eq('completed', true),
      ])

      if (courseData) setCourse(courseData)
      if (bellsData) setAlarmBells(bellsData)
      if (progressData) setCompletedIds(new Set(progressData.map((p: { alarm_bell_id: string }) => p.alarm_bell_id)))
      setLoading(false)
    }
    load()
  }, [])

  const completedCount = completedIds.size
  const totalCount = alarmBells.length || 10
  const progressPct = Math.round((completedCount / totalCount) * 100)
  const activeBell = alarmBells.find(b => !completedIds.has(b.id))
  const lastCompleted = alarmBells.filter(b => completedIds.has(b.id)).at(-1)

  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (completedCount / totalCount) * circumference

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0F1335', color: '#C5C9E8' }}>
        Laden…
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0F1335' }}>
      {/* Sidebar */}
      <aside style={{ width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', background: '#181D45', borderRight: '1px solid #2F3565' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 16px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #FFB347, #FF9F1C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
          }}>
            🔔
          </div>
          <span style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>
            Zin <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#FFB347' }}>of</em> Onzin?
          </span>
        </div>

        {/* Nav */}
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
                fontWeight: item.active ? 700 : 500, fontSize: 15, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                borderLeft: `3px solid ${item.active ? '#B594F7' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Progress card */}
        <div style={{ margin: '0 12px 12px', padding: 16, borderRadius: 18, background: '#20264F' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#8B91B8', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Jouw voortgang</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={radius} fill="none" stroke="#2F3565" strokeWidth="6" />
              <circle
                cx="36" cy="36" r={radius} fill="none"
                stroke="#B594F7" strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
              <text x="36" y="41" textAnchor="middle" fill="#FFFFFF" style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 16 }}>
                {completedCount}/{totalCount}
              </text>
            </svg>
            <div>
              <p style={{ fontSize: 12, color: '#8B91B8', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>alarmbellen</p>
              <p style={{ fontSize: 14, color: '#C5C9E8', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>voltooid</p>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#8B91B8', marginBottom: 6, fontWeight: 600, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Totaal voortgang</div>
          <div style={{ height: 6, borderRadius: 99, background: '#2F3565', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${progressPct}%`, background: 'linear-gradient(90deg, #B594F7, #8B6FE0)', transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px', borderTop: '1px solid #2F3565' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
            S
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Sanne</p>
            <p style={{ fontSize: 13, color: '#8B91B8', fontWeight: 500, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Leerling</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '12px 24px', borderBottom: '1px solid #2F3565' }}>
          <button style={{ padding: '8px 16px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#20264F', color: '#C5C9E8', border: '1px solid #2F3565', cursor: 'pointer', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            Bibliotheek
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            S
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Hero */}
          <div style={{ position: 'relative', marginBottom: 24, marginRight: -24 }}>
            {/* Hero image — absolutely fills right half, bleeds to page edge */}
            <div style={{ position: 'absolute', top: -20, right: 0, bottom: 0, width: '60%', zIndex: 0, pointerEvents: 'none' }}>
              <img src="/illustrations/hero.png" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0F1335 0%, transparent 30%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0F1335 0%, transparent 35%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0F1335 0%, transparent 25%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, #0F1335 0%, transparent 10%)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, paddingRight: 24 }}>
              <h1
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12 }}
                dangerouslySetInnerHTML={{
                  __html: (course?.tagline_html || 'Leer onzin herkennen.<br>Kijk <em>scherper</em>. Denk <em>kritischer</em>.')
                    .replace(/<em>scherper<\/em>/g, '<em style="font-family:\'Fraunces\',serif;font-style:italic;color:#B594F7">scherper</em>')
                    .replace(/<em>kritischer<\/em>/g, '<em style="font-family:\'Fraunces\',serif;font-style:italic;color:#FFB347">kritischer</em>')
                }}
              />
              <div style={{ height: 3, width: 48, borderRadius: 99, background: 'linear-gradient(90deg, #B594F7, #FFB347)', marginBottom: 16 }} />
              <p style={{ fontSize: 15, color: '#C5C9E8', lineHeight: 1.6, marginBottom: 20 }}>
                {course?.subtitle}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Pill icon="🕐" label={`~${course?.total_duration_min ?? 90} minuten`} sub="totale duur" color="#B594F7" bg="rgba(181,148,247,0.12)" />
                <Pill icon="📝" label={`${course?.vote_rounds ?? 10} oefenrondes`} sub="±10 vragen per les" color="#6BCF7F" bg="rgba(107,207,127,0.12)" />
                <Pill icon="▶" label={`${course?.video_count ?? 10} video's`} sub="helder uitgelegd" color="#4A9EFF" bg="rgba(74,158,255,0.12)" />
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            {alarmBells.map(bell => (
              <AlarmBellCard
                key={bell.id}
                bell={bell}
                completed={completedIds.has(bell.id)}
                active={activeBell?.id === bell.id}
                onClick={() => router.push(`/les/${toSlug(bell.title)}`)}
              />
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', gap: 16, padding: '16px 24px', borderTop: '1px solid #2F3565', background: '#181D45', flexShrink: 0 }}>
          {/* Cell 1 — progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(181,148,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B594F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', marginBottom: 6 }}>
                Voortgang: {completedCount} van de {totalCount} alarmbellen voltooid
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Array.from({ length: totalCount }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < completedCount ? '#B594F7' : '#2F3565' }} />
                ))}
              </div>
            </div>
          </div>
          {/* Cell 2 — tip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(181,148,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B594F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#B594F7', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Tip van vandaag
              </p>
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 13, color: '#C5C9E8', lineHeight: 1.4 }}>
                {course?.tip_of_the_day}
              </p>
            </div>
          </div>
          {/* Cell 3 — verder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(107,207,127,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6BCF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#6BCF7F', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Verder gaan waar je was?
              </p>
              <p style={{ fontSize: 13, color: '#C5C9E8', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Je laatste les: <strong>{lastCompleted?.title ?? activeBell?.title ?? '—'}</strong>
              </p>
            </div>
          </div>
          <button style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', color: '#FFFFFF', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Ga verder →
          </button>
        </div>
      </main>
    </div>
  )
}

function Pill({ icon, label, sub, color, bg }: { icon: string; label: string; sub: string; color: string; bg: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: bg, border: `1px solid ${color}44`, cursor: 'default' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color, lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#8B91B8', lineHeight: 1.2 }}>{sub}</p>
      </div>
    </div>
  )
}

function BellBadge({ number, colorFrom, colorTo }: { number: number; colorFrom: string; colorTo: string }) {
  const gradId = `bell-grad-${number}`
  return (
    <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={colorFrom} />
          <stop offset="1" stopColor={colorTo} />
        </linearGradient>
      </defs>
      {/* Bell body */}
      <path d="M8 26C8 12 14 7 22 7C30 7 36 12 36 26V36H8V26Z" fill={`url(#${gradId})`} />
      {/* Bell rim */}
      <rect x="5" y="35" width="34" height="5" rx="2.5" fill={`url(#${gradId})`} />
      {/* Clapper */}
      <ellipse cx="22" cy="43" rx="4" ry="3" fill={`url(#${gradId})`} />
      {/* Number */}
      <text x="22" y="30" textAnchor="middle" fill="white"
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 15 }}>
        {number}
      </text>
    </svg>
  )
}

function AlarmBellCard({ bell, completed, active, onClick }: { bell: AlarmBell; completed: boolean; active: boolean; onClick: () => void }) {
  const illustrationSrc = bell.illustration_path
    ? `/illustrations/${bell.illustration_path.split('/').pop()}`
    : null

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: '0.78',
        background: '#20264F',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: active
          ? `0 0 0 2px ${bell.color_solid}, 0 8px 24px rgba(0,0,0,.25)`
          : '0 8px 24px rgba(0,0,0,.25)',
        opacity: completed ? 0.75 : 1,
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 50px rgba(0,0,0,.4)` }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = active ? `0 0 0 2px ${bell.color_solid}, 0 8px 24px rgba(0,0,0,.25)` : '0 8px 24px rgba(0,0,0,.25)' }}
    >
      {/* Art area */}
      <div style={{ position: 'relative', flexShrink: 0, height: '56%' }}>
        {illustrationSrc ? (
          <>
            <img src={illustrationSrc} alt={bell.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,38,79,0.8) 0%, transparent 50%)' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${bell.color_from}, ${bell.color_to})`, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              #{String(bell.position).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Bell badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}>
          <BellBadge number={bell.position} colorFrom={bell.color_from} colorTo={bell.color_to} />
        </div>

        {completed && (
          <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: '#6BCF7F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>
            ✓
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '14px 14px 12px', gap: 6 }}>
        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 20, lineHeight: 1.15 }}>{bell.title}</p>
        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: 14, color: '#C5C9E8', lineHeight: 1.35 }}>{bell.subtitle}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', background: 'rgba(181,148,247,0.15)', color: '#B594F7' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ~{bell.duration_min} min
          </span>
          {bell.has_vote_round && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', background: `${bell.color_solid}22`, color: bell.color_solid }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Oefenvragen
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
