"use client";

import { LoginPage } from "@repo/ui/components/login-page";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../lib/api";

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        const response = await fetch(`${API_BASE}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.error || "Failed to login");
        }

        // Handle success (save token, redirect)
        localStorage.setItem("token", resData.token);
        router.push("/");
    };

    return (
        <LoginPage
            role="Admin"
            signupHref="/signup"
            brandingColor="slate"
            onLogin={handleLogin}
        />
    );
}
