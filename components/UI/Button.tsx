import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "amber" | "danger";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-[#4265D6] text-white hover:bg-[#3352bc] active:bg-[#2844a4] focus-visible:ring-[#4265D6] shadow-xs font-semibold",
    secondary: "bg-[#293855] text-white hover:bg-[#1b263b] active:bg-[#141d2e] focus-visible:ring-[#293855] shadow-xs font-semibold",
    outline: "border border-slate-300 bg-white text-[#293855] hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-[#4265D6] font-medium",
    amber: "bg-[#F2AC20] text-[#1b263b] hover:bg-[#d99516] active:bg-[#bf8010] focus-visible:ring-[#F2AC20] font-bold shadow-xs",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-600 font-semibold",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px] cursor-pointer ${variantStyles[variant]} ${className}`}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin shrink-0 text-current"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

