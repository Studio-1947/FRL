import React from "react";
import { cn } from "@/lib/utils"; // Assuming a standard shadcn/tailwind setup

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // Determine base classes
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2rem] text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm cursor-pointer";

    // Determine variant classes
    const variants = {
      primary:
        "bg-primary text-primary-foreground dark:bg-[#EEFCFD] dark:text-[#0F313D] shadow-xl hover:bg-primary/90 dark:hover:bg-[#EEFCFD]/90",
      secondary:
        "bg-[#F6F5F0] text-[#2D201B] dark:bg-[#19667A] dark:text-[#EEFCFD] shadow-sm hover:bg-[#F6F5F0]/90 dark:hover:bg-[#19667A]/90",
      outline:
        "border border-primary/20 dark:border-white/20 bg-transparent text-primary dark:text-[#EEFCFD] hover:bg-primary hover:text-primary-foreground dark:hover:bg-[#EEFCFD] dark:hover:text-[#0F313D]",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    // Determine size classes
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "px-6 py-[0.9375rem] text-lg lg:text-xl",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? React.Fragment : "button";

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
