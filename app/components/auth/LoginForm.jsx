"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { fetchApi } from "@/lib/api";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert(`Login failed: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      // Store token (example using localStorage)
      localStorage.setItem("access_token", data.access_token);
      alert("Login successful!");
      console.log("Logged in user:", data.user);

      // Redirect or update UI state here
      // window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("An error occurred during login. Is the backend running?");
    }
  };

  const inputClasses =
    "w-full bg-[#F9FAFB] dark:bg-[#0F313D] border border-gray-200 dark:border-white/10 text-foreground dark:text-white px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1C5B6F] dark:focus:ring-[#6BE3DF] focus:border-transparent focus:shadow-md hover:bg-white dark:hover:bg-[#0c262f]";
  const labelClasses =
    "block text-sm font-semibold text-foreground dark:text-white mb-1.5 transition-colors duration-300";

  return (
    <div className="flex flex-col gap-8 w-full max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0F313D] dark:text-white transition-colors duration-300">
          Welcome Back
        </h1>
        <p className="text-sm font-medium text-muted-foreground dark:text-white/80 mt-3 transition-colors duration-300">
          Login to your account to continue exploring fresh perspectives
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className={labelClasses}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end mt-[-10px]">
          <span className="text-sm font-medium text-[#1C5B6F] dark:text-[#6BE3DF] cursor-pointer hover:underline transition-colors duration-300">
            Forgot Password?
          </span>
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-[#1C5B6F] hover:bg-[#154655] dark:bg-[#EEFCFD] text-white dark:text-[#0F313D] py-4 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Login
          </Button>
        </div>

        <div className="text-center mt-2">
          <span className="text-sm font-medium text-foreground dark:text-white transition-colors duration-300">
            Don't have an account?{" "}
          </span>
          <Link href="/signup">
            <span className="text-sm font-bold text-[#1C5B6F] dark:text-[#6BE3DF] hover:underline transition-colors duration-300">
              Sign Up
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
