import { 
  Skeleton, 
  ProductGridSkeleton,
  HeroSkeleton 
} from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="bg-white">
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* New Arrivals Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-neutral-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-2" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-md mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-14 flex-1 max-w-sm" />
            <Skeleton className="h-14 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}
