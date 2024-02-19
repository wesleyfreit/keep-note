import { ISignIn } from '@/validation/signin-schema';
import { ISignUp } from '@/validation/signup-schema';
import { InputHTMLAttributes } from 'react';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';

type FormTypes = ISignUp | ISignIn;

interface InputProps<T extends FormTypes> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
}

export const Input = <T extends FormTypes>({
  register,
  errors,
  name,
  label,
  placeholder,
  type,
}: InputProps<T>) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name}>
        <span className="font-medium leading-relaxed">{label}</span>
      </label>

      <input
        {...register(name)}
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        autoComplete={name === 'password' ? 'current-password' : 'on'}
        data-error={errors[name]?.message ? true : false}
        className="rounded-md bg-slate-800 p-2 outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-500 data-[error=true]:ring-2 data-[error=true]:ring-red-500"
      />

      <span className="text-sm font-medium text-red-500">
        {errors[name]?.message as string}
      </span>
    </div>
  );
};
