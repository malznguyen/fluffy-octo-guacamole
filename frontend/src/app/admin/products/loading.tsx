import { 
  Skeleton, 
  PageHeaderSkeleton, 
  TableSkeleton 
} from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-8">
      {/* Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Filter Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-full lg:w-48 h-10" />
          <Skeleton className="w-full lg:w-40 h-10" />
        </div>
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={9} />
    </div>
  )
}
