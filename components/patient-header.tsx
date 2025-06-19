"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { fhirPatientData, fhirHelpers } from "@/data/fhir-patient-data"
import { validateAndLog } from "@/lib/fhir-validation"
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Info,
  Pill,
  Search,
  Shield,
  User,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity,
  Printer,
  Share2,
  Download,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PatientHeaderProps {
  patientId?: number
}

export function PatientHeader({ patientId = 1 }: PatientHeaderProps) {
  const [isValidated, setIsValidated] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Get patient data from FHIR
  const patient = fhirPatientData.patient
  const conditions = fhirPatientData.conditions
  const medications = fhirPatientData.medications
  const allergies = fhirPatientData.allergies
  const observations = fhirPatientData.observations

  // Validate FHIR data on component mount
  const handleValidation = () => {
    const isValid = validateAndLog(fhirPatientData)
    setIsValidated(isValid)
  }

  // Calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const patientName = fhirHelpers.getPatientName(patient)
  const patientBirthDate = fhirHelpers.getPatientBirthDate(patient)
  const patientMRN = fhirHelpers.getPatientId(patient)
  const patientAge = patient.birthDate ? calculateAge(patient.birthDate) : "Unknown"
  const patientGender = patient.gender === "male" ? "Männlich" : patient.gender === "female" ? "Weiblich" : "Unbekannt"

  // Get the latest observations for key metrics
  const getLatestObservation = (code: string) => {
    const obs = fhirHelpers.getObservationsByCode(observations, code)
    if (obs.length === 0) return null

    const sorted = fhirHelpers.sortObservationsByDate(obs)
    return sorted[sorted.length - 1]
  }

  const latestHbA1c = getLatestObservation("4548-4")
  const latestSystolic = getLatestObservation("8480-6")
  const latestDiastolic = getLatestObservation("8462-4")

  // Get health status indicators
  const hba1cValue = latestHbA1c ? fhirHelpers.getObservationValue(latestHbA1c) : null
  const systolicValue = latestSystolic ? fhirHelpers.getObservationValue(latestSystolic) : null
  const diastolicValue = latestDiastolic ? fhirHelpers.getObservationValue(latestDiastolic) : null

  const hba1cStatus = hba1cValue ? (hba1cValue > 8 ? "critical" : hba1cValue > 6.5 ? "warning" : "normal") : "unknown"
  const bpStatus =
    systolicValue && diastolicValue
      ? systolicValue > 140 || diastolicValue > 90
        ? "critical"
        : systolicValue > 130 || diastolicValue > 85
          ? "warning"
          : "normal"
      : "unknown"

  // Get condition categories
  const diabeticConditions = conditions.filter((c) => c.code.coding.some((coding) => coding.code === "44054006"))

  const cardiovascularConditions = conditions.filter((c) => c.code.coding.some((coding) => coding.code === "38341003"))

  return (
    <div className="border-b">
      {/* Main patient info bar */}
      <div className="bg-white dark:bg-gray-900 p-4 shadow-sm">
        <div className=" mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Patient identity */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full flex items-center justify-center text-white shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{patientName}</h1>
                  <Badge variant="outline" className="ml-2">
                    ID: {patientMRN}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{patientBirthDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    <span>{patientAge} Jahre</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{patientGender}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health status indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <HealthIndicator
                icon={<Activity className="h-4 w-4" />}
                label="Blutdruck"
                value={systolicValue && diastolicValue ? `${systolicValue}/${diastolicValue}` : "N/A"}
                unit="mmHg"
                status={bpStatus}
              />
              <HealthIndicator
                icon={<Heart className="h-4 w-4" />}
                label="HbA1c"
                value={hba1cValue?.toString() || "N/A"}
                unit="%"
                status={hba1cStatus}
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleValidation}>
                  {isValidated ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                      FHIR Validiert
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-1" />
                      FHIR Validieren
                    </>
                  )}
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions bar */}
      {/* <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-y border-gray-100 dark:border-gray-800">
        <div className=" mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <FileText className="h-4 w-4 mr-1" />
                Patientenakte
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-1" />
                Termine
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <ClipboardList className="h-4 w-4 mr-1" />
                Befunde
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <Printer className="h-4 w-4 mr-1" />
                Drucken
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <Share2 className="h-4 w-4 mr-1" />
                Teilen
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                <Download className="h-4 w-4 mr-1" />
                Exportieren
              </Button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-1.5 pl-10 text-sm border border-gray-200 rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Suchen..."
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Detailed patient information */}
      <div className=" mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Patienteninformationen</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-600 dark:text-gray-400 h-8 px-2"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span className="text-xs">Weniger anzeigen</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span className="text-xs">Mehr anzeigen</span>
              </>
            )}
          </Button>
        </div>

        {showDetails ? (
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="conditions">Erkrankungen</TabsTrigger>
              <TabsTrigger value="medications">Medikation</TabsTrigger>
              <TabsTrigger value="allergies">Allergien</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
            </TabsList>
            <TabsContent value="conditions" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    Diabetische Erkrankungen
                  </h3>
                  <div className="space-y-1">
                    {diabeticConditions.length > 0 ? (
                      diabeticConditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{condition.code.coding[0]?.display}</span>
                          <Badge variant="outline">
                            Seit {new Date(condition.onsetDateTime || condition.recordedDate).getFullYear()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Keine bekannt</span>
                    )}
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-blue-500" />
                    Kardiovaskuläre Erkrankungen
                  </h3>
                  <div className="space-y-1">
                    {cardiovascularConditions.length > 0 ? (
                      cardiovascularConditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{condition.code.coding[0]?.display}</span>
                          <Badge variant="outline">Seit {new Date(condition.recordedDate).getFullYear()}</Badge>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Keine bekannt</span>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="medications" className="pt-2">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Pill className="h-4 w-4 mr-1 text-emerald-500" />
                  Aktuelle Medikation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {medications.length > 0 ? (
                    medications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm border rounded-md p-2">
                        <Pill className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-medium">{medication.medicationCodeableConcept.coding[0]?.display}</div>
                          <div className="text-xs text-gray-500">
                            {medication.dosage?.[0]?.text || "Keine Dosierungsangabe"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Keine Medikation</span>
                  )}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="allergies" className="pt-2">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  Allergien und Unverträglichkeiten
                </h3>
                <div className="space-y-2">
                  {allergies.length > 0 ? (
                    allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant={allergy.code.coding[0]?.code === "716186003" ? "outline" : "destructive"}>
                          {allergy.code.coding[0]?.display}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Keine bekannt</span>
                  )}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="contact" className="pt-2">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3">Kontaktinformationen</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Adresse:</span> {patient.address?.[0]?.line.join(", ")},{" "}
                    {patient.address?.[0]?.postalCode} {patient.address?.[0]?.city}
                  </div>
                  <div>
                    <span className="font-medium">Telefon:</span> +49 30 123456789
                  </div>
                  <div>
                    <span className="font-medium">E-Mail:</span> michael.becker@example.com
                  </div>
                  <div>
                    <span className="font-medium">Notfallkontakt:</span> Anna Becker (Ehefrau), +49 30 987654321
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div className="text-sm">
                <span className="font-medium">Erkrankungen:</span>{" "}
                {conditions.length > 0 ? conditions.map((c) => c.code.coding[0]?.display).join(", ") : "Keine bekannt"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-emerald-500" />
              <div className="text-sm">
                <span className="font-medium">Medikation:</span>{" "}
                {medications.length > 0
                  ? medications.map((m) => m.medicationCodeableConcept.coding[0]?.display).join(", ")
                  : "Keine"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="text-sm">
                <span className="font-medium">Allergien:</span>{" "}
                {allergies[0]?.code.coding[0]?.code === "716186003"
                  ? "Keine bekannt"
                  : allergies.map((a) => a.code.coding[0]?.display).join(", ")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface HealthIndicatorProps {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical" | "unknown"
}

function HealthIndicator({ icon, label, value, unit, status }: HealthIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border",
        status === "normal"
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
          : status === "warning"
            ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900"
            : status === "critical"
              ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900"
              : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
      )}
    >
      <div
        className={cn(
          "p-1 rounded-full",
          status === "normal"
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : status === "warning"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              : status === "critical"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
        <div className="font-medium">
          {value} <span className="text-xs font-normal">{unit}</span>
        </div>
      </div>
    </div>
  )
}
