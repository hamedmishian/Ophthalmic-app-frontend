"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartOptions } from "./chart-options"
import { printContent } from "./print-utils"
import { ParameterChart } from "./parameter-chart"
import { ParameterValueIndicator } from "./parameter-value-indicator"
import { getFHIRChartData } from "@/data/fhir-patient-data"

interface HbA1cChartProps {
  data: Array<{
    date: string
    value: number
    source: string
    doctor: string
  }>
  showNormalRange: boolean
  normalRange: { lower: number; upper: number }
  chartType: "line" | "bar" | "radar"
  showDataPoints: boolean
  showDataLabels: boolean
  smoothLines: boolean
  colorTheme: "default" | "monochrome" | "pastel" | "dark"
  showGrid: boolean
  enableAnimation: boolean
  onDataPointHover: (date: string | null) => void
}

export function HbA1cComponent() {
  const [showNormalRange, setShowNormalRange] = useState(true)
  const [lastExamDate, setLastExamDate] = useState("")
  const [timeRange, setTimeRange] = useState("2")
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null)

  // Chart options
  const [chartType, setChartType] = useState<"line" | "bar" | "radar">("line")
  const [showDataPoints, setShowDataPoints] = useState(true)
  const [showDataLabels, setShowDataLabels] = useState(false)
  const [smoothLines, setSmoothLines] = useState(false)
  const [colorTheme, setColorTheme] = useState<"default" | "monochrome" | "pastel" | "dark">("default")
  const [showGrid, setShowGrid] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [enableAnimation, setEnableAnimation] = useState(true)

  // Get FHIR HbA1c data
  const hba1cData = getFHIRChartData.getHbA1cData()
  const referenceRanges = getFHIRChartData.getReferenceRanges()

  // Get available dates from FHIR data
  const availableDates = useMemo(() => {
    return hba1cData.map((item) => item.date).sort()
  }, [hba1cData])

  // Set initial last exam date
  useMemo(() => {
    if (availableDates.length > 0 && !lastExamDate) {
      setLastExamDate(availableDates[availableDates.length - 1])
    }
  }, [availableDates, lastExamDate])

  // Filter data based on selected time range and last exam date
  const visibleData = useMemo(() => {
    const selectedDateIndex = availableDates.findIndex((date) => date === lastExamDate)
    if (selectedDateIndex === -1) return hba1cData

    const dataUpToSelectedDate = hba1cData.slice(0, selectedDateIndex + 1)
    const yearsToShow = Number.parseFloat(timeRange)
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2

    return dataUpToSelectedDate.slice(-numEntriesToShow)
  }, [lastExamDate, timeRange, hba1cData, availableDates])

  // Get latest value and calculate change
  const getLatestValue = () => {
    if (visibleData.length === 0) return { value: 0, change: 0, status: "yellow" as const }

    const latest = visibleData[visibleData.length - 1]
    const previous = visibleData.length > 1 ? visibleData[visibleData.length - 2] : latest

    const normalRange = referenceRanges.hba1c || { lower: 6.0, upper: 8.0 }

    return {
      value: latest.value,
      change: latest.value - previous.value,
      status:
        latest.value > 7.0
          ? ("red" as const)
          : latest.value > 6.5
            ? ("yellow" as const)
            : latest.value > normalRange.upper
              ? ("yellow" as const)
              : ("green" as const),
    }
  }

  const latestValue = getLatestValue()

  // Find critical values (HbA1c > 6.5%)
  const criticalValues = visibleData.filter((item) => item.value > 6.5)

  const handlePrint = () => {
    printContent("hba1c-content", "HbA1c-Werte")
  }

  // Format HbA1c value with German number formatting
  const formatHbA1c = (value: number) => {
    return (
      value.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + " %"
    )
  }

  const normalRange = referenceRanges.hba1c || { lower: 6.0, upper: 8.0 }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base font-medium">Hämoglobin-A1c-Werte</CardTitle>
          <div className="flex items-center gap-2">
            <ChartOptions
              chartType={chartType}
              setChartType={setChartType}
              showDataPoints={showDataPoints}
              setShowDataPoints={setShowDataPoints}
              showDataLabels={showDataLabels}
              setShowDataLabels={setShowDataLabels}
              smoothLines={smoothLines}
              setSmoothLines={setSmoothLines}
              colorTheme={colorTheme}
              setColorTheme={setColorTheme}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showLegend={showLegend}
              setShowLegend={setShowLegend}
              enableAnimation={enableAnimation}
              setEnableAnimation={setEnableAnimation}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-1 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Drucken</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
              <Label className="whitespace-nowrap">Letzter Untersuchungszeitpunkt:</Label>
              <Select value={lastExamDate} onValueChange={setLastExamDate}>
                <SelectTrigger className="w-full xs:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
              <Label className="whitespace-nowrap">Angezeigter Zeitraum:</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full xs:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Jahre</SelectItem>
                  <SelectItem value="1">1 Jahr</SelectItem>
                  <SelectItem value="0.5">6 Monate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="normalRange" checked={showNormalRange} onCheckedChange={setShowNormalRange} />
            <Label htmlFor="normalRange">Anzeige Normbereich</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent id="hba1c-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            {/* Chart */}
            <div className="h-[400px]">
              <HbA1cChart
                data={visibleData}
                showNormalRange={showNormalRange}
                normalRange={normalRange}
                chartType={chartType}
                showDataPoints={showDataPoints}
                showDataLabels={showDataLabels}
                smoothLines={smoothLines}
                colorTheme={colorTheme}
                showGrid={showGrid}
                enableAnimation={enableAnimation}
                onDataPointHover={setHighlightedDate}
              />
            </div>

            {/* Data table */}
            <div className="mt-4 border dark:border-gray-700 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="p-2 text-left">Datum</th>
                    {visibleData.map((item) => (
                      <th key={item.date} className="p-2 text-center">
                        {item.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-medium">HbA1c</td>
                    {visibleData.map((item, i) => (
                      <td key={i} className="p-2 text-center">
                        {formatHbA1c(item.value)}
                        {item.value > 6.5 && <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            {/* Critical values alert */}
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Kritische Werte:</AlertTitle>
              <AlertDescription className="text-sm">
                {criticalValues.length > 0
                  ? criticalValues.map((value, index) => (
                      <div key={index}>
                        {value.date}: {formatHbA1c(value.value)}
                      </div>
                    ))
                  : "keine"}
              </AlertDescription>
            </Alert>

            {/* Current value indicator */}
            <ParameterValueIndicator
              label="HbA1c"
              value={latestValue.value}
              change={latestValue.change}
              unit=" %"
              status={latestValue.status}
            />

            {/* Data quality warning */}
            {visibleData.length > 0 && (
              <div className="mt-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Wertaktualität eingeschränkt
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Erhebungsdatum liegt mehr als 1 Jahr zurück
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// HbA1c Chart Component
function HbA1cChart({
  data,
  showNormalRange,
  normalRange,
  chartType,
  showDataPoints,
  showDataLabels,
  smoothLines,
  colorTheme,
  showGrid,
  enableAnimation,
  onDataPointHover,
}: HbA1cChartProps) {
  // Convert the data format to match what ParameterChart expects
  const chartData = data.map((item) => ({
    date: item.date,
    left: item.value, // Use left for the single HbA1c value
    right: null, // No right value for HbA1c
    source: item.source,
    doctor: item.doctor,
  }))

  return (
    <ParameterChart
      data={chartData}
      selectedEyes={["Links"]} // Only show one line for HbA1c
      showNormalRange={showNormalRange}
      normalRange={normalRange}
      yAxis={{
        min: 4,
        max: 14,
        stepSize: 2,
      }}
      unit=" %"
      chartType={chartType}
      showDataPoints={showDataPoints}
      showDataLabels={showDataLabels}
      smoothLines={smoothLines}
      colorTheme={colorTheme}
      showGrid={showGrid}
      showLegend={false}
      enableAnimation={enableAnimation}
      dataSource={data[0]?.source || "Laboruntersuchung"}
      doctor={data[0]?.doctor || "Dr. Maria Schmidt"}
      onDataPointHover={onDataPointHover}
      customYAxisTickCallback={(value) => `${value.toLocaleString("de-DE")} %`}
    />
  )
}
