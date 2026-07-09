import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.SITE_PASSWORD

export function middleware(request: NextRequest) {
  // Skip the login page and the wetenschapper-antwoordpagina — die komt binnen via
  // een magic-link uit de mail, zonder site-login.
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/antwoord') return NextResponse.next()

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
