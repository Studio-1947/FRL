"use client";

import React, { useState } from "react";
import { Lock, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function SecuritySection() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi("/v1/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        toast.success("Password updated successfully");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update password");
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 shadow-xl shadow-primary/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#1C5B6F]/10 rounded-[1.5rem]">
            <Lock className="w-8 h-8 text-[#1C5B6F]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0F313D] dark:text-white tracking-tight">
              Security Settings
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Update your password to keep your account secure
            </p>
          </div>
        </div>
        {!success && !error && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Last updated: Secured
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-[1.25rem] flex items-center gap-3 text-sm font-bold animate-in head-shake duration-500">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-5 py-4 rounded-[1.25rem] flex items-center gap-3 text-sm font-bold animate-in zoom-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Password changed successfully!
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-black text-[#0F313D] dark:text-[#dfc3b4] ml-1">
            Current Password
          </label>
          <input
            type="password"
            required
            value={formData.oldPassword}
            onChange={(e) =>
              setFormData({ ...formData, oldPassword: e.target.value })
            }
            placeholder="••••••••"
            className="w-full bg-muted/30 border border-border rounded-[1.25rem] px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-[#1C5B6F]/10 focus:border-[#1C5B6F] outline-none transition-all placeholder:text-muted-foreground/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-[#0F313D] dark:text-[#dfc3b4] ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-muted/30 border border-border rounded-[1.25rem] px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-[#1C5B6F]/10 focus:border-[#1C5B6F] outline-none transition-all placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-[#0F313D] dark:text-[#dfc3b4] ml-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-muted/30 border border-border rounded-[1.25rem] px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-[#1C5B6F]/10 focus:border-[#1C5B6F] outline-none transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C5B6F] text-white font-black py-5 rounded-[1.5rem] hover:bg-[#154655] active:scale-[0.97] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#1C5B6F]/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
