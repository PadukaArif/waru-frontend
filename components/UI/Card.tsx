type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs text-[#293855] ${className}`}
    >
      {children}
    </div>
  );
}