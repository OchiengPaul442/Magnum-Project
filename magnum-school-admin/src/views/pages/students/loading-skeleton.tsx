import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Section Skeleton */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
        </div>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">
              {Array(5)
                .fill(null)
                .map((_, j) => (
                  <Skeleton key={j} className="h-6" />
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}
