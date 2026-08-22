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
      className="block rounded-xl border p-5 transition hover:shadow-md"
    >
      <h2 className="text-xl font-semibold">{name}</h2>

      <p className="mt-2 text-gray-600">{description}</p>

      <p className="mt-4 font-bold">
        Rp {price.toLocaleString("id-ID")}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          available ? "text-green-600" : "text-red-600"
        }`}
      >
        {available ? "Tersedia" : "Tidak tersedia"}
      </p>
    </Link>
  );
}