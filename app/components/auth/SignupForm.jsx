"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    expertise: "",
    role: "Individual",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Info:", formData);
    // Add logic here to hit actual signup endpoint
  };

  const inputClasses =
    "w-full bg-[#F9FAFB] dark:bg-[#0F313D] border border-gray-200 dark:border-white/10 text-foreground dark:text-white px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1C5B6F] dark:focus:ring-[#6BE3DF] focus:border-transparent focus:shadow-md hover:bg-white dark:hover:bg-[#0c262f]";
  const labelClasses =
    "block text-sm font-semibold text-foreground dark:text-white mb-1.5 transition-colors duration-300";

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0F313D] dark:text-white transition-colors duration-300">
          Get Started With FRL
        </h1>
        <p className="text-sm font-medium text-muted-foreground dark:text-white/80 mt-2 transition-colors duration-300">
          Join us for new age of healthcare system for aged people
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelClasses}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter Your First Name"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter Your Last Name"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Email & Phone Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="someone@email.com"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Phone Number</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-[#F9FAFB] hover:bg-white dark:bg-[#0F313D] px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-foreground dark:text-white transition-all duration-300 cursor-pointer shadow-sm">
                <span>🇮🇳</span>
                <span>+91</span>
                <span className="text-xs ml-1">▼</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Password Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelClasses}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your memorable password"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className={labelClasses}>Short bio about yourself</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short Bio / About Yourself"
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Sub-areas & Roles */}
        <div className="flex flex-col sm:flex-row gap-6 mt-2">
          <div className="flex-1">
            <label className={labelClasses}>Area of Interest / Expertise</label>
            <select
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className={`${inputClasses} appearance-none bg-[#1C5B6F] text-white dark:bg-[#0F313D]`}
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="healthcare">Healthcare</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Profile Type / Role</label>
            <div className="flex flex-col gap-3 mt-2">
              {["Individual", "Organization", "Volunteer", "Donor"].map(
                (role) => (
                  <label
                    key={role}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      onClick={() => handleRoleChange(role)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.role === role
                          ? "border-[#1C5B6F] dark:border-[#6BE3DF]"
                          : "border-gray-400 dark:border-white/50"
                      }`}
                    >
                      {formData.role === role && (
                        <div className="w-2.5 h-2.5 bg-[#1C5B6F] dark:bg-[#6BE3DF] rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground dark:text-white">
                      {role}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-4 mt-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-5 h-5 accent-[#1C5B6F] dark:accent-[#6BE3DF]"
            />
            <span className="text-sm font-medium text-foreground dark:text-white/90">
              I agree to the Terms & Conditions
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreeMarketing"
              checked={formData.agreeMarketing}
              onChange={handleChange}
              className="mt-0.5 w-5 h-5 accent-[#1C5B6F] dark:accent-[#6BE3DF]"
            />
            <span className="text-sm font-medium text-foreground dark:text-white/90 leading-snug">
              I would like to receive marketing and latest update information
              through email communication
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-[#1C5B6F] hover:bg-[#154655] dark:bg-[#EEFCFD] text-white dark:text-[#0F313D] py-4 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>

        <div className="text-center mt-2">
          <span className="text-sm font-medium text-foreground dark:text-white transition-colors duration-300">
            Already have an account?{" "}
          </span>
          <Link href="/login">
            <span className="text-sm font-bold text-[#1C5B6F] dark:text-[#6BE3DF] hover:underline transition-colors duration-300">
              Login
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
