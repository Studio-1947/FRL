"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi("/v1/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Password changed successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-3 uppercase">
          Password Updated
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
          Your password has been successfully changed. You can now continue
          using your account.
        </p>
        <Link href="/profile" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 rounded-xl">
            Go to Profile
          </Button>
        </Link>
      </div>
    );
  }

  const inputClasses =
    "w-full bg-background border-2 border-border text-foreground px-12 py-4 rounded-xl text-base font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm";
  const labelClasses =
    "text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1 group-focus-within:text-primary transition-colors";

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight leading-none uppercase text-foreground">
          Change Password
        </h2>
        <p className="text-muted-foreground text-base font-medium leading-relaxed">
          Please enter your current and new password to update your credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <label className={labelClasses}>Current Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div className="relative group">
          <label className={labelClasses}>New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
              required
              minLength={8}
            />
          </div>
        </div>

        <div className="relative group">
          <label className={labelClasses}>Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
              required
              minLength={8}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="default"
          className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/10 mt-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>

        <Link
          href="/profile"
          className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:underline transition-all mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </form>
    </div>
  );
}
