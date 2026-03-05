"use client";

import Link from "next/link";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            {/* ── Left branding panel ─────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white lg:px-20">
                <div>
                    {/* Graduation cap icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-6 h-16 w-16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                        <path d="M22 10v6" />
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                    </svg>
                    <h1 className="text-3xl font-bold leading-tight">Welcome Back</h1>
                    <p className="mt-2 text-sm text-white/80">
                        Access your placement portal and take the next step in your
                        <br />
                        career journey.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ────────────────────────────────── */}
            <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                    <p className="mb-6 text-sm text-indigo-600">Login as Student</p>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <Input id="email" type="email" placeholder="your.email@college.edu" className="h-10" />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <Input id="password" type="password" placeholder="Enter your password" className="h-10" />
                        </div>

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                Remember me
                            </label>
                            <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>

                    <p className="mt-2 text-center text-sm text-gray-400">
                        <Link href="#" className="hover:text-gray-600">
                            ← Back to role selection
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
