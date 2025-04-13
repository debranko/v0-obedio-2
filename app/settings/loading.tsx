import { Skeleton } from "@/components/ui/skeleton"
import { PageLayout } from "@/components/ui-patterns/page-layout"
import { PageHeader } from "@/components/ui-patterns/page-header"
import { Settings } from "lucide-react"

export default function SettingsLoading() {
  return (
    <PageLayout>
      <PageHeader
        title="Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />

      <div className="space-y-6">
        <div className="h-10 w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </PageLayout>
  )
}
