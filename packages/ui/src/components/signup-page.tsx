"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

interface SignupPageProps {
    role: "Student" | "Admin";
    loginHref: string;
    onSendOtp?: (email: string) => Promise<void>;
    onVerifyOtp?: (data: { email: string; otp: string; password: string }) => Promise<void>;
    brandingColor?: "emerald" | "indigo" | "slate";
}

export function SignupPage({ role, loginHref, onSendOtp, onVerifyOtp, brandingColor = "emerald" }: SignupPageProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError("Email is required");
            return;
        }
        setLoading(true);
        try {
            if (onSendOtp) {
                await onSendOtp(email);
            }
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!otp || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            if (onVerifyOtp) {
                await onVerifyOtp({ email, otp, password });
            }
        } catch (err: any) {
            setError(err.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* ── Left branding panel ─────────────────────────────── */}
            <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-b ${selectedGradient} text-white lg:px-20`}>
                <div>
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
                        Activate your account to access your placement portal.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ────────────────────────────────── */}
            <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900">Activate Account</h2>
                    <p className={`mb-6 text-sm ${selectedText.split(" ")[0]}`}>
                        {step === 1 ? `Enter your registered email as a ${role}` : "Verify OTP and set password"}
                    </p>

                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                    {step === 1 ? (
                        <form className="space-y-4" onSubmit={handleSendOtp}>
                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="h-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className={`w-full h-10 text-white rounded-full ${selectedBg}`}>
                                {loading ? "Sending OTP..." : "Continue"}
                            </Button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="otp" className="mb-1 block text-sm font-semibold text-gray-700">
                                    6-Digit OTP
                                </label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter OTP from email"
                                    maxLength={6}
                                    className="h-10 text-center tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-700">
                                    New Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="h-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-gray-700">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter password"
                                    className="h-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className={`w-full h-10 text-white rounded-full ${selectedBg}`}>
                                {loading ? "Verifying..." : "Verify & Activate"}
                            </Button>

                            <p className="mt-2 text-center text-sm text-gray-500">
                                <button type="button" onClick={() => setStep(1)} className="hover:text-gray-700 underline">
                                    Change Email
                                </button>
                            </p>
                        </form>
                    )}

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Already have an active account?{" "}
                        <a href={loginHref} className={`font-medium ${selectedText}`}>
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
