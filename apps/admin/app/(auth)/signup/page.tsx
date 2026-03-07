"use client";

import { SignupPage } from "@repo/ui/components/signup-page";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../lib/api";

export default function AdminSignupPage() {
    const router = useRouter();

    const handleSendOtp = async (email: string) => {
        const response = await fetch(`${API_BASE}/auth/signup/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.error || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (data: { email: string; otp: string; password: string }) => {
        const response = await fetch(`${API_BASE}/auth/signup/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.error || "Failed to verify OTP");
        }

        // Successfully verified and logged in
        localStorage.setItem("token", resData.token);
        router.push("/");
    };

    return (
        <SignupPage
            role="Admin"
            loginHref="/login"
            brandingColor="slate"
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
        />
    );
}
