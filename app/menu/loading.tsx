export default function MenuLoading() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-8">
          <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border"
            >
              <div className="aspect-video animate-pulse bg-gray-200" />

              <div className="space-y-3 p-5">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}