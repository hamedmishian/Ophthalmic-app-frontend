"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ParameterChart } from "./parameter-chart";
import { ParameterValueIndicator } from "./parameter-value-indicator";
import { ChartOptions } from "./chart-options";
import { printContent } from "./print-utils";
import { patientData, getChartData } from "@/data/patient-data";

export function NetzhautdickeComponent() {
  const [showNormalRange, setShowNormalRange] = useState(false);
  const [selectedEyes, setSelectedEyes] = useState<("Links" | "Rechts")[]>([
    "Links",
    "Rechts"
  ]);
  const [lastExamDate, setLastExamDate] = useState(
    patientData.measurements.dates[patientData.measurements.dates.length - 1]
  );
  const [timeRange, setTimeRange] = useState("2");
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  // Chart options
  const [chartType, setChartType] = useState<"line" | "bar" | "radar">("line");
  const [showDataPoints, setShowDataPoints] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [smoothLines, setSmoothLines] = useState(false);
  const [colorTheme, setColorTheme] = useState<
    "default" | "monochrome" | "pastel" | "dark"
  >("default");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);

  const retinaThicknessData = getChartData("netzhautdicke") as Array<{
    date: string;
    left: number;
    right: number;
    source: string;
    doctor: string;
  }>;
  const normalRange = patientData.measurements.netzhautdicke.normalRange;

  const visibleData = useMemo(() => {
    const selectedDateIndex = patientData.measurements.dates.findIndex(
      date => date === lastExamDate
    );
    if (selectedDateIndex === -1) return retinaThicknessData;

    const dataUpToSelectedDate = retinaThicknessData.slice(
      0,
      selectedDateIndex + 1
    );
    const yearsToShow = Number.parseFloat(timeRange);
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2;

    return dataUpToSelectedDate.slice(-numEntriesToShow);
  }, [lastExamDate, timeRange, retinaThicknessData]);

  const toggleEye = (eye: "Links" | "Rechts") => {
    setSelectedEyes(prev =>
      prev.includes(eye) ? prev.filter(e => e !== eye) : [...prev, eye]
    );
  };

  const getLatestValues = () => {
    if (visibleData.length === 0)
      return {
        left: { value: 0, change: 0, status: "yellow" as const },
        right: { value: 0, change: 0, status: "yellow" as const }
      };

    const latest = visibleData[visibleData.length - 1];
    const previous =
      visibleData.length > 1 ? visibleData[visibleData.length - 2] : latest;

    return {
      left: {
        value: latest.left,
        change: latest.left - previous.left,
        status:
          latest.left < normalRange.lower
            ? ("red" as const)
            : latest.left > normalRange.upper
            ? ("red" as const)
            : ("green" as const)
      },
      right: {
        value: latest.right,
        change: latest.right - previous.right,
        status:
          latest.right < normalRange.lower
            ? ("red" as const)
            : latest.right > normalRange.upper
            ? ("red" as const)
            : ("green" as const)
      }
    };
  };

  const latestValues = getLatestValues();

  const handlePrint = () => {
    printContent("netzhautdicke-content", "Netzhautdicke-Werte");
  };

  // Find critical values
  const criticalValues = visibleData.filter(
    item =>
      (item.left !== null &&
        (item.left < normalRange.lower || item.left > normalRange.upper)) ||
      (item.right !== null &&
        (item.right < normalRange.lower || item.right > normalRange.upper))
  );

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base font-medium">
            Netzhautdicke-Werte
          </CardTitle>
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
                variant={
                  selectedEyes.includes("Rechts") ? "secondary" : "outline"
                }
                size="sm"
                onClick={() => toggleEye("Rechts")}
              >
                Rechts
              </Button>
              <Button
                variant={
                  selectedEyes.includes("Links") ? "secondary" : "outline"
                }
                size="sm"
                onClick={() => toggleEye("Links")}
              >
                Links
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
              <Label className="whitespace-nowrap">
                Letzter Untersuchungszeitpunkt:
              </Label>
              <Select value={lastExamDate} onValueChange={setLastExamDate}>
                <SelectTrigger className="w-full xs:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patientData.measurements.dates.map(date => (
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
            <Switch
              id="normalRange"
              checked={showNormalRange}
              onCheckedChange={setShowNormalRange}
            />
            <Label htmlFor="normalRange">Anzeige Normbereich</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent id="netzhautdicke-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <ParameterChart
              data={visibleData}
              selectedEyes={selectedEyes}
              showNormalRange={showNormalRange}
              normalRange={normalRange}
              yAxis={{
                min: 100,
                max: 500,
                stepSize: 50
              }}
              unit={patientData.measurements.netzhautdicke.unit}
              chartType={chartType}
              showDataPoints={showDataPoints}
              showDataLabels={showDataLabels}
              smoothLines={smoothLines}
              colorTheme={colorTheme}
              showGrid={showGrid}
              showLegend={showLegend}
              enableAnimation={enableAnimation}
              dataSource={patientData.measurements.netzhautdicke.source}
              doctor={patientData.measurements.netzhautdicke.doctor}
              onDataPointHover={setHighlightedDate}
            />
            <div className="mt-4 border dark:border-gray-700 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="p-2 text-left">Auge</th>
                    {visibleData.map(item => (
                      <th key={item.date} className="p-2 text-center">
                        {item.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedEyes.includes("Links") && (
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 font-medium text-red-600 dark:text-red-400">
                        Links
                      </td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.left} µm
                        </td>
                      ))}
                    </tr>
                  )}
                  {selectedEyes.includes("Rechts") && (
                    <tr>
                      <td className="p-2 font-medium text-blue-600 dark:text-blue-400">
                        Rechts
                      </td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.right} µm
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Kritische Werte:</AlertTitle>
              <AlertDescription className="text-sm">
                {criticalValues.length > 0
                  ? criticalValues.map((value, index) => (
                      <div key={index}>
                        {value.left < normalRange.lower ||
                        value.left > normalRange.upper
                          ? `Links ${value.date}: ${value.left} µm`
                          : null}
                        {value.right < normalRange.lower ||
                        value.right > normalRange.upper
                          ? `Rechts ${value.date}: ${value.right} µm`
                          : null}
                      </div>
                    ))
                  : "keine"}
              </AlertDescription>
            </Alert>
            <ParameterValueIndicator
              label="Netzhautdicke L"
              value={latestValues.left.value}
              change={latestValues.left.change}
              unit=" µm"
              status={latestValues.left.status}
            />
            <ParameterValueIndicator
              label="Netzhautdicke R"
              value={latestValues.right.value}
              change={latestValues.right.change}
              unit=" µm"
              status={latestValues.right.status}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
