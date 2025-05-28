"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/schemas"
import { sendPasswordReset } from "@/actions/auth"

export default function Page() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)
    try {
      const res = await sendPasswordReset(data)
      setMessage({ type: res.success ? "success" : "error", text: res.message })
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-40">
      <div className="flex-1 flex justify-center py-5">
        <div className="flex flex-col w-full max-w-md lg:max-w-[512px] py-5">
          <h2 className="text-[#121417] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Forgot Password
          </h2>

          {message && (
            <div
              className={`p-4 mb-4 text-sm ${
                message.type === "success"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              } rounded-lg`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
            <label className="flex flex-col">
              <p className="text-[#121417] text-base font-medium pb-2">Email address</p>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="form-input w-full rounded-xl bg-[#f1f2f4] p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 border-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </label>

            { !isSubmitting ? (
              <button
                type="submit"
                className="mt-3 w-full bg-[#d2e2f3] text-[#121417] font-bold text-sm h-10 rounded-full flex items-center justify-center"
              >
                Send reset link
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="mt-3 w-full bg-[#d2e2f3] text-[#121417] font-bold text-sm h-10 rounded-full flex items-center justify-center cursor-not-allowed"
              >
                Sending...
              </button>
            )}
          </form>

          <p className="text-[#677583] text-sm text-center underline py-4">
            Remembered?{' '}
            <Link href="/login" className="font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}