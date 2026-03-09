import React from "react";
import { cn } from "@/lib/utils";

const GlassCard = React.forwardRef(
  ({ className, children, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-3xl p-6 transition-all duration-500",
          hover && "glass-hover",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
