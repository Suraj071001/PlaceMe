"use client";

import * as React from "react";
import { Input } from "./input";
import { Button } from "./button";

const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
];

interface SignupPageProps {
    role: "Student" | "Admin";
    loginHref: string;
    onSignUp?: (e: React.FormEvent<HTMLFormElement>) => void;
    brandingColor?: "emerald" | "indigo" | "slate";
}

export function SignupPage({ role, loginHref, onSignUp, brandingColor = "emerald" }: SignupPageProps) {
    const gradientClasses = {
        emerald: "from-emerald-400 to-emerald-600",
        indigo: "from-indigo-400 to-indigo-600",
        slate: "from-slate-700 to-slate-900",
    };

    const textClasses = {
        emerald: "text-emerald-600 hover:text-emerald-500",
        indigo: "text-indigo-600 hover:text-indigo-500",
        slate: "text-slate-800 hover:text-slate-700",
    };

    const bgClasses = {
        emerald: "bg-emerald-600 hover:bg-emerald-700",
        indigo: "bg-indigo-600 hover:bg-indigo-700",
        slate: "bg-slate-800 hover:bg-slate-900",
    };

    const selectedGradient = gradientClasses[brandingColor];
    const selectedText = textClasses[brandingColor];
    const selectedBg = bgClasses[brandingColor];

    return (
        <div className="flex min-h-screen">
            {/* ── Left branding panel ─────────────────────────────── */}
            <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-b ${selectedGradient} text-white lg:px-20`}>
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
                    <h1 className="text-3xl font-bold leading-tight">
                        Start Your Journey
                    </h1>
                    <p className="mt-2 text-sm text-white/80">
                        Create your account and unlock opportunities with our
                        <br />
                        smart placement platform.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ────────────────────────────────── */}
            <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <p className={`mb-6 text-sm ${selectedText.split(" ")[0]}`}>
                        Register as a {role}
                    </p>

                    <form className="space-y-4" onSubmit={onSignUp || ((e) => e.preventDefault())}>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-gray-700">
                                Full Name
                            </label>
                            <Input id="fullName" placeholder="John Doe" className="h-10" />
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <Input id="email" type="email" placeholder="your.email@example.com" className="h-10" />
                        </div>

                        {/* Conditionally render Student specific fields */}
                        {role === "Student" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="rollNumber" className="mb-1 block text-sm font-semibold text-gray-700">
                                        Roll Number
                                    </label>
                                    <Input id="rollNumber" placeholder="2024001" className="h-10" />
                                </div>
                                <div>
                                    <label htmlFor="branch" className="mb-1 block text-sm font-semibold text-gray-700">
                                        Branch
                                    </label>
                                    <select
                                        id="branch"
                                        className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <Input id="password" type="password" placeholder="Create a strong password" className="h-10" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-gray-700">
                                Confirm Password
                            </label>
                            <Input id="confirmPassword" type="password" placeholder="Re-enter password" className="h-10" />
                        </div>

                        {/* Submit */}
                        <Button type="submit" className={`w-full h-10 text-white rounded-full ${selectedBg}`}>
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href={loginHref} className={`font-medium ${selectedText}`}>
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
