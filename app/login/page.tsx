'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const from = searchParams.get('from') || '/'
      router.push(from)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0F1335' }}>
      <div style={{ background: '#181D45', borderRadius: 24, padding: '40px 48px', width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid #2F3565' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #FFB347, #FF9F1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            🔔
          </div>
          <span style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff' }}>
            Zin <em style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#FFB347' }}>of</em> Onzin?
          </span>
        </div>

        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 6 }}>
          Toegang vereist
        </p>
        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 14, color: '#8B91B8', marginBottom: 28 }}>
          Dit platform is momenteel alleen voor intern gebruik.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 15,
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              background: '#20264F', border: `1px solid ${error ? '#FF6B8A' : '#2F3565'}`,
              color: '#fff', outline: 'none', marginBottom: 8,
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ fontSize: 13, color: '#FF6B8A', marginBottom: 12, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              Onjuist wachtwoord. Probeer het opnieuw.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              background: 'linear-gradient(135deg, #B594F7, #8B6FE0)',
              color: '#fff', border: 'none', cursor: loading || !password ? 'default' : 'pointer',
              opacity: loading || !password ? 0.6 : 1, marginTop: error ? 0 : 4,
            }}
          >
            {loading ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
