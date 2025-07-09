import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div>
      <h1 className="sr-only">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Col 1 */}
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-6 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-2 h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="flex-1">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="pl-2">
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Col 2 */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <Card className="flex-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
