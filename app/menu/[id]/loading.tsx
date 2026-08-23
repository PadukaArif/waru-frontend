export default function MenuDetailLoading() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="overflow-hidden rounded-xl border">
          <div className="aspect-video animate-pulse bg-gray-200" />

          <div className="space-y-4 p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </section>
    </main>
  );
}