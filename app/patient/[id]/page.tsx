"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { PatientHeader } from "@/components/patient-header"
import { Sidebar } from "@/components/sidebar"
import { TabNav } from "@/components/tab-nav"
import { Overview } from "@/components/overview"
import {
  VisusComponent,
  AugeninnendruckComponent,
  NetzhautdickeComponent,
  DRILComponent,
  HbA1cComponent,
  BlutdruckComponent,
  // Import other parameter components
} from "@/components/parameter-components"
import { Therapieverlauf } from "@/components/therapieverlauf"
import { KritischeWerte } from "@/components/kritische-werte"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = [
  { id: "gesamtubersicht", label: "Gesamtübersicht" },
  { id: "parameter", label: "Parameter" },
  { id: "therapieverlauf", label: "Therapieverlauf" },
  { id: "kritische-werte", label: "Kritische Werte" },
  { id: "fehlende-werte", label: "Fehlende Werte" },
  { id: "vorerkrankungen", label: "Vorerkrankungen" },
  { id: "parameterkombinationen", label: "Parameterkombinationen" },
  { id: "datenfelder", label: "Datenfelder" },
]

export default function Dashboard() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("gesamtubersicht")
  const [activeParameter, setActiveParameter] = useState("visus")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    } else {
      setActiveTab("gesamtubersicht")
    }

    const parameter = searchParams.get("parameter")
    if (parameter) {
      setActiveParameter(parameter)
    } else if (tab === "parameter") {
      setActiveParameter("visus")
    }
  }, [params.id, searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (tabId === "parameter") {
      router.push(`/patient/${params.id}?tab=${tabId}&parameter=${activeParameter}`)
    } else {
      router.push(`/patient/${params.id}?tab=${tabId}`)
    }
  }

  const renderParameterComponent = () => {
    switch (activeParameter) {
      case "visus":
        return <VisusComponent />
      case "augeninnendruck":
        return <AugeninnendruckComponent />
      case "netzhautdicke":
        return <NetzhautdickeComponent />
      case "dril":
        return <DRILComponent />
      case "hba1c":
        return <HbA1cComponent />
      case "blutdruck":
        return <BlutdruckComponent />
      // Add cases for other parameters
      default:
        return <div style={{ margin: "30px" }}>No component available for {activeParameter}</div>
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Back Button */}
      <div className="border-b bg-white dark:bg-gray-950 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Patientenliste
        </Button>
      </div>
      <PatientHeader patientId={Number(params.id)} />
      <div className="flex-1 overflow-hidden">
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />
        <div className="flex h-[calc(100%-48px)]">
          {activeTab === "parameter" && <Sidebar className="hidden md:block" />}
          <main className="flex-1 overflow-auto">
            {activeTab === "gesamtubersicht" ? (
              <Overview />
            ) : activeTab === "parameter" ? (
              renderParameterComponent()
            ) : activeTab === "therapieverlauf" ? (
              <Therapieverlauf />
            ) : activeTab === "kritische-werte" ? (
              <KritischeWerte />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-gray-500">Content for {activeTab} tab</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
