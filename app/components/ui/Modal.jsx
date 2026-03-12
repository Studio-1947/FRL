"use client";

import React, { useEffect } from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info", // info, warning, error, confirm, success
  showCancel = true,
  children,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    info: <Info className="text-blue-500 w-8 h-8" />,
    warning: <AlertTriangle className="text-orange-500 w-8 h-8" />,
    error: <AlertCircle className="text-red-500 w-8 h-8" />,
    confirm: <AlertCircle className="text-primary w-8 h-8" />,
    success: <CheckCircle2 className="text-emerald-500 w-8 h-8" />,
  };

  const typeStyles = {
    info: "border-blue-500/20",
    warning: "border-orange-500/20",
    error: "border-red-500/20",
    confirm: "border-primary/20",
    success: "border-emerald-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-md bg-card border-2 shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
          typeStyles[type] || "border-border/40",
        )}
      >
        {/* Header Decore */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="p-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="p-4 bg-muted rounded-2xl">
              {icons[type] || icons.info}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                {title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {children && <div className="mt-6">{children}</div>}

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            {showCancel && (
              <Button
                variant="outline"
                className="flex-1 order-2 sm:order-1"
                onClick={onClose}
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant="primary"
              className={cn(
                "flex-1 order-1 sm:order-2",
                (type === "error" || type === "warning") &&
                  "bg-red-500 hover:bg-red-600 text-white",
              )}
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
