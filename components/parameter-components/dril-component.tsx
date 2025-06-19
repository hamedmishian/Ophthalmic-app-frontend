"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartOptions } from "./chart-options";
import { printContent } from "./print-utils";
import { ParameterChart } from "./parameter-chart";
import { ParameterValueIndicator } from "./parameter-value-indicator";
import { patientData, getChartData } from "@/data/patient-data";

export function DRILComponent() {
  const [selectedEyes, setSelectedEyes] = useState<("Links" | "Rechts")[]>([
    "Links",
    "Rechts"
  ]);
  const [lastExamDate, setLastExamDate] = useState(
    patientData.measurements.dates[patientData.measurements.dates.length - 1]
  );
  const [timeRange, setTimeRange] = useState("2");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar" | "radar">("bar");
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  const drilData = getChartData("dril") as Array<{
    date: string;
    left: number;
    right: number;
    source: string;
    doctor: string;
  }>;
  const normalRange = patientData.measurements.dril.normalRange;

  const visibleData = useMemo(() => {
    const selectedDateIndex = patientData.measurements.dates.findIndex(
      date => date === lastExamDate
    );
    if (selectedDateIndex === -1) return drilData;

    const dataUpToSelectedDate = drilData.slice(0, selectedDateIndex + 1);
    const yearsToShow = Number.parseFloat(timeRange);
    const numEntriesToShow = yearsToShow === 2 ? 6 : yearsToShow === 1 ? 4 : 2;

    return dataUpToSelectedDate.slice(-numEntriesToShow);
  }, [lastExamDate, timeRange, drilData]);

  const toggleEye = (eye: "Links" | "Rechts") => {
    setSelectedEyes(prev =>
      prev.includes(eye) ? prev.filter(e => e !== eye) : [...prev, eye]
    );
  };

  const handlePrint = () => {
    printContent("dril-content", "DRIL-Werte");
  };

  const getCriticalValues = () => {
    const critical = visibleData
      .filter(item => item.left === 1 || item.right === 1)
      .map(item => {
        const criticalEyes = [];
        if (item.right === 1) criticalEyes.push("Rechts");
        if (item.left === 1) criticalEyes.push("Links");
        return `${criticalEyes.join(" und ")} ${item.date}: DRIL vorh.`;
      });
    return critical;
  };

  const getLatestValues = () => {
    if (visibleData.length === 0)
      return {
        left: { value: 0, change: 0, status: "green" as const },
        right: { value: 0, change: 0, status: "green" as const }
      };

    const latest = visibleData[visibleData.length - 1];
    const previous =
      visibleData.length > 1 ? visibleData[visibleData.length - 2] : latest;

    return {
      left: {
        value: latest.left,
        change: latest.left - previous.left,
        status: latest.left === 1 ? ("red" as const) : ("green" as const)
      },
      right: {
        value: latest.right,
        change: latest.right - previous.right,
        status: latest.right === 1 ? ("red" as const) : ("green" as const)
      }
    };
  };

  const latestValues = getLatestValues();

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base font-medium">DRIL-Werte</CardTitle>
          <div className="flex items-center gap-2">
            <ChartOptions
              chartType={chartType}
              setChartType={setChartType}
              showDataPoints={false}
              setShowDataPoints={() => {}} // Not applicable for bar chart
              showDataLabels={showDataLabels}
              setShowDataLabels={setShowDataLabels}
              smoothLines={false}
              setSmoothLines={() => {}} // Not applicable for bar chart
              colorTheme="default"
              setColorTheme={() => {}} // Using fixed colors
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showLegend={showLegend}
              setShowLegend={setShowLegend}
              enableAnimation={false}
              setEnableAnimation={() => {}} // Not using animations
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
                  selectedEyes.includes("Links") ? "secondary" : "outline"
                }
                size="sm"
                onClick={() => toggleEye("Links")}
              >
                Links
              </Button>
              <Button
                variant={
                  selectedEyes.includes("Rechts") ? "secondary" : "outline"
                }
                size="sm"
                onClick={() => toggleEye("Rechts")}
              >
                Rechts
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
        </div>
      </CardHeader>
      <CardContent id="dril-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <ParameterChart
              data={visibleData}
              selectedEyes={selectedEyes}
              showNormalRange={false}
              normalRange={normalRange}
              yAxis={{
                min: 0,
                max: 1,
                stepSize: 1
              }}
              unit=""
              chartType={chartType}
              showDataPoints={false}
              showDataLabels={showDataLabels}
              smoothLines={false}
              colorTheme="default"
              showGrid={showGrid}
              showLegend={showLegend}
              enableAnimation={false}
              customYAxisTickCallback={value =>
                value === 1 ? "vorhanden" : "nicht vorhanden"
              }
              dataSource={patientData.measurements.dril.source}
              doctor={patientData.measurements.dril.doctor}
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
                  {selectedEyes.includes("Rechts") && (
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 font-medium text-blue-600 dark:text-blue-400">
                        Rechts
                      </td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.right === 1 ? "vorhanden" : "nicht vorhanden"}
                          {item.right === 1 && (
                            <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  {selectedEyes.includes("Links") && (
                    <tr>
                      <td className="p-2 font-medium text-red-600 dark:text-red-400">
                        Links
                      </td>
                      {visibleData.map((item, i) => (
                        <td key={i} className="p-2 text-center">
                          {item.left === 1 ? "vorhanden" : "nicht vorhanden"}
                          {item.left === 1 && (
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
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Kritische Werte:</AlertTitle>
              <AlertDescription className="text-sm">
                {getCriticalValues().map((value, index) => (
                  <div key={index}>{value}</div>
                ))}
              </AlertDescription>
            </Alert>
            <ParameterValueIndicator
              label="DRIL links"
              value={latestValues.left.value}
              change={latestValues.left.change}
              unit=""
              status={latestValues.left.status}
              customValueDisplay={value =>
                value === 1 ? "vorhanden" : "nicht vorhanden"
              }
            />
            <ParameterValueIndicator
              label="DRIL rechts"
              value={latestValues.right.value}
              change={latestValues.right.change}
              unit=""
              status={latestValues.right.status}
              customValueDisplay={value =>
                value === 1 ? "vorhanden" : "nicht vorhanden"
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
