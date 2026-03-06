import { SignupPage } from "@repo/ui/components/signup-page";

export default function AdminSignupPage() {
    return <SignupPage role="Admin" loginHref="/login" brandingColor="slate" />;
}
