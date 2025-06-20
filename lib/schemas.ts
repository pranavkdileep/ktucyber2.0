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

export interface Document {
  id: string
  slug: string
  userId: string
  title: string
  description: string
  subjectId: string
  subjectName?: string
  subjectSlug?: string
  subjectCode?: string
  universityId: string
  universityName?: string
  universitySlug?: string
  documentType: 'pdf' | 'docx' | 'pptx' | 'xlsx'
  fileKey: string
  isPublic: boolean
  tags?: string[]
  previewImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  theme: 'light' | 'dark'
  username: string
  fullName: string
  email: string
  profilePicture: string
  dateOfJoining: string
  bio: string
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
    instagram?: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
  }
  totalFollowers: number
  totalFollowing: number
  totalUploadedDocuments: number
  totalDownloadedDocuments: number
}

export interface University {
  id: string;
  name: string;
  slug: string;
  image_link?: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  code: string;
  description?: string;
}