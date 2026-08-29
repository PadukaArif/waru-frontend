import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800 focus-visible:ring-black active:scale-[0.99]",
    secondary: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200/80 focus-visible:ring-black active:scale-[0.99]",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:text-black focus-visible:ring-black active:scale-[0.99]",
    danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-600 active:scale-[0.99]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}