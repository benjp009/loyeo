import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const MERCHANT_ROUTES = ['/dashboard']
const CONSUMER_ROUTES = ['/my']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isMerchantRoute = MERCHANT_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isConsumerRoute = CONSUMER_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if ((isMerchantRoute || isConsumerRoute) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
