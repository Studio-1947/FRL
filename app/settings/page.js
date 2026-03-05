"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { Loader2, Camera, Upload } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

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
    avatarUrl: "",
  });
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchApi("/v1/users/profile");
        if (!response.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await response.json();
        const safeData = {};
        for (const key in formData) {
          safeData[key] = data[key] !== null ? data[key] : "";
        }
        setFormData(safeData);
      } catch (err) {
        toast.error("Failed to load settings.");
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

    try {
      const response = await fetchApi("/v1/users/profile", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
        refreshUser(); // Refresh global user state for Header
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-[#1C5B6F]/20 rounded-full"></div>
          <Loader2
            className="w-16 h-16 text-[#1C5B6F] animate-spin"
            strokeWidth={1.5}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading settings...
        </p>
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

        <div className="mb-10 flex flex-col items-center sm:flex-row sm:gap-8 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
          <div
            className="w-32 h-32 rounded-full overflow-hidden bg-muted shadow-md relative group cursor-pointer border-4 border-background"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={
                formData.avatarUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || "User")}`
              }
              alt="Profile"
              fill
              className="object-cover transition-opacity group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">
              <Camera size={24} />
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              Profile Picture
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the image to upload a new photo. Max 2MB.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full px-6"
            >
              <Upload size={16} className="mr-2" />
              Change Photo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                  toast.error(
                    "Image too large. Please select a file smaller than 2MB.",
                  );
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData((prev) => ({
                    ...prev,
                    avatarUrl: reader.result,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

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
            <Button
              type="submit"
              loading={saving}
              className="px-8 bg-[#1C5B6F] hover:bg-[#154655] dark:bg-[#EEFCFD] text-white dark:text-[#0F313D] rounded-xl font-bold shadow-md transition-all h-12"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
