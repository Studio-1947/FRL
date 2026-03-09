import AuthLayout from "../components/auth/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Reset Password | FRL",
  description: "Create a new password for your FRL account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
