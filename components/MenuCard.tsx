import Link from "next/link";

type MenuCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
};

export default function MenuCard({
  id,
  name,
  description,
  price,
  available,
}: MenuCardProps) {
  return (
    <Link
      href={`/menu/${id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{name}</h2>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            available
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {available ? "Tersedia" : "Tidak tersedia"}
        </span>
      </div>

      <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>

      <p className="mt-4 font-semibold text-gray-900">
        Rp {price.toLocaleString("id-ID")}
      </p>
    </Link>
  );
}