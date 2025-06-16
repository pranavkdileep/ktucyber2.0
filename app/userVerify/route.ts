import { logoutUser, verifyEmailVerificationToken } from "@/actions/auth";
import { NextRequest,NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if(!token) {
    return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
  }
  const res = await verifyEmailVerificationToken(token);
    if(res.success) {
        //redirect to login page with success message
        await logoutUser();
        return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent(res.message)}`, request.url));
    } else {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
    }
}