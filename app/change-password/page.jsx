import AuthLayout from "../components/auth/AuthLayout";
import ChangePasswordForm from "../components/auth/ChangePasswordForm";

export const metadata = {
  title: "Change Password | FRL",
  description: "Update your FRL account password.",
};

export default function ChangePasswordPage() {
  return (
    <AuthLayout>
      <ChangePasswordForm />
    </AuthLayout>
  );
}
