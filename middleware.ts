import { NextRequest, NextResponse } from 'next/server'



const SECRET = process.env.JWT_SECRET || 'defaultsecretkey'
const encoder = new TextEncoder()
const SECRET_BYTES = encoder.encode(SECRET)
const COOKIE_NAME = 'auth_token'



export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    let isAuthenticated = false
    const token_jwt = req.cookies.get(COOKIE_NAME)
    //const authres = await verifyAuth(token_jwt!.value);
    isAuthenticated = true;

    // protect dashboard routes: redirect unauthenticated to /signup
    if (!isAuthenticated && pathname.startsWith('/user/dashboard')) {
        const url = req.nextUrl.clone()
        url.pathname = '/signup'
        return NextResponse.redirect(url)
    }

    // redirect already-logged-in from /signup to dashboard
    if (isAuthenticated && pathname === '/signup') {
        const url = req.nextUrl.clone()
        url.pathname = '/user/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/signup', '/user/dashboard/:path*'],
}