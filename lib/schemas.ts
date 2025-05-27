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

