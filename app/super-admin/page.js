"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { withRoleProtection } from "../components/auth/withRoleProtection";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import {
  ShieldAlert,
  User,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function SuperAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchApi("/v1/users");
      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result)) {
          setUsers(result);
        } else if (result && result.data) {
          setUsers(result.data);
        } else {
          setUsers([]);
        }
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const resp = await fetchApi(`/v1/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      if (resp && resp.id) {
        toast.success(`User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      toast.error("An error occurred while updating the role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 lg:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldAlert className="w-8 h-8" />
              <span className="text-xl font-bold uppercase tracking-widest">
                System Control
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight uppercase">
              Super Admin Panel
            </h1>
            <p className="text-muted-foreground font-light text-lg max-w-xl">
              Manage critical system access and assign administrative privileges
              across the platform.
            </p>
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-primary/20 hover:border-primary/50 text-primary"
            >
              Content Admin Panel <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* User Management Section */}
        <GlassCard className="!p-0 overflow-hidden border border-border/40">
          <div className="p-6 bg-card/40 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Registered Users
            </h2>
            <div className="text-sm font-light text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
              {users.length} Total
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-card/20 text-muted-foreground text-xs uppercase tracking-widest border-b border-border/40">
                    <th className="p-4 font-semibold">User ID</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Current Role</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 text-sm font-mono text-muted-foreground break-all">
                        #{u.id}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {u.name || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {u.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border 
                            ${
                              u.role === "SuperAdmin"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : u.role === "Admin"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-card text-muted-foreground border-border/40"
                            }`}
                        >
                          {u.role === "SuperAdmin" && (
                            <ShieldAlert className="w-3 h-3" />
                          )}
                          {u.role === "Admin" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {u.role || "User"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            className="bg-background border border-border/40 text-sm rounded-md px-3 py-2 outline-none focus:border-primary/50 text-foreground min-w-[130px]"
                            value={u.role || "User"}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value)
                            }
                            disabled={updatingId === u.id}
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">SuperAdmin</option>
                          </select>
                          {updatingId === u.id && (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-muted-foreground"
                      >
                        No users found in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Protect this route - MUST be SuperAdmin
export default withRoleProtection(SuperAdminPage, ["SuperAdmin"]);
