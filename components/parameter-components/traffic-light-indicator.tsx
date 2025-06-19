import { cn } from "@/lib/utils";

interface TrafficLightIndicatorProps {
  status: "red" | "yellow" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

export function TrafficLightIndicator({
  status,
  size = "md",
  className,
  pulse = true
}: TrafficLightIndicatorProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const statusClasses = {
    red: {
      base: "bg-red-500",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
      pulse: "animate-pulse-red",
      border: "border-red-400"
    },
    yellow: {
      base: "bg-yellow-500",
      glow: "shadow-[0_0_12px_rgba(234,179,8,0.6)]",
      pulse: "animate-pulse-yellow",
      border: "border-yellow-400"
    },
    green: {
      base: "bg-green-500",
      glow: "shadow-[0_0_12px_rgba(34,197,94,0.6)]",
      pulse: "animate-pulse-green",
      border: "border-green-400"
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {/* Background glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-40 blur-md transition-all duration-300 ease-in-out",
          statusClasses[status].glow,
          pulse && statusClasses[status].pulse
        )}
      />

      {/* Glass effect container */}
      <div
        className={cn(
          "relative rounded-full transition-all duration-300 ease-in-out",
          "border-2 backdrop-blur-sm",
          "bg-white/10",
          statusClasses[status].border,
          sizeClasses[size]
        )}
      >
        {/* Main indicator */}
        <div
          className={cn(
            "absolute inset-0.5 rounded-full transition-all duration-300 ease-in-out",
            statusClasses[status].base,
            statusClasses[status].glow,
            pulse && statusClasses[status].pulse
          )}
        />

        {/* Inner highlight */}
        <div
          className={cn(
            "absolute inset-[2px] rounded-full transition-all duration-300 ease-in-out",
            "bg-gradient-to-br from-white/40 via-white/20 to-transparent",
            sizeClasses[size]
          )}
        />

        {/* Shine effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-300 ease-in-out",
            "bg-gradient-to-br from-white/30 via-transparent to-transparent",
            "opacity-50",
            sizeClasses[size]
          )}
        />
      </div>
    </div>
  );
}
