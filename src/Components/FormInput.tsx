import type { InputHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: FieldError;
}

function FormInput({ label, id, error, className = "", ...rest }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all
          placeholder:text-gray-400
          ${error
            ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 bg-white focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
          }
          ${className}`}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium">{error.message}</p>
      )}
    </div>
  );
}

export default FormInput;
