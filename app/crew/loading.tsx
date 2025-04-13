import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CrewLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[150px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-[200px]" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[140px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <div className="mt-3">
                        <Skeleton className="h-4 w-[80px] mb-2" />
                        <div className="flex flex-wrap gap-1">
                          <Skeleton className="h-5 w-[60px]" />
                          <Skeleton className="h-5 w-[70px]" />
                        </div>
                      </div>
                      <div>
                        <Skeleton className="h-4 w-[100px] mb-2" />
                        <div className="flex flex-wrap gap-1">
                          <Skeleton className="h-5 w-[80px]" />
                          <Skeleton className="h-5 w-[90px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-3 bg-muted/30 flex justify-between items-center">
                    <div className="flex space-x-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
