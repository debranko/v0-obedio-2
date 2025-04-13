import { Skeleton } from "@/components/ui/skeleton"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LogsLoading() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="system" disabled>
              System Logs
            </TabsTrigger>
            <TabsTrigger value="service" disabled>
              Service Request Logs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="system" className="mt-0">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                <Skeleton className="h-10 w-64" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>

              <div className="rounded-md border">
                <div className="h-10 px-4 border-b flex items-center">
                  <div className="flex w-full">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 flex-1 mx-2" />
                    ))}
                  </div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 px-4 flex items-center">
                      <div className="flex w-full">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <Skeleton key={j} className="h-4 flex-1 mx-2" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
