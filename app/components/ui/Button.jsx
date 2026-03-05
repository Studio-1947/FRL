import React from "react";
import { cn } from "@/lib/utils"; // Assuming a standard shadcn/tailwind setup

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      loading = false,
      children,
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
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
