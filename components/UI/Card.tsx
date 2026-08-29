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
      className={`rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs ${className}`}
    >
      {children}
    </div>
  );
}