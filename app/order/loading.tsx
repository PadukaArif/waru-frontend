export default function OrdersLoading() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-8">
          <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="space-y-3 sm:text-right">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}