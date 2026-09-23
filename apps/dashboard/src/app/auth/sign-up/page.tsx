import { AuthLayout } from "@/components/auth-layout";
import { SignupForm } from "./components/signup-form";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
