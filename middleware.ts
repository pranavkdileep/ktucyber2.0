import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = process.env.JWT_SECRET || 'defaultsecretkey'
const encoder = new TextEncoder()
const SECRET_BYTES = encoder.encode(SECRET)
const COOKIE_NAME = 'auth_token'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    let isAuthenticated = false

    // grab token from incoming request cookies
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (token) {
        try {
            await jwtVerify(token, SECRET_BYTES, { algorithms: ['HS256'] })
            isAuthenticated = true
        } catch (err) {
            console.error('JWT verification failed in middleware:', err)
        }
    }

    // protect dashboard routes
    if (!isAuthenticated && pathname.startsWith('/user/dashboard')) {
        const url = req.nextUrl.clone()
        url.pathname = '/signup'
        return NextResponse.redirect(url)
    }

    // redirect signed‐in users away from signup
    if (isAuthenticated && (pathname === '/signup' || pathname === '/login')) {
        const url = req.nextUrl.clone()
        url.pathname = '/user/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/signup', '/user/dashboard/:path*','/login'],
}