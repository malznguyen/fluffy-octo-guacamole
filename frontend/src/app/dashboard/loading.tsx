import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header Placeholder */}
      <div className="h-20 bg-white border-b border-neutral-200" />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Skeleton className="h-5 w-40 mb-6" />

          {/* Dashboard Header */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-9 lg:pl-8">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8">
                {/* Profile Form Skeleton */}
                <div className="space-y-6">
                  <div className="relative">
                    <Skeleton className="h-14 w-full" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-14 w-full" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-14 w-full" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Skeleton className="h-14 flex-1" />
                    <Skeleton className="h-14 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <div className="h-64 bg-neutral-900" />
    </div>
  )
}
