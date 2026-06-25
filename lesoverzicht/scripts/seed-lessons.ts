import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ablwipvdvwcdnkawxpss.supabase.co',
  'sb_publishable_jDnPmYwpDnQtWzV-Hy83lA__HRxuXfw'
)

// Slugs must match the toSlug() function in page.tsx
// title.toLowerCase().replace(/[()]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
const LESSONS = [
  {
    slug: 'herkomst',
    lesson_number: 1,
    alarm_bell_position: 1,
    title: 'Herkomst',
    subtitle: 'Van wie komt deze informatie?',
    about: 'Niet alle bronnen zijn even betrouwbaar. In deze les leer je hoe je kunt checken wie er achter een bericht zit — en waarom dat zo belangrijk is voor kritisch denken.',
    video_poster: 'illustrations/herkomst.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Herkennen wie de afzender is van een bericht.',
      'Begrijpen waarom herkomst belangrijk is.',
      'Leren hoe je de bron van informatie kunt controleren.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'alexander-pleijter', position: 1, description: 'Journalist en onderzoeker mediagebruik.', photo: null, icon: 'i-brain', tone: 'amber' }],
  },
  {
    slug: 'gezag',
    lesson_number: 2,
    alarm_bell_position: 2,
    title: 'Gezag',
    subtitle: 'Weet de afzender ergens voldoende van?',
    about: 'Iemand kan heel zelfverzekerd klinken — maar weet diegene echt waar ze het over heeft? In deze les ontdek je hoe je echte expertise herkent.',
    video_poster: 'illustrations/gezag.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Begrijpen wat echte expertise inhoudt.',
      'Onderscheid maken tussen gezag en zelfvertrouwen.',
      'Kritisch kijken naar wie iets beweert.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'ili-ma', position: 1, description: 'Psycholoog gespecialiseerd in beïnvloeding.', photo: null, icon: 'i-brain', tone: 'purple' }],
  },
  {
    slug: 'belang',
    lesson_number: 3,
    alarm_bell_position: 3,
    title: 'Belang',
    subtitle: 'Wil iemand iets van jou?',
    about: 'Sociale media en apps zijn vaak gratis. Maar waarom eigenlijk? In deze les ontdek je hoe bedrijven en platforms jouw aandacht, keuzes en gegevens gebruiken voor hun eigen voordeel. En hoe beïnvloeding werkt — vaak subtieler dan je denkt.',
    video_poster: 'illustrations/belang.png',
    video_src: null,
    video_duration: '4:12',
    questions_count: 12,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Herkennen wanneer iemand belang bij je heeft.',
      'Inzien hoe beïnvloeding werkt op sociale media.',
      'Bewustere keuzes maken online.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [
      { expert_slug: 'ili-ma', position: 1, description: 'Expert in gedrag en beïnvloeding. Ze legt uit hoe keuzes gestuurd worden.', photo: 'illustrations/expert-bas-haring.png', icon: 'i-brain', tone: 'amber' },
      { expert_slug: 'ili-ma', position: 2, description: 'Analyseert data en laat zien wat er met jouw informatie gebeurt.', photo: null, icon: 'i-brain', tone: 'purple' },
    ],
  },
  {
    slug: 'onderbouwing',
    lesson_number: 4,
    alarm_bell_position: 4,
    title: 'Onderbouwing',
    subtitle: 'Wat is het bewijs?',
    about: 'Een bewering zonder bewijs is niets waard. In deze les leer je hoe je kunt checken of een claim echt onderbouwd is met feiten en onderzoek.',
    video_poster: 'illustrations/onderbouwing.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Begrijpen wat goed bewijs is.',
      'Onderscheid maken tussen mening en feit.',
      'Leren vragen om onderbouwing.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'ionica-smeets', position: 1, description: 'Wetenschapscommunicator, legt uit hoe je wetenschap kunt lezen.', photo: null, icon: 'i-brain', tone: 'blue' }],
  },
  {
    slug: 'logica',
    lesson_number: 5,
    alarm_bell_position: 5,
    title: 'Logica',
    subtitle: 'Klopt de redenering?',
    about: 'Soms klinkt een argument logisch maar klopt er iets niet. In deze les leer je veelvoorkomende denkfouten herkennen.',
    video_poster: 'illustrations/logica.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Veelvoorkomende drogredenering herkennen.',
      'Een argument stap voor stap kunnen analyseren.',
      'Leren doorvragen als een redenering niet klopt.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'caspar-jacobs', position: 1, description: 'Filosoof gespecialiseerd in argumentatieleer.', photo: null, icon: 'i-brain', tone: 'green' }],
  },
  {
    slug: 'te-simpel-of-te-zeker',
    lesson_number: 6,
    alarm_bell_position: 6,
    title: 'Te simpel of te zeker',
    subtitle: 'Is het niet te makkelijk?',
    about: 'De werkelijkheid is zelden zwart-wit. In deze les leer je waarom overdreven eenvoud of zekerheid een alarmbel moet zijn.',
    video_poster: 'illustrations/06-te-zeker.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Herkennen wanneer iets te simpel wordt voorgesteld.',
      'Begrijpen dat onzekerheid normaal is in wetenschap.',
      'Weerstand bieden aan te makkelijke antwoorden.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'ionica-smeets', position: 1, description: 'Wetenschapscommunicator, legt nuance in wetenschap uit.', photo: null, icon: 'i-brain', tone: 'purple' }],
  },
  {
    slug: 'vaag-of-oncontroleerbaar',
    lesson_number: 7,
    alarm_bell_position: 7,
    title: 'Vaag of oncontroleerbaar',
    subtitle: 'Is dit te controleren?',
    about: 'Als een bewering niet te checken valt, is dat verdacht. In deze les leer je hoe je herkent wanneer informatie bewust vaag of ongrijpbaar wordt gehouden.',
    video_poster: 'illustrations/07-vaag.png',
    video_src: null,
    video_duration: '4:00',
    questions_count: 10,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Herkennen wanneer beweringen niet te controleren zijn.',
      'Begrijpen waarom controleerbaarheid belangrijk is.',
      'Vragen stellen bij vage uitspraken.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'caspar-jacobs', position: 1, description: 'Filosoof die onderzoekt hoe kennis wordt onderbouwd.', photo: null, icon: 'i-brain', tone: 'blue' }],
  },
  {
    slug: 'manipulatie',
    lesson_number: 8,
    alarm_bell_position: 8,
    title: 'Manipulatie',
    subtitle: 'Worden emoties ingezet?',
    about: 'Angst, woede, verbazing — emoties kunnen je oordeel vertroebelen. In deze les leer je hoe mediamakers emoties inzetten en hoe je je daartegen kunt wapenen.',
    video_poster: 'illustrations/02-gezag.png',
    video_src: null,
    video_duration: '6:00',
    questions_count: 12,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Herkennen wanneer emoties worden ingezet om te overtuigen.',
      'Begrijpen hoe framing werkt.',
      'Kalm blijven en redeneren ondanks emotionele prikkel.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'ili-ma', position: 1, description: 'Psycholoog die onderzoekt hoe emoties keuzes sturen.', photo: null, icon: 'i-brain', tone: 'amber' }],
  },
  {
    slug: 'verspreidingskracht',
    lesson_number: 9,
    alarm_bell_position: 9,
    title: 'Verspreidingskracht',
    subtitle: 'Is dit ontworpen om te verspreiden?',
    about: 'Sommige berichten zijn zo gemaakt dat je ze wil doorsturen. In deze les leer je de trucjes herkennen die viraal gaan bevorderen.',
    video_poster: 'illustrations/08-manipulatie.png',
    video_src: null,
    video_duration: '6:00',
    questions_count: 12,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Begrijpen waarom sommige berichten viraal gaan.',
      'Herkennen van technieken die verspreiding stimuleren.',
      'Nadenken voor je iets deelt.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'peter-burger', position: 1, description: 'Folklorist die onderzoekt hoe verhalen zich verspreiden.', photo: null, icon: 'i-brain', tone: 'purple' }],
  },
  {
    slug: 'echt-of-nep-ai',
    lesson_number: 10,
    alarm_bell_position: 10,
    title: 'Echt of nep (AI)',
    subtitle: 'Is dit gegenereerd of gemanipuleerd?',
    about: 'AI kan teksten, foto\'s en video\'s maken die er echt uitzien. In deze les leer je hoe je AI-gegenereerde content kunt herkennen en wat dat betekent voor betrouwbaarheid.',
    video_poster: 'illustrations/10-ai.png',
    video_src: null,
    video_duration: '6:00',
    questions_count: 12,
    questions_after: 'via interactieve stemrondes met de klas.',
    questions_art: 'illustrations/quiz-phone.png',
    expectations_art: 'illustrations/bridge.png',
    goals: [
      'Begrijpen hoe AI content genereert.',
      'Signalen herkennen van nep-afbeeldingen en deepfakes.',
      'Kritisch omgaan met content van onbekende oorsprong.',
    ],
    steps: [
      { position: 1, title: 'Bekijk de video', description: 'Ontdek samen het onderwerp.' },
      { position: 2, title: 'Beantwoord de vragen', description: 'Deel je mening en luister naar anderen.' },
      { position: 3, title: 'Bespreek & leer', description: 'Wat heb je geleerd? Wat neem je mee?' },
    ],
    experts: [{ expert_slug: 'suzan-verberne', position: 1, description: 'Computerlinguïst die onderzoekt hoe AI taal genereert.', photo: null, icon: 'i-brain', tone: 'purple' }],
  },
]

async function seed() {
  console.log('🌱 Seeding lessons...')

  // Fetch course and alarm bells
  const { data: course } = await supabase.from('courses').select('id').single()
  if (!course) { console.error('No course found — run seed.ts first'); process.exit(1) }

  const { data: alarmBells } = await supabase
    .from('alarm_bells')
    .select('id, position')
    .eq('course_id', course.id)
  if (!alarmBells) { console.error('No alarm bells found'); process.exit(1) }

  const bellByPosition = Object.fromEntries(alarmBells.map(b => [b.position, b.id]))

  const { data: experts } = await supabase.from('experts').select('id, slug')
  if (!experts) { console.error('No experts found'); process.exit(1) }
  const expertBySlug = Object.fromEntries(experts.map(e => [e.slug, e.id]))

  for (const lesson of LESSONS) {
    const alarmBellId = bellByPosition[lesson.alarm_bell_position]
    if (!alarmBellId) { console.warn(`⚠ No alarm bell at position ${lesson.alarm_bell_position}`); continue }

    // Upsert lesson
    const { data: lessonRow, error: lessonErr } = await supabase
      .from('lessons')
      .upsert({
        course_id: course.id,
        alarm_bell_id: alarmBellId,
        slug: lesson.slug,
        lesson_number: lesson.lesson_number,
        title: lesson.title,
        subtitle: lesson.subtitle,
        about: lesson.about,
        video_poster: lesson.video_poster,
        video_src: lesson.video_src,
        video_duration: lesson.video_duration,
        questions_count: lesson.questions_count,
        questions_after: lesson.questions_after,
        questions_art: lesson.questions_art,
        expectations_art: lesson.expectations_art,
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (lessonErr) { console.error(`Lesson ${lesson.slug} error:`, lessonErr.message); continue }

    const lessonId = lessonRow.id

    // Goals
    await supabase.from('lesson_goals').delete().eq('lesson_id', lessonId)
    await supabase.from('lesson_goals').insert(
      lesson.goals.map((text, i) => ({ lesson_id: lessonId, position: i + 1, text }))
    )

    // Steps
    await supabase.from('lesson_steps').delete().eq('lesson_id', lessonId)
    await supabase.from('lesson_steps').insert(
      lesson.steps.map(s => ({ lesson_id: lessonId, position: s.position, title: s.title, description: s.description }))
    )

    // Experts
    await supabase.from('lesson_experts').delete().eq('lesson_id', lessonId)
    await supabase.from('lesson_experts').insert(
      lesson.experts.map(e => ({
        lesson_id: lessonId,
        expert_id: expertBySlug[e.expert_slug],
        position: e.position,
        description: e.description,
        photo: e.photo,
        icon: e.icon,
        tone: e.tone,
      }))
    )

    console.log(`✓ ${lesson.slug}`)
  }

  console.log('\n✅ Lessons seeded!')
}

seed()
