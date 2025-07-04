import { Skeleton } from '@/components/ui/skeleton';

export default function VendorDetailsSkeleton() {
  return (
    <div className="w-full p-6 bg-white rounded-lg animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8" />
      </div>
      {/* Entity info and sales card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      {/* Operators section */}
      <Skeleton className="h-6 w-56 mb-4" />
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-3 gap-4 p-4 border-b">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
