'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, MOCK_USER_ID } from '@/lib/supabase'

type Lesson = {
  id: string
  slug: string
  lesson_number: number
  title: string
  subtitle: string
  about: string
  video_poster: string | null
  video_src: string | null
  video_duration: string
  questions_count: number
  questions_after: string
  questions_art: string | null
  expectations_art: string | null
  alarm_bells: { color_solid: string; color_from: string; color_to: string } | null
}

type LessonGoal = { id: string; position: number; text: string }
type LessonStep = { id: string; position: number; title: string; description: string }
type LessonExpert = {
  id: string
  position: number
  description: string
  photo: string | null
  icon: string
  tone: string
  experts: { name: string; role: string } | null
}

type Course = { tip_of_the_day: string }

const STEP_COLORS = ['#B594F7', '#FFB347', '#6BCF7F']
const TONE_COLORS: Record<string, string> = {
  amber: '#FFB347',
  purple: '#B594F7',
  blue: '#5BC0EB',
  green: '#6BCF7F',
}

const NAV_ITEMS = [
  { label: 'Overzicht', icon: '⊞', active: false },
  { label: 'Voortgang', icon: '◎', active: false },
  { label: 'Bibliotheek', icon: '☰', active: false },
  { label: 'Reflectie', icon: '◇', active: false },
  { label: 'Docenten', icon: '👤', active: false },
  { label: 'Instellingen', icon: '⚙', active: false },
]

export default function LesDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [goals, setGoals] = useState<LessonGoal[]>([])
  const [steps, setSteps] = useState<LessonStep[]>([])
  const [lessonExperts, setLessonExperts] = useState<LessonExpert[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [
        { data: lessonData, error: lessonErr },
        { data: courseData },
        { data: progressData },
        { data: totalData },
      ] = await Promise.all([
        supabase
          .from('lessons')
          .select('*, alarm_bells(color_solid, color_from, color_to)')
          .eq('slug', slug)
          .single(),
        supabase.from('courses').select('tip_of_the_day').single(),
        supabase
          .from('student_progress')
          .select('alarm_bell_id')
          .eq('user_id', MOCK_USER_ID)
          .eq('completed', true),
        supabase.from('alarm_bells').select('id', { count: 'exact', head: true }),
      ])

      if (lessonErr || !lessonData) { setError('Les niet gevonden.'); setLoading(false); return }

      const [{ data: goalsData }, { data: stepsData }, { data: expertsData }] = await Promise.all([
        supabase.from('lesson_goals').select('*').eq('lesson_id', lessonData.id).order('position'),
        supabase.from('lesson_steps').select('*').eq('lesson_id', lessonData.id).order('position'),
        supabase
          .from('lesson_experts')
          .select('*, experts(name, role)')
          .eq('lesson_id', lessonData.id)
          .order('position'),
      ])

      setLesson(lessonData)
      setGoals(goalsData ?? [])
      setSteps(stepsData ?? [])
      setLessonExperts(expertsData ?? [])
      setCourse(courseData)
      setCompletedCount(progressData?.length ?? 0)
      setTotalCount(typeof totalData === 'number' ? totalData : 10)
      setLoading(false)
    }
    load()
  }, [slug])

  const progressPct = Math.round((completedCount / totalCount) * 100)
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (completedCount / totalCount) * circumference

  const accentFrom = lesson?.alarm_bells?.color_from ?? '#B594F7'
  const accentTo = lesson?.alarm_bells?.color_to ?? '#8B6FE0'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0F1335', color: '#C5C9E8' }}>
      Laden…
    </div>
  )

  if (error || !lesson) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0F1335', color: '#FF6B8A', flexDirection: 'column', gap: 16 }}>
      <p>{error ?? 'Les niet gevonden.'}</p>
      <button onClick={() => router.push('/')} style={{ padding: '8px 16px', borderRadius: 12, background: '#20264F', color: '#C5C9E8', border: '1px solid #2F3565', cursor: 'pointer', fontFamily: 'Nunito' }}>
        ← Terug naar overzicht
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0F1335' }}>
      {/* Sidebar */}
      <aside style={{ width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', background: '#181D45', borderRight: '1px solid #2F3565' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #FFB347, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🔔
          </div>
          <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>
            Zin <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#FFB347' }}>of</em> Onzin?
          </span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => item.label === 'Overzicht' && router.push('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 12, textAlign: 'left', cursor: 'pointer', border: 'none',
                background: 'transparent', color: '#8B91B8', fontWeight: 500, fontSize: 14,
                fontFamily: 'Nunito', borderLeft: '3px solid transparent', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ margin: '0 12px 12px', padding: 16, borderRadius: 18, background: '#20264F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={radius} fill="none" stroke="#2F3565" strokeWidth="6" />
              <circle cx="36" cy="36" r={radius} fill="none" stroke="#B594F7" strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                strokeLinecap="round" transform="rotate(-90 36 36)" />
              <text x="36" y="41" textAnchor="middle" fill="#FFFFFF" style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 16 }}>
                {completedCount}/{totalCount}
              </text>
            </svg>
            <div>
              <p style={{ fontSize: 11, color: '#8B91B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>alarmbellen</p>
              <p style={{ fontSize: 13, color: '#C5C9E8', fontWeight: 700 }}>voltooid</p>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#8B91B8', marginBottom: 6, fontWeight: 600 }}>Totaal {progressPct}%</div>
          <div style={{ height: 6, borderRadius: 99, background: '#2F3565', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${progressPct}%`, background: 'linear-gradient(90deg, #B594F7, #8B6FE0)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderTop: '1px solid #2F3565' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>S</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700 }}>Sanne</p>
            <p style={{ fontSize: 11, color: '#8B91B8', fontWeight: 500 }}>Leerling</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #2F3565', flexShrink: 0 }}>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: '#20264F', color: '#C5C9E8', border: '1px solid #2F3565', cursor: 'pointer', fontFamily: 'Nunito' }}
          >
            ← Terug naar overzicht
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: 'transparent', color: '#8B91B8', border: '1px solid #2F3565', cursor: 'pointer', fontFamily: 'Nunito' }}>
              📄 Lesinfo voor docenten
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B594F7, #8B6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>S</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>
          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, color: '#FFFFFF', fontSize: 12, fontWeight: 900, marginBottom: 10 }}>
              Les {lesson.lesson_number}
            </div>
            <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {lesson.title}
            </h1>
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 19, color: '#C5C9E8' }}>
              {lesson.subtitle}
            </p>
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Video player */}
              <div style={{ position: 'relative', aspectRatio: '16/9.2', borderRadius: 24, overflow: 'hidden', background: '#0A0E2A' }}>
                {lesson.video_poster && (
                  <img src={`/illustrations/${lesson.video_poster.split('/').pop()}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,42,0.85) 0%, transparent 50%)' }} />
                {/* Play button */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <button style={{ width: 84, height: 84, borderRadius: '50%', background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, border: 'none', cursor: 'pointer', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  >
                    ▶
                  </button>
                  <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Klik om af te spelen</span>
                </div>
                {/* Video controls bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>0:00 / {lesson.video_duration}</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
                    <div style={{ width: '4%', height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }} />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>🔊</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>⛶</span>
                </div>
              </div>

              {/* About */}
              <div style={{ background: '#20264F', borderRadius: 18, padding: 24 }}>
                <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22, marginBottom: 12 }}>Over deze les</h2>
                <p style={{ fontSize: 15.5, color: '#C5C9E8', lineHeight: 1.65, maxWidth: 720 }}>{lesson.about}</p>
              </div>

              {/* Experts */}
              {lessonExperts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h2 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 22 }}>In deze video</h2>
                  {lessonExperts.map(exp => {
                    const toneColor = TONE_COLORS[exp.tone] ?? '#B594F7'
                    const photoSrc = exp.photo ? `/illustrations/${exp.photo.split('/').pop()}` : null
                    return (
                      <div key={exp.id} style={{ position: 'relative', background: '#20264F', borderRadius: 18, minHeight: 168, overflow: 'hidden', display: 'flex' }}>
                        {/* Portrait */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, bottom: 0, width: '62%',
                          background: photoSrc
                            ? `url(${photoSrc}) 82% 8% / 95% no-repeat #181D45`
                            : 'repeating-linear-gradient(45deg, #2A3060 0px, #2A3060 4px, #20264F 4px, #20264F 12px)',
                          maskImage: 'linear-gradient(90deg, #000 0%, #000 34%, transparent 92%)',
                          WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 34%, transparent 92%)',
                        }}>
                          {!photoSrc && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>foto expert</span>
                            </div>
                          )}
                        </div>
                        {/* Text */}
                        <div style={{ marginLeft: '38%', padding: '18px 16px 18px 8px', flex: 1, position: 'relative' }}>
                          {/* Tone icon */}
                          <div style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 9, background: `${toneColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                            🧠
                          </div>
                          <p style={{ fontSize: 11.5, color: '#8B91B8', fontWeight: 600, marginBottom: 3 }}>{exp.experts?.role}</p>
                          <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{exp.experts?.name}</p>
                          <p style={{ fontSize: 12, color: '#C5C9E8', lineHeight: 1.5, paddingRight: 32 }}>{exp.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Goals card */}
              <div style={{ background: '#20264F', borderRadius: 18, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,179,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔔</div>
                  <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16 }}>Wat ga je leren?</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {goals.map(goal => (
                    <div key={goal.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(107,207,127,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#6BCF7F', flexShrink: 0, marginTop: 1 }}>✓</div>
                      <p style={{ fontSize: 14, color: '#C5C9E8', lineHeight: 1.4 }}>{goal.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions card */}
              <div style={{ position: 'relative', background: '#20264F', borderRadius: 18, padding: 20, overflow: 'hidden', minHeight: 140 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(181,148,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>❓</div>
                  <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16 }}>Aantal vragen</h3>
                </div>
                <p style={{ fontSize: 14, color: '#C5C9E8', lineHeight: 1.5, maxWidth: '60%', position: 'relative', zIndex: 1 }}>
                  Na de video beantwoord je <strong style={{ color: '#FFFFFF', fontSize: 22, display: 'block' }}>{lesson.questions_count}</strong> vragen {lesson.questions_after}
                </p>
                {lesson.questions_art && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%',
                    backgroundImage: `url(/illustrations/${lesson.questions_art.split('/').pop()})`,
                    backgroundSize: 'auto 100%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat',
                    maskImage: 'linear-gradient(90deg, transparent 0%, #000 60%)',
                    WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 60%)',
                  }} />
                )}
              </div>

              {/* Expectations card */}
              <div style={{ background: '#20264F', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,179,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏁</div>
                    <h3 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16 }}>Wat kun je verwachten?</h3>
                  </div>
                  <div style={{ position: 'relative', paddingLeft: 16 }}>
                    {/* Vertical line */}
                    <div style={{ position: 'absolute', left: 23, top: 12, height: 80, width: 2, background: 'linear-gradient(180deg, #B594F7, #FFB347, #6BCF7F)', borderRadius: 99 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {steps.map((step, i) => (
                        <div key={step.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: STEP_COLORS[i] ?? '#B594F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito', fontWeight: 900, fontSize: 12, color: '#fff', flexShrink: 0, marginLeft: -4 }}>
                            {step.position}
                          </div>
                          <div>
                            <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{step.title}</p>
                            <p style={{ fontSize: 13, color: '#8B91B8' }}>{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {lesson.expectations_art && (
                  <div style={{
                    aspectRatio: '1536/1024', width: '100%',
                    backgroundImage: `url(/illustrations/${lesson.expectations_art.split('/').pop()})`,
                    backgroundSize: '100% 100%',
                    maskImage: 'linear-gradient(180deg, transparent 0%, #000 28%)',
                    WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 28%)',
                  }} />
                )}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ height: 24 }} />
        </div>

        {/* Footer bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', gap: 16, padding: '16px 24px', borderTop: '1px solid #2F3565', background: '#181D45', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Voortgang: {completedCount} van de {totalCount} alarmbellen voltooid
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: totalCount }).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < completedCount ? '#B594F7' : '#2F3565' }} />
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#8B91B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tip van vandaag</p>
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 13, color: '#C5C9E8', lineHeight: 1.4 }}>
              {course?.tip_of_the_day}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#8B91B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Klaar om te starten?</p>
            <p style={{ fontSize: 13, color: '#C5C9E8' }}>Bekijk eerst de video en ontdek meer!</p>
          </div>
          <button style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: 'Nunito', background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`, color: '#FFFFFF', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Start de video ▶
          </button>
        </div>
      </main>
    </div>
  )
}
