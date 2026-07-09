import { Suspense } from 'react'
import Shell from '@/components/antwoord/Shell'
import { LoadingScreen } from '@/components/antwoord/StateScreens'
import AntwoordClient from './AntwoordClient'

export default function AntwoordPage() {
  return (
    <Suspense fallback={<Shell><LoadingScreen /></Shell>}>
      <AntwoordClient />
    </Suspense>
  )
}
