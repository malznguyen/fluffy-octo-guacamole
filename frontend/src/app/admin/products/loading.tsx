export default function Loading() {
  return (
    <div className="p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-10 bg-slate-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
        </div>
        <div className="h-10 bg-slate-200 rounded w-32 animate-pulse" />
      </div>

      {/* Filter Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse" />
          <div className="w-full lg:w-48 h-10 bg-slate-200 rounded animate-pulse" />
          <div className="w-full lg:w-40 h-10 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse" />
              <div className="flex-1 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-24 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-20 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-20 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-10 h-5 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
