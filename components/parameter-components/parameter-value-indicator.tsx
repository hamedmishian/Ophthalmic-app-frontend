import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrafficLightIndicator } from "@/components/ui/traffic-light-indicator";

interface ParameterValueIndicatorProps {
  label: string;
  value: number;
  change: number;
  unit: string;
  status: "red" | "yellow" | "green";
  className?: string;
  customValueDisplay?: (value: number) => string;
}

export function ParameterValueIndicator({
  label,
  value,
  change,
  unit,
  status,
  className,
  customValueDisplay
}: ParameterValueIndicatorProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-600 p-4 shadow-sm dark:shadow-md",
        className
      )}
    >
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex justify-center mb-2">
        <TrafficLightIndicator status={status} />
      </div>
      <div className="text-center">
        <div
          className={cn(
            "inline-block px-2 py-1 rounded text-lg font-medium shadow-sm dark:shadow-md",
            status === "red"
              ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              : status === "yellow"
              ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
              : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
          )}
        >
          {customValueDisplay ? customValueDisplay(value) : value.toFixed(2)}
          {unit}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 mt-2">
        {change > 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500 dark:text-green-400" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500 dark:text-red-400" />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {Math.abs(change).toFixed(2)}
          {unit}
        </span>
      </div>
    </div>
  );
}
