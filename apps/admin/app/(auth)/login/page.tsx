import { LoginPage } from "@repo/ui/components/login-page";

export default function AdminLoginPage() {
    return <LoginPage role="Admin" signupHref="/signup" brandingColor="slate" />;
}
