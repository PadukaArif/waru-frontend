"use client";

import { useState, type ChangeEvent } from "react";

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
  min?: number | string;
  max?: number | string;
  step?: number | string;
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
  min,
  max,
  step,
  className = "",
  autoComplete,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === "password";
  const actualType = isPasswordInput ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-semibold text-navy"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary focus-visible:border-transparent transition-colors min-h-11 ${
            disabled ? "bg-slate-100 text-slate-400" : "bg-white text-navy placeholder:text-slate-400"
          } ${isPasswordInput ? "pr-16" : ""} ${className}`}
        />

        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-blue-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary rounded px-1.5 py-1 cursor-pointer transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? "Sembunyi" : "Lihat"}
          </button>
        )}
      </div>
    </div>
  );
}


