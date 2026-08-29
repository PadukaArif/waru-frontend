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
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === "password";
  const actualType = isPasswordInput ? (showPassword ? "text" : "password") : type;

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
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#293855] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] focus-visible:border-transparent transition-colors disabled:bg-slate-100 disabled:text-slate-400 min-h-[44px] ${
            isPasswordInput ? "pr-16" : ""
          } ${className}`}
        />

        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#4265D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1.5 py-1 cursor-pointer transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? "Sembunyi" : "Lihat"}
          </button>
        )}
      </div>
    </div>
  );
}

