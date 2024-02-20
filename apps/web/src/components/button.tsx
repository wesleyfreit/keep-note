'use client';
import { Spinner } from './spinner';

interface ButtonProps {
  title: string;
  isLoading: boolean;
}

export const Button = ({ title, isLoading }: ButtonProps) => {
  return (
    <button
      data-disabled={isLoading}
      className="flex justify-center rounded-full bg-blue-800 py-3 text-sm font-medium text-slate-300 outline-none transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 data-[disabled=true]:pointer-events-none"
      type="submit"
    >
      {isLoading ? <Spinner size="size-5" /> : title}
    </button>
  );
};
