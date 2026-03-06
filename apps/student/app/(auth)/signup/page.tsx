"use client";

import { SignupPage } from "@repo/ui/components/signup-page";
import { useRouter } from "next/navigation";

export default function StudentSignupPage() {
    const router = useRouter();

    const handleSendOtp = async (email: string) => {
        const response = await fetch("http://localhost:5000/api/v1/auth/signup/request-otp", {
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
        const response = await fetch("http://localhost:5000/api/v1/auth/signup/verify", {
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
            role="Student"
            loginHref="/login"
            brandingColor="emerald"
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
        />
    );
}
