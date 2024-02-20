interface SpinnerProps {
  size: string;
}

export const Spinner = ({ size }: SpinnerProps) => {
  return (
    <div
      className={`${size} mx-2 mr-3 animate-spin rounded-full border-[3.5px] border-solid border-slate-400 border-l-blue-500`}
    />
  );
};
