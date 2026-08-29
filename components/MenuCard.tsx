import Link from "next/link";

type MenuCardProps = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  isRecommended?: boolean;
  category?: string;
};

export default function MenuCard({
  id,
  name,
  description,
  price,
  available,
  isRecommended = false,
  category,
}: MenuCardProps) {
  return (
    <Link
      href={`/menu/${id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mb-1">
              {category}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-bold text-[#293855] group-hover:text-[#4265D6] transition-colors">
            {name}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {isRecommended && (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-[#d99516]">
              Recommended
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
              available
                ? "bg-emerald-50 text-[#204d28] border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {available ? "Tersedia" : "Habis"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
        <p className="font-extrabold text-[#293855] text-sm sm:text-base">
          Rp {price.toLocaleString("id-ID")}
        </p>

        <span className="text-xs font-semibold text-[#4265D6] group-hover:underline">
          Detail →
        </span>
      </div>
    </Link>
  );
}