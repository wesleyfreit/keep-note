import type { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  htmlFor: string;
  label: string;
  error?: string;
}

export const Input = ({ htmlFor, label, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={htmlFor}>
        <span className="font-medium leading-relaxed">{label}</span>
      </label>

      <input
        className="rounded-md bg-slate-800 p-2 outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-500 data-[error=true]:ring-2 data-[error=true]:ring-red-500"
        {...props}
      />

      <span className="text-sm font-medium text-red-500">{error}</span>
    </div>
  );
};
