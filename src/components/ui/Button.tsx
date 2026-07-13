import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    
    const variants = {
      primary: "bg-[#1a365d] text-white hover:bg-[#2b6cb0]",
      secondary: "bg-[#d69e2e] text-[#1a202c] hover:bg-[#ecc94b]",
      outline: "border-2 border-[#1a365d] text-[#1a365d] hover:bg-slate-50",
      ghost: "hover:bg-slate-100 text-slate-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg font-medium",
      icon: "h-10 w-10 justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
