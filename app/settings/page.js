"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import {
  Loader2,
  Camera,
  Upload,
  Shield,
  User,
  Globe,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { GlassCard } from "../components/ui/GlassCard";

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
        if (!response.ok) throw new Error("Failed to load profile");
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
        refreshUser();
      } else throw new Error("Failed to save settings");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full bg-background border-2 border-border text-foreground px-5 py-4 rounded-2xl text-base font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm";
  const labelClasses =
    "block text-[11px] font-black uppercase tracking-widest text-foreground/70 mb-2 ml-1";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-8">
        <Loader2
          className="w-16 h-16 text-primary animate-spin"
          strokeWidth={1.5}
        />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Initializing Interface...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col gap-16">
        {/* Header */}
        <header className="flex flex-col gap-4 text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground uppercase">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
            Personalize your profile and manage how you appear within the FRL
            ecosystem.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar Navigation (Visual Only) */}
          <div className="lg:w-64 flex flex-col gap-2 w-full lg:sticky lg:top-32">
            {[
              { label: "Profile", icon: User, active: true },
              { label: "Security", icon: Shield, active: false },
              { label: "Network", icon: Globe, active: false },
              { label: "Impact", icon: Heart, active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`flex items-center gap-4 px-6 py-3 rounded-full text-sm font-semibold tracking-tight transition-all ${item.active ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted"}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-12 w-full">
            {/* Avatar Upload */}
            <GlassCard className="!p-8 md:!p-10 border-primary/5 shadow-xl hover:border-primary/20 transition-all flex flex-col sm:flex-row items-center gap-10">
              <div
                className="w-32 h-32 rounded-full overflow-hidden bg-muted shadow-2xl relative group cursor-pointer border-4 border-background shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image
                  src={
                    formData.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || "User")}`
                  }
                  alt="Profile"
                  fill
                  className="object-cover transition-all grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 text-white backdrop-blur-sm">
                  <Camera size={24} />
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-md">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <h3 className="text-2xl font-extrabold text-foreground uppercase tracking-tight">
                  Identity Image
                </h3>
                <p className="text-muted-foreground font-medium mb-6 max-w-xs leading-relaxed">
                  Customize your visual representation across the platform.
                </p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} className="mr-2" /> Change
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setFormData((prev) => ({
                          ...prev,
                          avatarUrl: reader.result,
                        }));
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Settings Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Legal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Contact Link (Phone)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Domain of Action</label>
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
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Core Mastery</label>
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

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Ethical Compass (#Tags)</label>
                <input
                  type="text"
                  name="values"
                  value={formData.values}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="#Regeneration #Justice #Harmony"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Professional Narrative</label>
                <textarea
                  name="professionalProfile"
                  value={formData.professionalProfile}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClasses} resize-none`}
                  placeholder="Elaborate on your life's work..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Geographical Focus</label>
                  <input
                    type="text"
                    name="geographicalSpread"
                    value={formData.geographicalSpread}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Regional impact zones..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>
                    Abundance (What you offer)
                  </label>
                  <input
                    type="text"
                    name="abundance"
                    value={formData.abundance}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Skills, time, resources..."
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  loading={saving}
                  size="lg"
                  className="px-12"
                >
                  Preserve Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
