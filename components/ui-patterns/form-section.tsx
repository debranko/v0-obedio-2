import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { themeConfig } from "@/lib/theme-config"

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={`${themeConfig.spacing.container} ${className}`}>
      <div>
        <h3 className={themeConfig.typography.subtitle}>{title}</h3>
        {description && <p className={`${themeConfig.typography.small} text-muted-foreground mt-1`}>{description}</p>}
      </div>
      <div className={themeConfig.spacing.container}>{children}</div>
      <Separator className="mt-2" />
    </div>
  )
}
