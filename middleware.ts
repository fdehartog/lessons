import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.SITE_PASSWORD

const OPEN_PATHS = [
  '/login',
  '/api/login', // moet bereikbaar zijn zónder cookie — anders kan niemand ooit inloggen
  '/antwoord', // wetenschapper komt binnen via magic-link uit de mail, zonder site-login
]

export function middleware(request: NextRequest) {
  if (OPEN_PATHS.includes(request.nextUrl.pathname)) return NextResponse.next()

  // Check cookie
  const cookie = request.cookies.get('site-auth')
  if (cookie?.value === PASSWORD) return NextResponse.next()

  // Not authenticated — redirect to login
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|illustrations).*)'],
}
