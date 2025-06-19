"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChartOptionsProps {
  chartType: "line" | "bar" | "radar"
  setChartType: (value: "line" | "bar" | "radar") => void
  showDataPoints: boolean
  setShowDataPoints: (value: boolean) => void
  showDataLabels: boolean
  setShowDataLabels: (value: boolean) => void
  smoothLines: boolean
  setSmoothLines: (value: boolean) => void
  colorTheme: "default" | "monochrome" | "pastel" | "dark"
  setColorTheme: (value: "default" | "monochrome" | "pastel" | "dark") => void
  showGrid: boolean
  setShowGrid: (value: boolean) => void
  showLegend: boolean
  setShowLegend: (value: boolean) => void
  enableAnimation: boolean
  setEnableAnimation: (value: boolean) => void
}

export function ChartOptions({
  chartType,
  setChartType,
  showDataPoints,
  setShowDataPoints,
  showDataLabels,
  setShowDataLabels,
  smoothLines,
  setSmoothLines,
  colorTheme,
  setColorTheme,
  showGrid,
  setShowGrid,
  showLegend,
  setShowLegend,
  enableAnimation,
  setEnableAnimation,
}: ChartOptionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Diagramm-Optionen</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] sm:w-[320px] md:w-[380px] dark:border-gray-600 dark:bg-gray-800 shadow-lg">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Diagramm-Optionen</h4>
            <p className="text-sm text-muted-foreground">Passen Sie die Darstellung des Diagramms an</p>
          </div>

          <Tabs defaultValue="type" className="w-full">
            <TabsList className="grid grid-cols-2 dark:bg-gray-700">
              <TabsTrigger
                value="type"
                className="dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
              >
                Typ
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
              >
                Anzeige
              </TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="chartType">Diagrammtyp:</Label>
                <Select value={chartType} onValueChange={(value: "line" | "bar" | "radar") => setChartType(value)}>
                  <SelectTrigger id="chartType" className="w-[140px] dark:border-gray-600 dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:border-gray-600 dark:bg-gray-800">
                    <SelectItem value="line">Liniendiagramm</SelectItem>
                    <SelectItem value="bar">Balkendiagramm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dataPoints"
                  checked={showDataPoints}
                  onCheckedChange={setShowDataPoints}
                  className="dark:border-gray-600"
                />
                <Label htmlFor="dataPoints">Datenpunkte anzeigen</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dataLabels"
                  checked={showDataLabels}
                  onCheckedChange={setShowDataLabels}
                  className="dark:border-gray-600"
                />
                <Label htmlFor="dataLabels">Datenbeschriftungen</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showGrid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                  className="dark:border-gray-600"
                />
                <Label htmlFor="showGrid">Gitternetzlinien</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showLegend"
                  checked={showLegend}
                  onCheckedChange={setShowLegend}
                  className="dark:border-gray-600"
                />
                <Label htmlFor="showLegend">Legende anzeigen</Label>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}
