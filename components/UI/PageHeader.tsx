import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
  className?: string;
};

export default function PageHeader({
  title,
  description,
  badge,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 sm:pb-6 ${className}`}
    >
      <div className="space-y-1">
        {badge && (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#4265D6] border border-blue-100 mb-1">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#293855]">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}
