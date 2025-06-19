"use client"

import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle, Check, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { TrafficLightIndicator } from "@/components/ui/traffic-light-indicator"
import { useState, useEffect } from "react"
import { getFHIRChartData, fhirHelpers } from "@/data/fhir-patient-data"

interface ValueBoxProps {
  label: string
  value: string | number
  unit?: string
  change?: {
    value: number
    unit?: string
  }
  date: string
  status?: "red" | "yellow" | "green"
  className?: string
}

function ValueBox({ label, value, unit, change, date, status, className }: ValueBoxProps) {
  return (
    <div
      className={cn("flex flex-col bg-white dark:bg-[#1d1e24] rounded-lg border dark:border-gray-700 p-4", className)}
    >
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex justify-center mb-2">{status && <TrafficLightIndicator status={status} />}</div>
      <div className="text-center">
        <div
          className={cn(
            "inline-block px-2 py-1 rounded text-lg font-medium",
            status === "red"
              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              : status === "yellow"
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                : status === "green"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
          )}
        >
          {value}
          {unit}
        </div>
      </div>
      {change && (
        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
          {change.value > 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : change.value < 0 ? (
            <ArrowDown className="h-4 w-4 text-red-500" />
          ) : (
            <ArrowRight className="h-4 w-4 text-gray-500" />
          )}
          {Math.abs(change.value)}
          {change.unit}
        </div>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Datum: {date}</div>
    </div>
  )
}

interface StatusBoxProps {
  label: string
  sublabel?: string
  status: "vorhanden" | "nicht vorhanden"
  date: string
  className?: string
}

function StatusBox({ label, sublabel, status, date, className }: StatusBoxProps) {
  const isPresent = status === "vorhanden"

  return (
    <div
      className={cn("flex flex-col bg-white dark:bg-[#1d1e24] rounded-lg border dark:border-gray-700 p-4", className)}
    >
      <div className="text-sm font-medium mb-2">{label}</div>
      {sublabel && <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{sublabel}</div>}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {isPresent ? (
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )}
        <div
          className={cn(
            "text-sm font-medium",
            isPresent ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
          )}
        >
          {status}
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Datum: {date}</div>
    </div>
  )
}

export function Overview() {
  const [currentDate, setCurrentDate] = useState("")

  // Get FHIR data
  const visusData = getFHIRChartData.getVisusData()
  const iopData = getFHIRChartData.getIOPData()
  const hba1cData = getFHIRChartData.getHbA1cData()
  const bloodPressureData = getFHIRChartData.getBloodPressureData()

  // Get the latest data from each parameter
  const latestVisus = visusData[visusData.length - 1]
  const latestIOP = iopData[iopData.length - 1]
  const latestHbA1c = hba1cData[hba1cData.length - 1]
  const latestBP = bloodPressureData[bloodPressureData.length - 1]

  // Get previous data for change calculation
  const prevVisus = visusData.length > 1 ? visusData[visusData.length - 2] : latestVisus
  const prevIOP = iopData.length > 1 ? iopData[iopData.length - 2] : latestIOP
  const prevHbA1c = hba1cData.length > 1 ? hba1cData[hba1cData.length - 2] : latestHbA1c
  const prevBP = bloodPressureData.length > 1 ? bloodPressureData[bloodPressureData.length - 2] : latestBP

  // Convert chart date to display date
  const formattedDate = latestVisus?.date
    ? (() => {
        try {
          // Parse MM/YYYY format to a valid date
          const [month, year] = latestVisus.date.split("/")
          // Use the 15th day of the month for consistency
          const dateStr = `${year}-${month}-15`
          return fhirHelpers.toDisplayDate(dateStr)
        } catch (e) {
          console.error("Error formatting date:", e)
          return currentDate // Fallback to current date
        }
      })()
    : currentDate

  // For simplicity, we'll hardcode DRIL, HRF, VMT, and fluid status
  // In a real implementation, these would come from FHIR observations
  const drilLeft = "nicht vorhanden"
  const drilRight = "nicht vorhanden"
  const hrfLeft = "vorhanden"
  const hrfRight = "vorhanden"
  const vmtLeft = "nicht vorhanden"
  const vmtRight = "nicht vorhanden"
  const fluidLeft = "nicht vorhanden"
  const fluidRight = "vorhanden"

  // Mock retinal thickness data (would come from FHIR in real implementation)
  const retinaThicknessLeft = 350
  const retinaThicknessRight = 393
  const retinaThicknessLeftChange = 0
  const retinaThicknessRightChange = 13

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    setCurrentDate(formattedDate)
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Aktuellste Werte im Überblick</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</div>
      </div>

      <Alert variant="default" className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <Info className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Wertveränderung im Vergleich zur letzten Visite</span>
          </div>
          <div className="text-sm">Beispiel: +0,15 Zu- oder Abnahme (ausgewiesen durch + oder -)</div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" /> verbessert
            </div>
            <div className="flex items-center gap-1">
              <ArrowDown className="h-4 w-4" /> verschlechtert
            </div>
            <div className="flex items-center gap-1">
              <ArrowRight className="h-4 w-4" /> gleichbleibend
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Ophthalmological Parameters */}
      <div>
        <h3 className="text-sm font-medium mb-4">Ophthalmologische Parameter</h3>
        <div className="grid gap-4">
          {/* Right Eye */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-4">
            <div className="flex items-center justify-center font-medium">R rechts</div>
            <ValueBox
              label="Visus rechts"
              value={latestVisus?.right?.toFixed(2) || "N/A"}
              change={{ value: (latestVisus?.right || 0) - (prevVisus?.right || 0) }}
              date={formattedDate}
              status={(latestVisus?.right || 0) < 0.5 ? "red" : (latestVisus?.right || 0) < 0.8 ? "yellow" : "green"}
            />
            <ValueBox
              label="Augeninnendruck"
              value={latestIOP?.right || "N/A"}
              unit=" mmHg"
              change={{ value: (latestIOP?.right || 0) - (prevIOP?.right || 0), unit: " mmHg" }}
              date={formattedDate}
              status={(latestIOP?.right || 0) < 10 || (latestIOP?.right || 0) > 21 ? "red" : "green"}
            />
            <ValueBox
              label="Netzhautdicke"
              value={retinaThicknessRight}
              unit=" µm"
              change={{ value: retinaThicknessRightChange, unit: " µm" }}
              date={formattedDate}
              status={retinaThicknessRight < 250 || retinaThicknessRight > 350 ? "red" : "yellow"}
            />
            <StatusBox
              label="DRIL"
              sublabel="Disorganization of Retinal Inner Layers"
              status={drilRight}
              date={formattedDate}
            />
            <StatusBox label="HRF" sublabel="Hyperreflektive Foci" status={hrfRight} date={formattedDate} />
            <StatusBox label="VMT" sublabel="Vitreomakuläre Traktion" status={vmtRight} date={formattedDate} />
            <StatusBox
              label="Flüssigkeits-ansammlung"
              sublabel="in der Makula"
              status={fluidRight}
              date={formattedDate}
            />
          </div>
          {/* Left Eye */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-4">
            <div className="flex items-center justify-center font-medium">L links</div>
            <ValueBox
              label="Visus links"
              value={latestVisus?.left?.toFixed(2) || "N/A"}
              change={{ value: (latestVisus?.left || 0) - (prevVisus?.left || 0) }}
              date={formattedDate}
              status={(latestVisus?.left || 0) < 0.5 ? "red" : (latestVisus?.left || 0) < 0.8 ? "yellow" : "green"}
            />
            <ValueBox
              label="Augeninnendruck"
              value={latestIOP?.left || "N/A"}
              unit=" mmHg"
              change={{ value: (latestIOP?.left || 0) - (prevIOP?.left || 0), unit: " mmHg" }}
              date={formattedDate}
              status={(latestIOP?.left || 0) < 10 || (latestIOP?.left || 0) > 21 ? "red" : "green"}
            />
            <ValueBox
              label="Netzhautdicke"
              value={retinaThicknessLeft}
              unit=" µm"
              change={{ value: retinaThicknessLeftChange, unit: " µm" }}
              date={formattedDate}
              status={retinaThicknessLeft < 250 || retinaThicknessLeft > 350 ? "red" : "yellow"}
            />
            <StatusBox
              label="DRIL"
              sublabel="Disorganization of Retinal Inner Layers"
              status={drilLeft}
              date={formattedDate}
            />
            <StatusBox label="HRF" sublabel="Hyperreflektive Foci" status={hrfLeft} date={formattedDate} />
            <StatusBox label="VMT" sublabel="Vitreomakuläre Traktion" status={vmtLeft} date={formattedDate} />
            <StatusBox
              label="Flüssigkeits-ansammlung"
              sublabel="in der Makula"
              status={fluidLeft}
              date={formattedDate}
            />
          </div>
        </div>
      </div>

      {/* Diabetological and Patient-specific Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Diabetologische Parameter</h3>
          <div className="grid grid-cols-2 gap-4">
            <ValueBox
              label="HbA1c"
              value={latestHbA1c?.value || "N/A"}
              unit=" %"
              change={{ value: (latestHbA1c?.value || 0) - (prevHbA1c?.value || 0), unit: " %" }}
              date={formattedDate}
              status={(latestHbA1c?.value || 0) > 6.5 ? "yellow" : "green"}
            />
            <ValueBox
              label="hs-CRP"
              value="0.85"
              unit=" mg/l"
              change={{ value: 0, unit: " mg/l" }}
              date={formattedDate}
              status="green"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Patientenspezifische Parameter</h3>
          <div className="grid grid-cols-1 gap-4">
            <ValueBox
              label="Blutdruck"
              value={`${latestBP?.systolic || "N/A"} / ${latestBP?.diastolic || "N/A"}`}
              change={{
                value: (latestBP?.systolic || 0) - (prevBP?.systolic || 0),
                unit: ` / ${(latestBP?.diastolic || 0) - (prevBP?.diastolic || 0)}`,
              }}
              date={formattedDate}
              status={(latestBP?.systolic || 0) > 130 || (latestBP?.diastolic || 0) > 85 ? "yellow" : "green"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
