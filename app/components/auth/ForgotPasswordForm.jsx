"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchApi("/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Reset link sent if account exists");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send reset link");
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
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          Check your inbox
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
          If an account exists for{" "}
          <span className="text-foreground font-semibold">{email}</span>, we've
          sent instructions to reset your password.
        </p>
        <Link href="/login" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 rounded-xl">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight leading-none">
          Forgot Password?
        </h2>
        <p className="text-muted-foreground text-base font-light leading-relaxed">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1 group-focus-within:text-primary transition-colors">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-background border-2 border-border text-foreground px-12 py-4 rounded-xl text-base font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm"
              required
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
            "Send Reset Link"
          )}
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:underline transition-all mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </form>
    </div>
  );
}
