import type { ChangeEvent } from "react";

type InputProps = {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
};

export default function Input({
  label,
  id,
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
          className="text-xs sm:text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
      />
    </div>
  );
}