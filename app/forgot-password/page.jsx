import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | FRL",
  description: "Reset your FRL account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
