"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchApi("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      login(data.user);
      toast.success("Welcome back to FRL!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Connecting to server failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-background border-2 border-border text-foreground px-5 py-4 rounded-2xl text-base font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm";
  const labelClasses =
    "block text-sm font-black uppercase tracking-widest text-foreground/80 mb-2 transition-colors duration-300 ml-1";

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight uppercase">
          Welcome
        </h1>
        <p className="text-lg font-medium text-muted-foreground mt-3 leading-relaxed">
          Sign in to access your dashboard and perspectives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <label className={labelClasses}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="someone@email.com"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className={labelClasses}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={inputClasses}
            required
          />
        </div>

        <div className="flex justify-end mt-[-15px]">
          <Link
            href="/change-password"
            className="text-xs font-semibold uppercase tracking-tight text-primary cursor-pointer hover:underline transition-all"
          >
            Change Password?
          </Link>
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            Authenticate
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            New here?{" "}
          </span>
          <Link href="/signup" className="group">
            <span className="text-sm font-bold text-primary group-hover:underline decoration-2 underline-offset-4">
              Create an account
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
