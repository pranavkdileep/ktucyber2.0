"use client"
import React from 'react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-40">
      <div className="flex-1 flex justify-center py-5">
        <div className="flex flex-col w-full max-w-md lg:max-w-[512px] py-5">
          <h2 className="text-[#121417] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Welcome back
          </h2>
          <form className="flex flex-col gap-4 px-4">
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col flex-1 min-w-0">
                <p className="text-[#121417] text-base font-medium pb-2">
                  Username or email
                </p>
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  className="form-input w-full rounded-xl bg-[#f1f2f4] p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 border-none"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col flex-1 min-w-0">
                <p className="text-[#121417] text-base font-medium pb-2">
                  Password
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input w-full rounded-xl bg-[#f1f2f4] p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 border-none"
                />
              </label>
            </div>
            <p className="text-[#677583] text-sm underline px-4">
              <Link href="/forgot-password">Forgot password?</Link>
            </p>
            <button
              type="submit"
              className="mt-3 w-full bg-[#d2e2f3] text-[#121417] font-bold text-sm h-10 rounded-full flex items-center justify-center"
            >
              Log in
            </button>
          </form>
          <p className="text-[#677583] text-sm text-center underline py-4">
        Don’t have an account?{' '}
        <Link href="/signup" className="font-medium">
          Sign up
        </Link>
      </p>
        </div>
        
      </div>
     
      
    </div>
  )
}