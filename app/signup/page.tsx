"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/schemas";
import { useState } from "react";
import { signupUser } from "@/actions/auth";


export interface SigupResponse {
  success: boolean;
  message: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupResponse, setSignupResponse] = useState<SigupResponse | null>(null);
  const onSubmit = async (data: SignupFormData) => {
    // Handle form submission logic here
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    setSignupResponse(await signupUser(data));
    setIsSubmitting(false);
    
  }
  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-40">
      <div className="flex flex-col w-full max-w-md lg:max-w-[512px] py-5">
        <h2 className="text-[#121417] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Sign up
        </h2>
        {signupResponse && (
          <div className={`p-4 mb-4 text-sm ${signupResponse.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-lg`} role="alert">
            {signupResponse.message}
          </div>
        )}
        <p className="text-[#677583] text-sm text-center px-4 pb-4">
          Please fill in the form below to create an account.
        </p>
        <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col flex-1 min-w-0">
              <p className="text-[#121417] text-base font-medium pb-2">
                First name
              </p>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className="form-input w-full rounded-xl border border-[#dde0e4] bg-white p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 focus:border-[#dde0e4]"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </label>
            <label className="flex flex-col flex-1 min-w-0">
              <p className="text-[#121417] text-base font-medium pb-2">
                Last name
              </p>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
                className="form-input w-full rounded-xl border border-[#dde0e4] bg-white p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 focus:border-[#dde0e4]"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </label>
          </div>
          <label className="flex flex-col">
            <p className="text-[#121417] text-base font-medium pb-2">Email</p>
            <input
                {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="form-input w-full rounded-xl border border-[#dde0e4] bg-white p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 focus:border-[#dde0e4]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </label>
          <label className="flex flex-col">
            <p className="text-[#121417] text-base font-medium pb-2">
              Username
            </p>
            <input
                {...register("username")}
              type="text"
              placeholder="Enter your username"
              className="form-input w-full rounded-xl border border-[#dde0e4] bg-white p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 focus:border-[#dde0e4]"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">
                {errors.username.message}
              </p>
            )}
          </label>
          <label className="flex flex-col">
            <p className="text-[#121417] text-base font-medium pb-2">
              Password
            </p>
            <input
                {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="form-input w-full rounded-xl border border-[#dde0e4] bg-white p-4 text-base text-[#121417] placeholder-[#677583] h-14 focus:outline-none focus:ring-0 focus:border-[#dde0e4]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </label>
          {!isSubmitting ? (
            <button
            type="submit"
            className="mt-3 w-full bg-[#d2e2f3] text-[#121417] font-bold text-sm h-10 rounded-full flex items-center justify-center"
          >
            Sign up
          </button>
          ):(
            // Show a loading progress indicator
            <button
            type="button"
            className="mt-3 w-full bg-[#d2e2f3] text-[#121417] font-bold text-sm h-10 rounded-full flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <span className="loader"></span> Signing up...
          </button>
          )}
        </form>
        <p className="text-[#677583] text-sm text-center underline py-4">
          Already have an account?{" "}
          <Link href="/login" className="font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
