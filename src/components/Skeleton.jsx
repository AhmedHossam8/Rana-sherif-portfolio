export default function Skeleton() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 mb-12">
        <div className="h-8 w-48 bg-primary-800/10 dark:bg-secondary-50/10 rounded-full mx-auto animate-skeleton" />
        <div className="h-4 w-72 bg-primary-800/5 dark:bg-secondary-50/5 rounded-full mx-auto animate-skeleton" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-white dark:bg-primary-900/50 border border-primary-800/5 dark:border-secondary-50/5 card-shadow"
          >
            <div className="aspect-[4/3] bg-primary-800/10 dark:bg-primary-950/50 animate-skeleton" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-primary-800/10 dark:bg-secondary-50/10 rounded animate-skeleton" />
              <div className="h-3 w-1/4 bg-primary-800/5 dark:bg-secondary-50/5 rounded animate-skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
