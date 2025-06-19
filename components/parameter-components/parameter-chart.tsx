"use client"

import { useTheme } from "@/components/theme-provider"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface DataPoint {
  date: string
  left: number | null
  right: number | null
  source?: string
  doctor?: string
}

interface NormalRange {
  lower: number
  upper: number
}

interface CustomColors {
  left?: {
    borderColor: string
    backgroundColor: string
  }
  right?: {
    borderColor: string
    backgroundColor: string
  }
  normalRange?: {
    left?: {
      borderColor: string
      backgroundColor: string
    }
    right?: {
      borderColor: string
      backgroundColor: string
    }
  }
}

interface ParameterChartProps {
  data: DataPoint[]
  selectedEyes: ("Links" | "Rechts")[]
  showNormalRange: boolean | { left?: boolean; right?: boolean }
  normalRange: NormalRange | { left?: NormalRange; right?: NormalRange }
  yAxis: {
    min: number
    max: number
    stepSize: number
  }
  unit: string
  className?: string
  // Chart options
  chartType?: "line" | "bar" | "radar"
  showDataPoints?: boolean
  showDataLabels?: boolean
  smoothLines?: boolean
  colorTheme?: "default" | "monochrome" | "pastel" | "dark"
  showGrid?: boolean
  showLegend?: boolean
  enableAnimation?: boolean
  customYAxisTickCallback?: (value: number) => string
  dataSource?: string
  doctor?: string
  onDataPointHover?: (date: string | null) => void
  customLegendLabels?: {
    Links?: string
    Rechts?: string
  }
  customColors?: CustomColors
}

export function ParameterChart({
  data,
  selectedEyes,
  showNormalRange,
  normalRange,
  yAxis,
  unit,
  className,
  chartType = "line",
  showDataPoints = true,
  showDataLabels = false,
  smoothLines = false,
  colorTheme = "default",
  showGrid = true,
  showLegend = true,
  enableAnimation = true,
  customYAxisTickCallback,
  dataSource = "FIDUS",
  doctor = "Dr. Erwin Müller",
  onDataPointHover,
  customLegendLabels,
  customColors,
}: ParameterChartProps) {
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Handle dark mode detection safely with useEffect
  useEffect(() => {
    setIsDarkMode(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
  }, [theme])

  // Define color themes
  const colorThemes = {
    default: {
      left: {
        borderColor: isDarkMode ? "rgb(248, 113, 113)" : "rgb(239, 68, 68)",
        backgroundColor: isDarkMode ? "rgba(248, 113, 113, 0.5)" : "rgba(239, 68, 68, 0.5)",
      },
      right: {
        borderColor: isDarkMode ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)",
        backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.5)",
      },
      normalRange: {
        left: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
        right: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
      },
    },
    monochrome: {
      left: {
        borderColor: isDarkMode ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
        backgroundColor: isDarkMode ? "rgba(229, 231, 235, 0.5)" : "rgba(55, 65, 81, 0.5)",
      },
      right: {
        borderColor: isDarkMode ? "rgb(209, 213, 219)" : "rgb(107, 114, 128)",
        backgroundColor: isDarkMode ? "rgba(209, 213, 219, 0.5)" : "rgba(107, 114, 128, 0.5)",
      },
      normalRange: {
        left: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
        right: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
      },
    },
    pastel: {
      left: {
        borderColor: isDarkMode ? "rgb(253, 186, 116)" : "rgb(251, 146, 60)",
        backgroundColor: isDarkMode ? "rgba(253, 186, 116, 0.5)" : "rgba(251, 146, 60, 0.5)",
      },
      right: {
        borderColor: isDarkMode ? "rgb(191, 219, 254)" : "rgb(147, 197, 253)",
        backgroundColor: isDarkMode ? "rgba(191, 219, 254, 0.5)" : "rgba(147, 197, 253, 0.5)",
      },
      normalRange: {
        left: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
        right: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
      },
    },
    dark: {
      left: {
        borderColor: isDarkMode ? "rgb(252, 165, 165)" : "rgb(220, 38, 38)",
        backgroundColor: isDarkMode ? "rgba(252, 165, 165, 0.5)" : "rgba(220, 38, 38, 0.5)",
      },
      right: {
        borderColor: isDarkMode ? "rgb(147, 197, 253)" : "rgb(37, 99, 235)",
        backgroundColor: isDarkMode ? "rgba(147, 197, 253, 0.5)" : "rgba(37, 99, 235, 0.5)",
      },
      normalRange: {
        left: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
        right: {
          borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for normal range
          backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
        },
      },
    },
  }

  // Merge custom colors with theme colors if provided
  const colors = {
    left: customColors?.left || colorThemes[colorTheme].left,
    right: customColors?.right || colorThemes[colorTheme].right,
    normalRange: {
      left: customColors?.normalRange?.left || colorThemes[colorTheme].normalRange.left,
      right: customColors?.normalRange?.right || colorThemes[colorTheme].normalRange.right,
    },
  }

  // Determine if we should show normal ranges for left and right
  const showLeftNormalRange = typeof showNormalRange === "boolean" ? showNormalRange : !!showNormalRange.left

  const showRightNormalRange = typeof showNormalRange === "boolean" ? showNormalRange : !!showNormalRange.right

  // Get normal ranges for left and right
  const leftNormalRange =
    typeof normalRange === "object" && "left" in normalRange ? normalRange.left : (normalRange as NormalRange)

  const rightNormalRange =
    typeof normalRange === "object" && "right" in normalRange ? normalRange.right : (normalRange as NormalRange)

  // Standard chart data for line and bar charts
  const standardChartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: customLegendLabels?.Links || "Links",
        data: data.map((item) => item.left),
        borderColor: colors.left.borderColor,
        backgroundColor: colors.left.backgroundColor,
        hidden: !selectedEyes.includes("Links"),
        pointRadius: showDataPoints ? 5 : 0, // Increased point size
        pointBackgroundColor: isDarkMode ? colors.left.borderColor : undefined,
        tension: smoothLines ? 0.4 : 0,
        borderWidth: isDarkMode ? 3 : 2, // Increase line width in dark mode
      },
      {
        label: customLegendLabels?.Rechts || "Rechts",
        data: data.map((item) => item.right),
        borderColor: colors.right.borderColor,
        backgroundColor: colors.right.backgroundColor,
        hidden: !selectedEyes.includes("Rechts"),
        pointRadius: showDataPoints ? 5 : 0, // Increased point size
        pointBackgroundColor: isDarkMode ? colors.right.borderColor : undefined,
        tension: smoothLines ? 0.4 : 0,
        borderWidth: isDarkMode ? 3 : 2, // Increase line width in dark mode
      },
      // Left normal range (systolic)
      ...(showLeftNormalRange && leftNormalRange
        ? [
            {
              label: `${customLegendLabels?.Links || "Links"} Normbereich (untere Grenze)`,
              data: Array(data.length).fill(leftNormalRange.lower),
              borderColor: colors.normalRange.left.borderColor,
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: isDarkMode ? 2 : 1, // Increase line width in dark mode
            },
            {
              label: `${customLegendLabels?.Links || "Links"} Normbereich (obere Grenze)`,
              data: Array(data.length).fill(leftNormalRange.upper),
              borderColor: colors.normalRange.left.borderColor,
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: isDarkMode ? 2 : 1, // Increase line width in dark mode
              fill: {
                target: "-1",
                above: colors.normalRange.left.backgroundColor,
              },
            },
          ]
        : []),
      // Right normal range (diastolic)
      ...(showRightNormalRange && rightNormalRange
        ? [
            {
              label: `${customLegendLabels?.Rechts || "Rechts"} Normbereich (untere Grenze)`,
              data: Array(data.length).fill(rightNormalRange.lower),
              borderColor: colors.normalRange.right.borderColor,
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: isDarkMode ? 2 : 1, // Increase line width in dark mode
            },
            {
              label: `${customLegendLabels?.Rechts || "Rechts"} Normbereich (obere Grenze)`,
              data: Array(data.length).fill(rightNormalRange.upper),
              borderColor: colors.normalRange.right.borderColor,
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: isDarkMode ? 2 : 1, // Increase line width in dark mode
              fill: {
                target: "-1",
                above: colors.normalRange.right.backgroundColor,
              },
            },
          ]
        : []),
    ],
  }

  // Standard options for line and bar charts
  const standardOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: enableAnimation ? 1000 : 0,
    },
    scales: {
      y: {
        min: yAxis.min,
        max: yAxis.max,
        ticks: {
          stepSize: yAxis.stepSize,
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
          font: {
            weight: isDarkMode ? ("bold" as const) : ("normal" as const),
          },
          callback: function (this: any, value: string | number) {
            return customYAxisTickCallback ? customYAxisTickCallback(Number(value)) : `${value}${unit}`
          },
        },
        grid: {
          display: showGrid,
          color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : undefined,
          lineWidth: isDarkMode ? 1.5 : 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Untersuchungszeitpunkte",
          font: {
            size: 14,
            weight: isDarkMode ? ("bold" as const) : ("normal" as const),
          },
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
          padding: {
            top: 10,
          },
        },
        ticks: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
          font: {
            weight: isDarkMode ? ("bold" as const) : ("normal" as const),
          },
        },
        grid: {
          display: showGrid,
          color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : undefined,
          lineWidth: isDarkMode ? 1.5 : 1,
        },
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
        labels: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
          font: {
            weight: isDarkMode ? ("bold" as const) : ("normal" as const),
          },
          boxWidth: isDarkMode ? 30 : 20,
          padding: isDarkMode ? 15 : 10,
          filter: (legendItem: any) => {
            // Only show main data series in the legend, not the normal range lines
            return !legendItem.text.includes("Normbereich")
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: isDarkMode ? "#000" : "#000",
        bodyColor: isDarkMode ? "#000" : "#000",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 4,
        titleFont: {
          size: 14,
          weight: "normal" as const,
        },
        bodyFont: {
          size: 14,
          weight: "normal" as const,
        },
        callbacks: {
          label: (context: any) => {
            const lines = []
            const label = context.dataset.label || ""

            // Skip normal range lines in tooltip
            if (label.includes("Normbereich")) return []

            const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) + unit : "N/A"

            // First line: measurement value
            lines.push(`${label}: ${value}`)

            // Date line
            const date = data[context.dataIndex]?.date || context.label
            if (onDataPointHover) {
              onDataPointHover(date)
            }
            lines.push(`Datum: ${date}`)

            // Source line
            lines.push(`Quelle: ${dataSource || "Unbekannt"}`)

            // Doctor line
            lines.push(`Erhoben durch: ${doctor || "Unbekannt"}`)

            return lines
          },
          // Remove the title since we're including it in the label
          title: () => "",
        },
      },
      datalabels: {
        display: showDataLabels,
        align: "top",
        formatter: (value: number) => value.toFixed(2) + unit,
        color: isDarkMode ? "rgba(255, 255, 255, 1)" : undefined, // Brighter text
        font: {
          weight: isDarkMode ? ("bold" as const) : ("normal" as const),
        },
      },
    },
    onHover: (_event: any, elements: any[]) => {
      if (elements.length === 0 && onDataPointHover) {
        onDataPointHover(null)
      }
    },
  }

  return (
    <div className={cn("h-[400px]", className)}>
      {chartType === "line" ? (
        <Line options={standardOptions} data={standardChartData} />
      ) : chartType === "bar" ? (
        <Bar options={standardOptions} data={standardChartData} />
      ) : (
        <div>Unbekannter Diagrammtyp</div>
      )}
    </div>
  )
}

export type { DataPoint, NormalRange, CustomColors }
