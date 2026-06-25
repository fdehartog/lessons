import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ablwipvdvwcdnkawxpss.supabase.co',
  'sb_publishable_jDnPmYwpDnQtWzV-Hy83lA__HRxuXfw'
)

const data = {
  course: {
    slug: 'zin-of-onzin',
    title: 'Zin of Onzin?',
    tagline_html: 'Leer onzin herkennen.<br>Kijk <em>scherper</em>. Denk <em>kritischer</em>.',
    subtitle: 'Ontdek de 10 alarmbellen die je helpen om onzin te herkennen in gesprekken, nieuws en op sociale media.',
    total_duration_min: 90,
    vote_rounds: 10,
    video_count: 10,
    tip_of_the_day: 'Twijfel is geen zwakte — het is je brein dat beter wil begrijpen.',
  },
  experts: [
    { slug: 'ili-ma', name: 'Ili Ma', initials: 'IM', role: 'Psycholoog' },
    { slug: 'alexander-pleijter', name: 'Alexander Pleijter', short_name: 'A. Pleijter', initials: 'AP', role: 'Journalist' },
    { slug: 'ionica-smeets', name: 'Ionica Smeets', short_name: 'I. Smeets', initials: 'IS', role: 'Wetenschapscommunicator' },
    { slug: 'caspar-jacobs', name: 'Caspar Jacobs', short_name: 'C. Jacobs', initials: 'CJ', role: 'Filosoof' },
    { slug: 'peter-burger', name: 'Peter Burger', short_name: 'P. Burger', initials: 'PB', role: 'Folklorist' },
    { slug: 'suzan-verberne', name: 'Suzan Verberne', short_name: 'S. Verberne', initials: 'SV', role: 'Computerlinguïst' },
  ],
  alarm_bells: [
    { position: 1,  title: 'Herkomst',               subtitle: 'Van wie komt deze informatie?',           duration_min: 4, has_vote_round: true, expert_slug: 'alexander-pleijter', color: { solid: '#B594F7', from: '#B594F7', to: '#8B6FE0' }, illustration: 'illustrations/herkomst.png' },
    { position: 2,  title: 'Gezag',                   subtitle: 'Weet de afzender ergens voldoende van?',  duration_min: 4, has_vote_round: true, expert_slug: 'ili-ma',              color: { solid: '#FF9F1C', from: '#FFB347',  to: '#FF9F1C' }, illustration: 'illustrations/gezag.png' },
    { position: 3,  title: 'Belang',                  subtitle: 'Wil iemand iets van jou?',               duration_min: 4, has_vote_round: true, expert_slug: 'ili-ma',              color: { solid: '#FF6B35', from: '#FF9A6C',  to: '#FF6B35' }, illustration: 'illustrations/belang.png' },
    { position: 4,  title: 'Onderbouwing',             subtitle: 'Wat is het bewijs?',                     duration_min: 4, has_vote_round: true, expert_slug: 'ionica-smeets',       color: { solid: '#4A9EFF', from: '#4A9EFF',  to: '#2E7DD7' }, illustration: 'illustrations/onderbouwing.png' },
    { position: 5,  title: 'Logica',                  subtitle: 'Klopt de redenering?',                   duration_min: 4, has_vote_round: true, expert_slug: 'caspar-jacobs',       color: { solid: '#6BCF7F', from: '#6BCF7F',  to: '#4FB263' }, illustration: 'illustrations/logica.png' },
    { position: 6,  title: 'Te simpel of te zeker',   subtitle: 'Is het niet te makkelijk?',              duration_min: 4, has_vote_round: true, expert_slug: 'ionica-smeets',       color: { solid: '#FF6B8A', from: '#FF6B8A',  to: '#E84D6F' }, illustration: 'illustrations/06-te-zeker.png' },
    { position: 7,  title: 'Vaag of oncontroleerbaar',subtitle: 'Is dit te controleren?',                 duration_min: 4, has_vote_round: true, expert_slug: 'caspar-jacobs',       color: { solid: '#5BC0EB', from: '#5BC0EB',  to: '#3DA5D1' }, illustration: 'illustrations/07-vaag.png' },
    { position: 8,  title: 'Manipulatie',             subtitle: 'Worden emoties ingezet?',                duration_min: 6, has_vote_round: true, expert_slug: 'ili-ma',              color: { solid: '#FFD166', from: '#FFD166',  to: '#F0BA42' }, illustration: 'illustrations/02-gezag.png' },
    { position: 9,  title: 'Verspreidingskracht',     subtitle: 'Is dit ontworpen om te verspreiden?',    duration_min: 6, has_vote_round: true, expert_slug: 'peter-burger',        color: { solid: '#FF6B35', from: '#FF9A6C',  to: '#FF6B35' }, illustration: 'illustrations/08-manipulatie.png' },
    { position: 10, title: 'Echt of nep (AI)',        subtitle: 'Is dit gegenereerd of gemanipuleerd?',   duration_min: 6, has_vote_round: true, expert_slug: 'suzan-verberne',      color: { solid: '#B594F7', from: '#B594F7',  to: '#8B6FE0' }, illustration: 'illustrations/10-ai.png' },
  ],
}

async function seed() {
  console.log('🌱 Seeding Supabase...')

  // Course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .upsert(data.course, { onConflict: 'slug' })
    .select('id')
    .single()
  if (courseErr) { console.error('Course error:', courseErr.message); process.exit(1) }
  console.log('✓ Course:', course.id)

  // Experts
  const { data: experts, error: expertsErr } = await supabase
    .from('experts')
    .upsert(data.experts, { onConflict: 'slug' })
    .select('id, slug')
  if (expertsErr) { console.error('Experts error:', expertsErr.message); process.exit(1) }
  console.log(`✓ Experts: ${experts.length} rows`)

  const expertBySlug = Object.fromEntries(experts.map(e => [e.slug, e.id]))

  // Alarm bells
  const bellRows = data.alarm_bells.map(b => ({
    course_id: course.id,
    position: b.position,
    title: b.title,
    subtitle: b.subtitle,
    duration_min: b.duration_min,
    has_vote_round: b.has_vote_round,
    expert_id: expertBySlug[b.expert_slug],
    color_solid: b.color.solid,
    color_from: b.color.from,
    color_to: b.color.to,
    illustration_path: b.illustration,
  }))

  const { error: bellsErr } = await supabase
    .from('alarm_bells')
    .upsert(bellRows, { onConflict: 'course_id,position' })
  if (bellsErr) { console.error('Alarm bells error:', bellsErr.message); process.exit(1) }
  console.log(`✓ Alarm bells: ${bellRows.length} rows`)

  console.log('\n✅ Done! Open http://localhost:3000 to see the result.')
}

seed()
