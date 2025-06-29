"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ParameterChart } from "./parameter-chart"
import { ParameterValueIndicator } from "./parameter-value-indicator"
import { ChartOptions } from "./chart-options"
import { printContent } from "./print-utils"
import { getFHIRChartData } from "@/data/fhir-patient-data"

export function VisusComponent() {
  const [showNormalRange, setShowNormalRange] = useState(false)
  const [selectedEyes, setSelectedEyes] = useState<("Links" | "Rechts")[]>(["Links", "Rechts"])
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

  // Get FHIR visus data
  const visusData = getFHIRChartData.getVisusData()
  const referenceRanges = getFHIRChartData.getReferenceRanges()

  // Get available dates from FHIR data
  const availableDates = useMemo(() => {
    return visusData.map((item) => item.date).sort()
  }, [visusData])

  // Set initial last exam date
  useMemo(() => {
    if (availableDates.length > 0 && !lastExamDate) {
      setLastExamDate(availableDates[availableDates.length - 1])
    }
  }, [availableDates, lastExamDate])

  // Filter data based on selected time range and last exam date
  const visibleData = useMemo(() => {
    const selectedDateIndex = availableDates.findIndex((date) => date === lastExamDate)
    if (selectedDateIndex === -1) return visusData

    const dataUpToSelectedDate = visusData.slice(0, selectedDateIndex + 1)
    const yearsToShow = Number.parseFloat(timeRange)
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2

    return dataUpToSelectedDate.slice(-numEntriesToShow)
  }, [lastExamDate, timeRange, visusData, availableDates])

  const toggleEye = (eye: "Links" | "Rechts") => {
    setSelectedEyes((prev) => (prev.includes(eye) ? prev.filter((e) => e !== eye) : [...prev, eye]))
  }

  const getLatestValues = () => {
    if (visibleData.length === 0)
      return {
        left: { value: 0, change: 0, status: "yellow" as const },
        right: { value: 0, change: 0, status: "yellow" as const },
      }

    const latest = visibleData[visibleData.length - 1]
    const previous = visibleData.length > 1 ? visibleData[visibleData.length - 2] : latest

    const normalRange = referenceRanges.visus || { lower: 0.2, upper: 0.8 }

    return {
      left: {
        value: latest.left || 0,
        change: (latest.left || 0) - (previous.left || 0),
        status:
          (latest.left || 0) < 0.5
            ? ("red" as const)
            : (latest.left || 0) < normalRange.lower
              ? ("yellow" as const)
              : ("green" as const),
      },
      right: {
        value: latest.right || 0,
        change: (latest.right || 0) - (previous.right || 0),
        status:
          (latest.right || 0) < 0.5
            ? ("red" as const)
            : (latest.right || 0) < normalRange.lower
              ? ("yellow" as const)
              : ("green" as const),
      },
    }
  }

  const latestValues = getLatestValues()

  const handlePrint = () => {
    printContent("visus-content", "Visus-Werte")
  }

  // Find critical values
  const criticalValues = visibleData.filter(
    (item) => (item.left && item.left < 0.5) || (item.right && item.right < 0.5),
  )

  // Get normal range from FHIR data
  const normalRange = referenceRanges.visus || { lower: 0.2, upper: 0.8 }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base font-medium">Visus-Werte</CardTitle>
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
          <div className="flex flex-wrap items-center gap-2">
            <Label className="whitespace-nowrap">Darstellung Augen:</Label>
            <div className="flex gap-2">
              <Button
                variant={selectedEyes.includes("Rechts") ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleEye("Rechts")}
              >
                Rechts
              </Button>
              <Button
                variant={selectedEyes.includes("Links") ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleEye("Links")}
              >
                Links
              </Button>
            </div>
          </div>
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
      <CardContent id="visus-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <ParameterChart
              data={visibleData}
              selectedEyes={selectedEyes}
              showNormalRange={showNormalRange}
              normalRange={normalRange}
              yAxis={{
                min: 0,
                max: 2,
                stepSize: 0.25,
              }}
              unit=""
              chartType={chartType}
              showDataPoints={showDataPoints}
              showDataLabels={showDataLabels}
              smoothLines={smoothLines}
              colorTheme={colorTheme}
              showGrid={showGrid}
              showLegend={showLegend}
              enableAnimation={enableAnimation}
              dataSource="Snellen-Tafel"
              doctor="Dr. Erwin Müller"
              onDataPointHover={setHighlightedDate}
            />
            <div className="mt-4 border dark:border-gray-700 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="p-2 text-left">Auge</th>
                    {visibleData.map((item) => (
                      <th key={item.date} className="p-2 text-center">
                        {item.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedEyes.includes("Links") && (
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 font-medium text-red-600 dark:text-red-400">Links</td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.left?.toFixed(2) || "N/A"}
                          {item.left && item.left < 0.5 && (
                            <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  {selectedEyes.includes("Rechts") && (
                    <tr>
                      <td className="p-2 font-medium text-blue-600 dark:text-blue-400">Rechts</td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.right?.toFixed(2) || "N/A"}
                          {item.right && item.right < 0.5 && (
                            <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Kritische Werte:</AlertTitle>
              <AlertDescription className="text-sm">
                {criticalValues.length > 0
                  ? criticalValues.map((value, index) => (
                      <div key={index}>
                        {value.left && value.left < 0.5 && `Links ${value.date}: ${value.left.toFixed(2)}`}
                        {value.right && value.right < 0.5 && `Rechts ${value.date}: ${value.right.toFixed(2)}`}
                      </div>
                    ))
                  : "Keine kritischen Werte"}
              </AlertDescription>
            </Alert>
            <ParameterValueIndicator
              label="Visus links"
              value={latestValues.left.value}
              change={latestValues.left.change}
              unit=""
              status={latestValues.left.status}
            />
            <ParameterValueIndicator
              label="Visus rechts"
              value={latestValues.right.value}
              change={latestValues.right.change}
              unit=""
              status={latestValues.right.status}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
