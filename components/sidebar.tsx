"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu, Eye, Gauge, Layers, Activity, Droplets, Heart, TestTube, Flame, Search } from "lucide-react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"

const parameterCategories = [
  {
    id: "vision",
    label: "Sehen",
    icon: Eye,
    color: "bg-blue-500",
    defaultParameter: "visus", // Default parameter for this category
    parameters: [
      {
        id: "visus",
        label: "Visus",
        icon: Eye,
        status: "normal",
        lastValue: "1.0",
      },
      {
        id: "augeninnendruck",
        label: "Augeninnendruck",
        icon: Gauge,
        status: "warning",
        lastValue: "18 mmHg",
      },
      {
        id: "netzhautdicke",
        label: "Netzhautdicke",
        icon: Layers,
        status: "normal",
        lastValue: "245 μm",
      },
      {
        id: "dril",
        label: "DRIL",
        icon: Activity,
        status: "normal",
        lastValue: "Nicht vorhanden",
      },
    ],
  },
  {
    id: "retinal",
    label: "Netzhaut",
    icon: Layers,
    color: "bg-green-500",
    defaultParameter: "hif", // Default parameter for this category
    parameters: [
      {
        id: "hif",
        label: "HIF",
        icon: Activity,
        status: "normal",
        lastValue: "2",
      },
      {
        id: "vmt",
        label: "VMT",
        icon: Layers,
        status: "normal",
        lastValue: "Keine",
      },
      {
        id: "flussigkeit-im-makula-oct",
        label: "Flüssigkeit im Makula-OCT",
        icon: Droplets,
        status: "critical",
        lastValue: "Vorhanden",
      },
    ],
  },
  {
    id: "laboratory",
    label: "Labor",
    icon: TestTube,
    color: "bg-purple-500",
    defaultParameter: "hba1c", // Default parameter for this category
    parameters: [
      {
        id: "hba1c",
        label: "HBA1C",
        icon: TestTube,
        status: "warning",
        lastValue: "7,2%",
      },
      {
        id: "hs-crp",
        label: "hs-CRP",
        icon: Flame,
        status: "normal",
        lastValue: "1,2 mg/L",
      },
    ],
  },
  {
    id: "vitals",
    label: "Vitalwerte",
    icon: Heart,
    color: "bg-red-500",
    defaultParameter: "blutdruck", // Default parameter for this category
    parameters: [
      {
        id: "blutdruck",
        label: "Blutdruck",
        icon: Heart,
        status: "warning",
        lastValue: "145/90",
      },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
    case "normal":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
  }
}

const getStatusDot = (status: string) => {
  const baseClasses = "w-2 h-2 rounded-full"
  switch (status) {
    case "critical":
      return <div className={`${baseClasses} bg-red-500`}></div>
    case "warning":
      return <div className={`${baseClasses} bg-yellow-500`}></div>
    case "normal":
      return <div className={`${baseClasses} bg-green-500`}></div>
    default:
      return <div className={`${baseClasses} bg-gray-500`}></div>
  }
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const activeParameter = searchParams.get("parameter") || "visus"
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("vision")

  // Find which category the active parameter belongs to
  const findCategoryForParameter = (parameterId: string) => {
    for (const category of parameterCategories) {
      if (category.parameters.some((param) => param.id === parameterId)) {
        return category.id
      }
    }
    return "vision" // fallback
  }

  // Update active tab when parameter changes
  useEffect(() => {
    const categoryForActiveParameter = findCategoryForParameter(activeParameter)
    setActiveTab(categoryForActiveParameter)
  }, [activeParameter])

  const handleParameterChange = (parameterId: string) => {
    router.push(`/patient/${params.id}?tab=parameter&parameter=${parameterId}`)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Find the category and navigate to its default parameter
    const category = parameterCategories.find((cat) => cat.id === tabId)
    if (category) {
      handleParameterChange(category.defaultParameter)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return parameterCategories

    return parameterCategories
      .map((category) => ({
        ...category,
        parameters: category.parameters.filter((param) => param.label.toLowerCase().includes(searchTerm.toLowerCase())),
      }))
      .filter((category) => category.parameters.length > 0)
  }, [searchTerm])

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="mb-4 md:hidden shadow-sm">
            <Menu className="mr-2 h-4 w-4" />
            Parameter Menü
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 bg-white dark:bg-[#1a1b23]">
          <SheetHeader className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <SheetTitle className="text-lg font-semibold">Parameter</SheetTitle>
          </SheetHeader>
          <SidebarContent
            activeParameter={activeParameter}
            onParameterChange={handleParameterChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            filteredCategories={filteredCategories}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col border-r dark:border-gray-700 bg-white dark:bg-[#1a1b23] shadow-md w-[280px] flex-shrink-0",
          className,
        )}
      >
        <div className="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Medizinische Parameter</h2>
        </div>
        <SidebarContent
          activeParameter={activeParameter}
          onParameterChange={handleParameterChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          filteredCategories={filteredCategories}
        />
      </div>
    </>
  )
}

function SidebarContent({
  activeParameter,
  onParameterChange,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  filteredCategories,
}: {
  activeParameter: string
  onParameterChange: (parameterId: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  filteredCategories: typeof parameterCategories
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Parameter suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!searchTerm ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 h-12 bg-gray-50 dark:bg-gray-800/50 rounded-none border-b dark:border-gray-700">
            {parameterCategories.map((category) => {
              const CategoryIcon = category.icon
              const isActiveTab = activeTab === category.id
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "rounded-none border-b-2 border-transparent transition-all duration-200",
                    isActiveTab
                      ? "bg-white dark:bg-gray-700 shadow-none border-blue-500 dark:border-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <CategoryIcon className={cn("h-4 w-4", isActiveTab ? "text-blue-600 dark:text-blue-400" : "")} />
                    <span className={cn("text-xs", isActiveTab ? "text-blue-600 dark:text-blue-400 font-medium" : "")}>
                      {category.label}
                    </span>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {parameterCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="flex-1 overflow-y-auto p-0 m-0 data-[state=active]:border-0"
            >
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {category.parameters.map((parameter) => {
                  const ParameterIcon = parameter.icon
                  const isActive = activeParameter === parameter.id

                  return (
                    <Button
                      key={parameter.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start rounded-none h-14 px-3 py-2 transition-all duration-200 relative",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      )}
                      onClick={() => onParameterChange(parameter.id)}
                    >
                      {/* Blue left border for active parameter */}
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400" />}
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors duration-200",
                            isActive ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
                          )}
                        >
                          <ParameterIcon
                            className={cn(
                              "h-4 w-4 transition-colors duration-200",
                              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400",
                            )}
                          />
                        </div>
                        <div className="flex-1 flex flex-col items-start">
                          <div className="flex items-center gap-2 w-full">
                            <span
                              className={cn(
                                "font-medium text-sm transition-colors duration-200",
                                isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white",
                              )}
                            >
                              {parameter.label}
                            </span>
                            {getStatusDot(parameter.status)}
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <Badge
                              variant="outline"
                              className={cn("text-xs px-1.5 py-0 mt-1", getStatusColor(parameter.status))}
                            >
                              {parameter.lastValue}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Search Results
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Suchergebnisse für "{searchTerm}"</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCategories.map((category) =>
              category.parameters.map((parameter) => {
                const ParameterIcon = parameter.icon
                const isActive = activeParameter === parameter.id

                return (
                  <Button
                    key={parameter.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-none h-14 px-3 py-2 transition-all duration-200 relative",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    )}
                    onClick={() => onParameterChange(parameter.id)}
                  >
                    {/* Blue left border for active parameter */}
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400" />}
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors duration-200",
                          isActive ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        <ParameterIcon
                          className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 flex flex-col items-start">
                        <div className="flex items-center gap-2 w-full">
                          <span
                            className={cn(
                              "font-medium text-sm transition-colors duration-200",
                              isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white",
                            )}
                          >
                            {parameter.label}
                          </span>
                          {getStatusDot(parameter.status)}
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <Badge
                            variant="outline"
                            className={cn("text-xs px-1.5 py-0 mt-1", getStatusColor(parameter.status))}
                          >
                            {parameter.lastValue}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.label}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              }),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
