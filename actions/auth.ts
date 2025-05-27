'use server';
import { sql } from "@/lib/db";
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { signupSchema, SignupFormData, LoginFormData, loginSchema } from "@/lib/schemas";
import bcrypt from 'bcrypt';


const encoder = new TextEncoder();
const SECRET = process.env.JWT_SECRET || 'defaultsecretkey';
const SECRET_BYTES = encoder.encode(SECRET);
const EXPIRATION_TIME = '2h';
const COOKIE_NAME = 'auth_token';

export async function signToken(
    payload: JWTPayload,
    expiresIn: string = '2h'
): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(SECRET_BYTES);
}
export async function verifyToken(): Promise<{ success: boolean; payload?:JWTPayload }> {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get(COOKIE_NAME)?.value;
        const { payload } = await jwtVerify(token!, SECRET_BYTES, {
            algorithms: ['HS256']
        });
        return {success:true, payload};
    } catch(error) {
        console.error('Token verification failed:', error);
        return { success: false, payload: undefined };
    }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
    try {
        console.log('Logging out user...');
        const cookieStore = cookies();
        // Remove the cookie by setting its maxAge to -1 or expires to a past date
        (await
            // Remove the cookie by setting its maxAge to -1 or expires to a past date
            cookieStore).set({
            name: COOKIE_NAME,
            value: '',
            httpOnly: true,
            path: '/',
            maxAge: -1, // Or use expires: new Date(0)
        });
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Error logging out:', error);
        return { success: false, message: `Error logging out: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function signupUser(data: SignupFormData): Promise<{ success: boolean; message: string }> {
    try {
        const parsedData = signupSchema.safeParse(data);
        if (!parsedData.success) {
            return { success: false, message: 'Invalid input data' };
        }
        const { firstName, lastName, email, username, password } = parsedData.data;
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
        if (existingUser.length > 0) {
            return { success: false, message: 'User with this email or username already exists' };
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const id = crypto.randomUUID();
        const verificationToken = await signToken({ id, email, username }, '1h');
        const createuserResult = await sql`
    INSERT INTO users (id, first_name, last_name, email, username, password_hash,user_role, is_active, is_verified, verification_token_jwt)
    VALUES (${id}, ${firstName}, ${lastName}, ${email}, ${username}, ${passwordHash}, 'user', TRUE, FALSE, ${verificationToken})
    RETURNING id, first_name, last_name, email, username, user_role, is_active, is_verified;
    `;
        if (createuserResult.length === 0) {
            return { success: false, message: 'Failed to create user' };
        }
        else {
            const user = createuserResult[0];
            const token = await signToken({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                username: user.username,
                isActive: user.is_active,
                isEmailVerified: user.is_verified,
                roles: user.user_role as 'user' | 'admin' | 'superadmin'
            }, EXPIRATION_TIME);
            const cookieStore = cookies();
            (await cookieStore).set({
                name: COOKIE_NAME,
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return { success: true, message: `User created successfully Please Verify Email With Link http://localhost:3000/userVerify?token=${verificationToken}` };
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function loginUser(data : LoginFormData): Promise<{ success: boolean; message: string }> {
    try {
        const parsedData = loginSchema.safeParse(data);
        if (!parsedData.success) {
            return { success: false, message: 'Invalid input data' };
        }
        const { email, password } = parsedData.data;
        const user = await sql`SELECT * FROM users WHERE email = ${email} OR username = ${email}`;
        if (user.length === 0) {
            return { success: false, message: 'User not found' };
        }
        const isPasswordValid = await bcrypt.compare(password, user[0].password_hash);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' };
        }
        const token = await signToken({
            id: user[0].id,
            firstName: user[0].first_name,
            lastName: user[0].last_name,
            email: user[0].email,
            username: user[0].username,
            isActive: user[0].is_active,
            isEmailVerified: user[0].is_verified,
            roles: user[0].user_role as 'user' | 'admin' | 'superadmin'
        }, EXPIRATION_TIME);
        const cookieStore = cookies();
        (await cookieStore).set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return { success: true, message: 'Login successful Redirecting' };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: `Error logging in: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}


