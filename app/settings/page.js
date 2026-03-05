"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    expertise: "",
    role: "Individual",
    values: "",
    professionalProfile: "",
    geographicalSpread: "",
    interventions: "",
    problem: "",
    systemChange: "",
    systemImpact: "",
    abundance: "",
    helpNeeded: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchApi("/v1/users/profile");
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load profile");
        }
        const data = await response.json();
        const safeData = {};
        for (const key in formData) {
          safeData[key] = data[key] !== null ? data[key] : "";
        }
        setFormData(safeData);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetchApi("/v1/users/profile", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full bg-[#F9FAFB] dark:bg-[#0F313D] border border-gray-200 dark:border-white/10 text-foreground dark:text-white px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1C5B6F] focus:border-transparent";
  const labelClasses =
    "block text-sm font-semibold text-foreground dark:text-white mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-[#8b654b] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#0F313D] dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground mb-10">
          Update your account information and public profile details.
        </p>

        {message && (
          <div
            className={`p-4 mb-8 rounded-xl font-medium ${message.type === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card text-card-foreground p-8 rounded-[2rem] border border-border shadow-sm flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Role Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`${inputClasses} appearance-none`}
              >
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Donor">Donor</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Core Expertise Area</label>
              <select
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className={`${inputClasses} appearance-none`}
              >
                <option value="">Select...</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Values (Hashtags, e.g. #Equity #Love)
            </label>
            <input
              type="text"
              name="values"
              value={formData.values}
              onChange={handleChange}
              className={inputClasses}
              placeholder="#Compassion #Integrity"
            />
          </div>

          <div>
            <label className={labelClasses}>Professional Profile</label>
            <textarea
              name="professionalProfile"
              value={formData.professionalProfile}
              onChange={handleChange}
              rows={4}
              className={`${inputClasses} resize-none`}
              placeholder="Describe your professional background..."
            ></textarea>
          </div>

          <div>
            <label className={labelClasses}>Geographical Spread</label>
            <input
              type="text"
              name="geographicalSpread"
              value={formData.geographicalSpread}
              onChange={handleChange}
              className={inputClasses}
              placeholder="e.g. New Delhi, Noida"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Interventions</label>
              <textarea
                name="interventions"
                value={formData.interventions}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>
            <div>
              <label className={labelClasses}>Problem Scope</label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>
            <div>
              <label className={labelClasses}>System Change</label>
              <textarea
                name="systemChange"
                value={formData.systemChange}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>
            <div>
              <label className={labelClasses}>What I Have in Abundance</label>
              <textarea
                name="abundance"
                value={formData.abundance}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Help Needed</label>
            <textarea
              name="helpNeeded"
              value={formData.helpNeeded}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses} resize-none`}
            ></textarea>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1C5B6F] hover:bg-[#154655] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
