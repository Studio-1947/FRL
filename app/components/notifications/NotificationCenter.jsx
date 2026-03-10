"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Loader2, X } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await fetchApi("/v1/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetchApi(`/v1/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center h-10 w-10 border border-border/50 text-foreground"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <GlassCard className="border border-border/60 shadow-2xl overflow-hidden p-0 flex flex-col max-h-[500px]">
              <div className="p-4 border-b border-border/40 flex justify-between items-center bg-background/40">
                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {loading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Loading...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <Bell size={24} className="opacity-20" />
                    </div>
                    <p className="font-semibold text-sm">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-border/20 last:border-0 transition-colors hover:bg-foreground/5 relative group ${
                          !n.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-1 pr-8">
                          <h4
                            className={`text-sm font-bold ${!n.isRead ? "text-primary" : "text-foreground"}`}
                          >
                            {n.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold tracking-tighter">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="absolute top-4 right-4 p-1 rounded-md text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
