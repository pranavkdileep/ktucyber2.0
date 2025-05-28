import { z } from 'zod'

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email address'),
  username:  z.string().min(3, 'Username must be at least 3 characters'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
})
export type SignupFormData = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmpassword: z.string().min(8, 'Password must be at least 8 characters'),
})
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  isActive: boolean
  isEmailVerified: boolean
  roles: 'user' | 'admin' | 'superadmin'
}

