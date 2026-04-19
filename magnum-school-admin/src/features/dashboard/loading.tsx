import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col w-full h-full gap-6 animate-pulse">
      {/* Analytics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Activity Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[375px] bg-gray-200 rounded" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 rounded-lg bg-gray-100"
                >
                  <div className="h-3 w-3 rounded-full bg-gray-200 mr-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Skeleton */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
