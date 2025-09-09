import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Ottieni la sessione dell'utente
  const { data: { user } } = await supabase.auth.getUser()

  // Route protette che richiedono autenticazione
  const protectedRoutes = ['/manage', '/superadmin', '/lai']
  
  // Route pubbliche che non richiedono autenticazione
  const publicRoutes = ['/login', '/register', '/instructions', '/']

  const { pathname } = request.nextUrl

  // Se l'utente non è autenticato e sta cercando di accedere a una route protetta
  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se l'utente è autenticato e sta cercando di accedere alla pagina di login
  if (user && pathname === '/login') {
    const manageUrl = new URL('/manage', request.url)
    return NextResponse.redirect(manageUrl)
  }

  // Se l'utente è autenticato e accede alla root, reindirizza a manage
  if (user && pathname === '/') {
    const manageUrl = new URL('/manage', request.url)
    return NextResponse.redirect(manageUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
