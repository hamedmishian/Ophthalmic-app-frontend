import { cn } from "@/lib/utils";

interface TrafficLightIndicatorProps {
  status: "red" | "yellow" | "green";
  className?: string;
}

export function TrafficLightIndicator({
  status,
  className
}: TrafficLightIndicatorProps) {
  return (
    <div className={cn("flex gap-1 p-2 bg-gray-600 rounded-md", className)}>
      <div
        className={cn(
          "w-6 h-6 rounded-full border border-white",
          status === "red"
            ? "bg-red-500 border-red-400 dark:bg-red-600 dark:border-red-500 shadow-sm"
            : "bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
        )}
      />
      <div
        className={cn(
          "w-6 h-6 rounded-full border border-white",
          status === "yellow"
            ? "bg-yellow-500 border-yellow-400 dark:bg-yellow-600 dark:border-yellow-500 shadow-sm"
            : "bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
        )}
      />
      <div
        className={cn(
          "w-6 h-6 rounded-full border border-white",
          status === "green"
            ? "bg-green-500 border-green-400 dark:bg-green-600 dark:border-green-500 shadow-sm"
            : "bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
        )}
      />
    </div>
  );
}
