import type { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label: string;
  loadingLabel?: string;
}

function SubmitButton({
  isLoading = false,
  label,
  loadingLabel,
  id,
  className = "",
  disabled,
  ...rest
}: SubmitButtonProps) {
  return (
    <button
      id={id}
      type="submit"
      disabled={isLoading || disabled}
      className={`mt-2 w-full rounded-md bg-[#1a6b5a] py-2.5 text-sm font-semibold text-white
        hover:bg-[#155a4a] active:scale-[0.98] transition-all
        disabled:opacity-60 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/50
        flex items-center justify-center gap-2
        ${className}`}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {isLoading ? (loadingLabel ?? `${label}…`) : label}
    </button>
  );
}

export default SubmitButton;
