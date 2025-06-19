import { Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  label: string
  status: "vorhanden" | "nicht vorhanden"
  date?: string
  className?: string
}

export function StatusIndicator({ label, status, date, className }: StatusIndicatorProps) {
  const isPresent = status === "vorhanden"

  return (
    <div className={cn("flex flex-col items-center p-4 bg-white rounded-lg border min-h-[180px]", className)}>
      <div className="text-sm font-medium mb-3">{label}</div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {isPresent ? (
          <>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-sm font-medium text-red-600">{status}</div>
          </>
        ) : (
          <>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm font-medium text-green-600">{status}</div>
          </>
        )}
      </div>
      {date && <div className="text-xs text-gray-500 mt-auto pt-3">Datum: {date}</div>}
    </div>
  )
}
