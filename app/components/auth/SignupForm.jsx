"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { ChevronDown, Star } from "lucide-react";

export default function SignupForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    expertise: "",
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchApi("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          bio: formData.bio,
          expertise: formData.expertise,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Signup failed: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      login(data.user);
      toast.success("Registration successful!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Connection failed. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-background border-2 border-border text-foreground px-5 py-4 rounded-2xl text-[15px] font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm";
  const labelClasses =
    "block text-[11px] font-black uppercase tracking-widest text-foreground/70 mb-2 ml-1";

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight uppercase">
          Join Us
        </h1>
        <p className="text-lg font-medium text-muted-foreground mt-2 leading-relaxed">
          Create an account to join the movement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex-1">
            <label className={labelClasses}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ex: Ravi"
              className={inputClasses}
              required
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ex: Kumar"
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex-1">
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
          <div className="flex-1 text-left">
            <label className={labelClasses}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91..."
              className={inputClasses}
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex-1">
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
          <div className="flex-1">
            <label className={labelClasses}>Confirm</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className={labelClasses}>Your Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Expertise */}
        <div className="flex-1">
          <label className={labelClasses}>Expertise</label>
          <div className="relative group">
            <select
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className={`${inputClasses} appearance-none pr-10 w-full`}
              required
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="healthcare">Healthcare</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-5 pt-4 border-t border-border/50">
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-5 h-5 accent-primary rounded-lg"
              required
            />
            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              I agree to the Terms & Conditions
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            Create Account
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link href="/login" className="group">
            <span className="text-sm font-bold text-primary group-hover:underline decoration-2 underline-offset-4">
              Login
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
