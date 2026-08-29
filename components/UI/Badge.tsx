import type { ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "amber";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    success: "bg-emerald-50 text-green-dark border-emerald-200 font-bold",
    warning: "bg-amber-50 text-amber-hover border-amber-200 font-bold",
    danger: "bg-red-50 text-red-700 border-red-200 font-bold",
    info: "bg-blue-50 text-blue-primary border-blue-100 font-bold",
    neutral: "bg-slate-100 text-navy border-slate-200 font-semibold",
    amber: "bg-amber-500 text-slate-900 border-amber-200 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
