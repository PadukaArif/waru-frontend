import type { ChangeEvent } from "react";

type InputProps = {
  label?: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
};

export default function Input({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  autoComplete,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-semibold text-[#293855]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#293855] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] focus-visible:border-transparent transition-colors disabled:bg-slate-100 disabled:text-slate-400 min-h-[44px] ${className}`}
      />
    </div>
  );
}
