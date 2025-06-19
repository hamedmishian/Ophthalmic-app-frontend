"use client"

import { useState, useMemo, useEffect } from "react"
import { AlertTriangle, Printer, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartOptions } from "./chart-options"
import { printContent } from "./print-utils"
import { patientData } from "@/data/patient-data"
import { ParameterValueIndicator } from "./parameter-value-indicator"
import { TrafficLightIndicator } from "@/components/ui/traffic-light-indicator"
import { useTheme } from "@/components/theme-provider"
import { ParameterChart } from "./parameter-chart"

export function BlutdruckComponent() {
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Handle dark mode detection safely with useEffect
  useEffect(() => {
    setIsDarkMode(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
  }, [theme])

  const [showSystolicNormalRange, setShowSystolicNormalRange] = useState(true)
  const [showDiastolicNormalRange, setShowDiastolicNormalRange] = useState(true)
  const [lastExamDate, setLastExamDate] = useState(
    patientData.measurements.dates[patientData.measurements.dates.length - 1],
  )
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

  // Get blood pressure data from patientData
  const blutdruckData = useMemo(() => {
    return patientData.measurements.dates.map((date, index) => ({
      date,
      systolic: patientData.measurements.blutdruck.systolic[index],
      diastolic: patientData.measurements.blutdruck.diastolic[index],
      source: patientData.measurements.blutdruck.source,
      doctor: patientData.measurements.blutdruck.doctor,
    }))
  }, [])

  // Convert blood pressure data to the format expected by ParameterChart
  const chartData = useMemo(() => {
    return blutdruckData.map((item) => ({
      date: item.date,
      left: item.systolic, // Use left for systolic
      right: item.diastolic, // Use right for diastolic
      source: item.source,
      doctor: item.doctor,
    }))
  }, [blutdruckData])

  // Filter data based on selected time range and last exam date
  const visibleData = useMemo(() => {
    const selectedDateIndex = patientData.measurements.dates.findIndex((date) => date === lastExamDate)
    if (selectedDateIndex === -1) return chartData

    const dataUpToSelectedDate = chartData.slice(0, selectedDateIndex + 1)
    const yearsToShow = Number.parseFloat(timeRange)
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2

    return dataUpToSelectedDate.slice(-numEntriesToShow)
  }, [lastExamDate, timeRange, chartData])

  // Get visible blood pressure data in original format for table display
  const visibleBlutdruckData = useMemo(() => {
    const selectedDateIndex = patientData.measurements.dates.findIndex((date) => date === lastExamDate)
    if (selectedDateIndex === -1) return blutdruckData

    const dataUpToSelectedDate = blutdruckData.slice(0, selectedDateIndex + 1)
    const yearsToShow = Number.parseFloat(timeRange)
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2

    return dataUpToSelectedDate.slice(-numEntriesToShow)
  }, [lastExamDate, timeRange, blutdruckData])

  // Get latest values and calculate changes
  const getLatestValues = () => {
    if (visibleBlutdruckData.length === 0)
      return {
        systolic: { value: 0, change: 0, status: "yellow" as const },
        diastolic: { value: 0, change: 0, status: "yellow" as const },
      }

    const latest = visibleBlutdruckData[visibleBlutdruckData.length - 1]
    const previous = visibleBlutdruckData.length > 1 ? visibleBlutdruckData[visibleBlutdruckData.length - 2] : latest

    const systolicNormalRange = patientData.measurements.blutdruck.normalRange.systolic
    const diastolicNormalRange = patientData.measurements.blutdruck.normalRange.diastolic

    return {
      systolic: {
        value: latest.systolic,
        change: latest.systolic - previous.systolic,
        status:
          latest.systolic > systolicNormalRange.upper
            ? ("red" as const)
            : latest.systolic < systolicNormalRange.lower
              ? ("yellow" as const)
              : ("green" as const),
      },
      diastolic: {
        value: latest.diastolic,
        change: latest.diastolic - previous.diastolic,
        status:
          latest.diastolic > diastolicNormalRange.upper
            ? ("red" as const)
            : latest.diastolic < diastolicNormalRange.lower
              ? ("yellow" as const)
              : ("green" as const),
      },
    }
  }

  const latestValues = getLatestValues()

  const handlePrint = () => {
    printContent("blutdruck-content", "Blutdruck-Werte")
  }

  // Find critical values
  const criticalValues = visibleBlutdruckData.filter(
    (item) =>
      item.systolic > patientData.measurements.blutdruck.normalRange.systolic.upper ||
      item.diastolic > patientData.measurements.blutdruck.normalRange.diastolic.upper,
  )

  // Separate normal ranges for systolic and diastolic
  const normalRanges = {
    left: patientData.measurements.blutdruck.normalRange.systolic,
    right: patientData.measurements.blutdruck.normalRange.diastolic,
  }

  // Custom colors for blood pressure
  const customColors = {
    left: {
      borderColor: isDarkMode ? "rgb(74, 222, 128)" : "rgb(22, 163, 74)", // Green for systolic
      backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.5)" : "rgba(22, 163, 74, 0.5)",
    },
    right: {
      borderColor: isDarkMode ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)", // Blue for diastolic
      backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.5)",
    },
    normalRange: {
      left: {
        borderColor: isDarkMode ? "rgba(74, 222, 128, 0.7)" : "rgba(22, 163, 74, 0.5)", // Green for systolic normal range
        backgroundColor: isDarkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(22, 163, 74, 0.1)",
      },
      right: {
        borderColor: isDarkMode ? "rgba(96, 165, 250, 0.7)" : "rgba(59, 130, 246, 0.5)", // Blue for diastolic normal range
        backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.1)",
      },
    },
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base font-medium">Blutdruck-Werte</CardTitle>
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
                  {patientData.measurements.dates.map((date) => (
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="systolicNormalRange"
                checked={showSystolicNormalRange}
                onCheckedChange={setShowSystolicNormalRange}
              />
              <Label htmlFor="systolicNormalRange">Anzeige Normbereich Systolisch</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="diastolicNormalRange"
                checked={showDiastolicNormalRange}
                onCheckedChange={setShowDiastolicNormalRange}
              />
              <Label htmlFor="diastolicNormalRange">Anzeige Normbereich Diastolisch</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent id="blutdruck-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            {/* Chart */}
            <div className="h-[400px]">
              <ParameterChart
                data={visibleData}
                selectedEyes={["Links", "Rechts"]}
                showNormalRange={{
                  left: showSystolicNormalRange,
                  right: showDiastolicNormalRange,
                }}
                normalRange={normalRanges}
                yAxis={{
                  min: 0,
                  max: 240,
                  stepSize: 30,
                }}
                unit=" mmHg"
                chartType={chartType}
                showDataPoints={showDataPoints}
                showDataLabels={showDataLabels}
                smoothLines={smoothLines}
                colorTheme={colorTheme}
                showGrid={showGrid}
                showLegend={showLegend}
                enableAnimation={enableAnimation}
                dataSource={patientData.measurements.blutdruck.source}
                doctor={patientData.measurements.blutdruck.doctor}
                onDataPointHover={setHighlightedDate}
                customYAxisTickCallback={(value) => `${value} mmHg`}
                customLegendLabels={{
                  Links: "Systolisch",
                  Rechts: "Diastolisch",
                }}
                customColors={customColors}
              />
            </div>

            {/* Data table */}
            <div className="mt-4 border dark:border-gray-700 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="p-2 text-left">Datum</th>
                    {visibleBlutdruckData.map((item) => (
                      <th key={item.date} className="p-2 text-center">
                        {item.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium text-green-600 dark:text-green-400">Systolisch</td>
                    {visibleBlutdruckData.map((item, i) => (
                      <td key={i} className="p-2 text-center">
                        {item.systolic} mmHg
                        {item.systolic > patientData.measurements.blutdruck.normalRange.systolic.upper && (
                          <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-blue-600 dark:text-blue-400">Diastolisch</td>
                    {visibleBlutdruckData.map((item, i) => (
                      <td key={i} className="p-2 text-center">
                        {item.diastolic} mmHg
                        {item.diastolic > patientData.measurements.blutdruck.normalRange.diastolic.upper && (
                          <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />
                        )}
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
                        {value.date}: {value.systolic}/{value.diastolic} mmHg
                      </div>
                    ))
                  : "keine"}
              </AlertDescription>
            </Alert>

            {/* Current blood pressure indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-600 p-4 shadow-sm dark:shadow-md">
              <div className="text-sm font-medium mb-2">Blutdruck</div>
              <div className="flex justify-center mb-2">
                <TrafficLightIndicator
                  status={
                    latestValues.systolic.status === "red" || latestValues.diastolic.status === "red"
                      ? "red"
                      : latestValues.systolic.status === "yellow" || latestValues.diastolic.status === "yellow"
                        ? "yellow"
                        : "green"
                  }
                />
              </div>
              <div className="text-center">
                <div
                  className={`inline-block px-4 py-2 rounded text-lg font-medium shadow-sm dark:shadow-md ${
                    latestValues.systolic.status === "red" || latestValues.diastolic.status === "red"
                      ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                      : latestValues.systolic.status === "yellow" || latestValues.diastolic.status === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
                        : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  }`}
                >
                  {latestValues.systolic.value}/{latestValues.diastolic.value} mmHg
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <ArrowUp
                  className={`h-4 w-4 ${
                    latestValues.systolic.change > 0 || latestValues.diastolic.change > 0
                      ? "text-red-500 dark:text-red-400"
                      : "text-green-500 dark:text-green-400"
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {latestValues.systolic.change > 0 ? "+" : ""}
                  {latestValues.systolic.change}/{latestValues.diastolic.change > 0 ? "+" : ""}
                  {latestValues.diastolic.change} mmHg
                </span>
              </div>
            </div>

            {/* Individual indicators */}
            <ParameterValueIndicator
              label="Systolisch"
              value={latestValues.systolic.value}
              change={latestValues.systolic.change}
              unit=" mmHg"
              status={latestValues.systolic.status}
            />
            <ParameterValueIndicator
              label="Diastolisch"
              value={latestValues.diastolic.value}
              change={latestValues.diastolic.change}
              unit=" mmHg"
              status={latestValues.diastolic.status}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
