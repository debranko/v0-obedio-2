import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { themeConfig } from "@/lib/theme-config"

interface FormFieldProps {
  label: string
  htmlFor?: string
  description?: string
  tooltip?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, description, tooltip, children, className }: FormFieldProps) {
  return (
    <div className={`${themeConfig.spacing.item} ${className}`}>
      <div className="flex items-center gap-1">
        {htmlFor ? (
          <Label htmlFor={htmlFor} className={themeConfig.typography.small}>
            {label}
          </Label>
        ) : (
          <div className={`${themeConfig.typography.small} font-medium`}>{label}</div>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && <p className={`${themeConfig.typography.tiny} text-muted-foreground`}>{description}</p>}
      <div className="mt-1">{children}</div>
    </div>
  )
}
