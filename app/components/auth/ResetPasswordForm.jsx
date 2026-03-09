"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi("/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Password reset successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
          <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          Invalid Link
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Link href="/forgot-password" className="w-full">
          <Button variant="outline" className="w-full h-14 rounded-2xl">
            Request New Link
          </Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          Password Reset
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
          Your password has been successfully updated. You can now log in with
          your new credentials.
        </p>
        <Link href="/login" className="w-full">
          <Button
            variant="primary"
            className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20"
          >
            Login Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight leading-none">
          Reset Password
        </h2>
        <p className="text-muted-foreground text-base font-light leading-relaxed">
          Create a new strong password for your FRL account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1 group-focus-within:text-primary transition-colors">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-background border-2 border-border text-foreground px-12 py-4 rounded-xl text-base font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="relative group">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1 group-focus-within:text-primary transition-colors">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-background border-2 border-border text-foreground px-12 py-4 rounded-xl text-base font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="default"
          className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/10"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
