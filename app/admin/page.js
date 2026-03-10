"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";
import { withRoleProtection } from "../components/auth/withRoleProtection";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  FileText,
  Bell,
  Film,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Loader2,
  ChevronRight,
  PlusCircle,
  Camera,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "notices",
    label: "Notices",
    icon: Bell,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "films",
    label: "Films",
    icon: Film,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "publications",
    label: "Publications",
    icon: BookOpen,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("events");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetchApi(`/v1/${activeTab}?limit=100`); // Admin view gets more items
      if (response.ok) {
        const result = await response.json();
        // Check if result is paginated { data, meta } or raw array
        if (result && result.data) {
          setItems(result.data);
        } else if (Array.isArray(result)) {
          setItems(result);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (err) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit");
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetchApi("/v1/upload", {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetchApi(`/v1/${activeTab}/${id}`, { method: "DELETE" });
      toast.success("Item deleted successfully");
      loadItems();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetchApi(`/v1/${activeTab}`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`${activeTab.slice(0, -1)} created!`);
        setShowForm(false);
        setFormData({});
        loadItems();
      } else {
        throw new Error("Creation failed");
      }
    } catch (err) {
      toast.error("Failed to create item. Check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = () => {
    const commonInputStyle =
      "w-full bg-background border border-border/40 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-[15px]";
    const commonLabelStyle =
      "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block";

    switch (activeTab) {
      case "events":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonLabelStyle}>Event Title</label>
                <input
                  required
                  className={commonInputStyle}
                  placeholder="E.g. Annual Design Summit"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={commonLabelStyle}>Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  className={commonInputStyle}
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Location</label>
              <input
                className={commonInputStyle}
                placeholder="E.g. Bangalore, KA"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Event Image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-20 bg-muted rounded-xl overflow-hidden border border-border/40 shrink-0">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera size={20} />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) =>
                        handleFileUpload(e.target.files[0]);
                      input.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload size={14} />{" "}
                    {formData.imageUrl ? "Change Image" : "Upload Image"}
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                    Max 2MB. Optimized for 16:9 aspect ratio.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Description</label>
              <textarea
                required
                rows={4}
                className={commonInputStyle}
                placeholder="Full event details..."
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "notices":
        return (
          <>
            <div>
              <label className={commonLabelStyle}>Notice Header</label>
              <input
                required
                className={commonInputStyle}
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={commonLabelStyle}>Priority</label>
                <select
                  className={commonInputStyle}
                  value={formData.priority || "normal"}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Content</label>
              <textarea
                required
                rows={4}
                className={commonInputStyle}
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          </>
        );
      case "blogs":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonLabelStyle}>Blog Title</label>
                <input
                  required
                  className={commonInputStyle}
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={commonLabelStyle}>Author Name</label>
                <input
                  className={commonInputStyle}
                  value={formData.authorName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Cover Image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-20 bg-muted rounded-xl overflow-hidden border border-border/40 shrink-0">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera size={20} />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) =>
                        handleFileUpload(e.target.files[0]);
                      input.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload size={14} />{" "}
                    {formData.imageUrl ? "Change Image" : "Upload Image"}
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                    Max 2MB. Optimized for 21:9 aspect ratio.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>
                Content (Markdown supported)
              </label>
              <textarea
                required
                rows={10}
                className={commonInputStyle}
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          </>
        );
      case "films":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonLabelStyle}>Film Title</label>
                <input
                  required
                  className={commonInputStyle}
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={commonLabelStyle}>
                  Embed URL (YouTube/Vimeo)
                </label>
                <input
                  required
                  className={commonInputStyle}
                  placeholder="https://www.youtube.com/embed/..."
                  value={formData.embedUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, embedUrl: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Description</label>
              <textarea
                required
                rows={4}
                className={commonInputStyle}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "publications":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={commonLabelStyle}>Publication Title</label>
                <input
                  required
                  className={commonInputStyle}
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={commonLabelStyle}>
                  Publication File (PDF)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      className={commonInputStyle}
                      placeholder="https://... or upload below"
                      value={formData.pdfUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, pdfUrl: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 shrink-0"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf";
                      input.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("PDF exceeds 5MB limit");
                          return;
                        }
                        setUploading(true);
                        try {
                          const uploadData = new FormData();
                          uploadData.append("file", file);
                          const res = await fetchApi("/v1/upload", {
                            method: "POST",
                            body: uploadData,
                          });
                          if (res.ok) {
                            const result = await res.json();
                            setFormData((prev) => ({
                              ...prev,
                              pdfUrl: result.url,
                            }));
                            toast.success("PDF uploaded!");
                          }
                        } catch (err) {
                          toast.error("Failed to upload PDF");
                        } finally {
                          setUploading(false);
                        }
                      };
                      input.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload size={14} />{" "}
                    {formData.pdfUrl ? "Replace PDF" : "Upload PDF"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Authors</label>
              <input
                className={commonInputStyle}
                placeholder="Separated by commas"
                value={formData.authors || ""}
                onChange={(e) =>
                  setFormData({ ...formData, authors: e.target.value })
                }
              />
            </div>
            <div className="mt-6">
              <label className={commonLabelStyle}>Summary</label>
              <textarea
                required
                rows={4}
                className={commonInputStyle}
                value={formData.summary || ""}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight uppercase">
              Content Admin
            </h1>
            <p className="text-muted-foreground font-light text-lg">
              Manage resources, publications, and updates for the platform.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 group"
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <PlusCircle className="group-hover:rotate-90 transition-transform" />{" "}
                Add New {activeTab.slice(0, -1)}
              </>
            )}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-card/40 rounded-2xl border border-border/40 self-start">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowForm(false);
                }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all text-sm font-medium
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-white/[0.05] text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Overlay/Section */}
        {showForm && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-500">
            <GlassCard className="border-primary/20 bg-primary/[0.02]">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Plus size={24} />
                <h3 className="text-2xl font-bold uppercase tracking-wide">
                  Create New {activeTab.slice(0, -1)}
                </h3>
              </div>
              <form onSubmit={handleFormSubmit}>
                {renderForm()}
                <div className="mt-8 flex justify-end gap-4 border-t border-border/40 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Discard
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Publish Entry"
                    )}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        )}

        {/* Items List */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider flex items-center gap-3">
            <ChevronRight className="text-primary" /> Existing {activeTab}
          </h2>

          {loading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center p-20 gap-4 text-muted-foreground border-dashed">
              {React.createElement(
                TABS.find((t) => t.id === activeTab)?.icon || Loader2,
                {
                  className: "w-12 h-12 opacity-20",
                },
              )}
              <p>No {activeTab} found. Start by creating one!</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => (
                <GlassCard
                  key={item.id}
                  className="group hover:border-primary/30 transition-all !py-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-4 rounded-xl ${TABS.find((t) => t.id === activeTab).bg}`}
                      >
                        {React.createElement(
                          TABS.find((t) => t.id === activeTab).icon,
                          {
                            className: TABS.find((t) => t.id === activeTab)
                              .color,
                          },
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                          {activeTab === "notices"
                            ? item.content
                            : activeTab === "publications"
                              ? item.summary
                              : item.description || item.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(AdminPanel, ["Admin", "SuperAdmin"]);
