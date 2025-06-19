"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { InfoIcon, ChevronUp } from "lucide-react";
import { ParameterChart } from "./parameter-components/parameter-chart";
import { cn } from "@/lib/utils";
import { patientData, getChartData } from "@/data/patient-data";

type ParameterType = "augeninnendruck" | "visus" | "netzhautdicke";

export function Therapieverlauf() {
  const [selectedEyes, setSelectedEyes] = useState<("Links" | "Rechts")[]>([
    "Links",
    "Rechts"
  ]);
  const [showNormalRange, setShowNormalRange] = useState(true);
  const [lastExamDate, setLastExamDate] = useState(
    patientData.measurements.dates[patientData.measurements.dates.length - 1]
  );
  const [timeRange, setTimeRange] = useState("3 Jahre");
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] =
    useState<ParameterType>("augeninnendruck");
  const [chartHeight, setChartHeight] = useState(400);
  const [chartTop, setChartTop] = useState(0);
  const resizeRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const startTop = useRef(0);

  const toggleEye = (eye: "Links" | "Rechts") => {
    setSelectedEyes(prev =>
      prev.includes(eye) ? prev.filter(e => e !== eye) : [...prev, eye]
    );
  };

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = chartHeight;
    startTop.current = chartTop;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none"; // Prevent text selection during drag
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.clientY;

    // When moving up (negative delta), increase height and decrease top position
    // When moving down (positive delta), decrease height and increase top position
    const newHeight = Math.max(300, Math.min(800, startHeight.current + delta));
    const newTop = Math.max(-300, Math.min(0, startTop.current - delta));

    setChartHeight(newHeight);
    setChartTop(newTop);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = ""; // Restore text selection
  };

  // Add a function to filter data based on the selected time range and last exam date
  const filterDataByTimeRange = (
    data: Array<{
      date: string;
      left: number | null;
      right: number | null;
      source: string;
      doctor: string;
    }>
  ) => {
    // Find the index of the last exam date
    const lastExamIndex = patientData.measurements.dates.findIndex(
      date => date === lastExamDate
    );
    if (lastExamIndex === -1) return data;

    // Get data up to the last exam date
    const dataUpToLastExam = data.slice(0, lastExamIndex + 1);

    // Filter based on time range
    let monthsToShow = 0;
    if (timeRange === "3 Jahre") monthsToShow = 36;
    else if (timeRange === "2 Jahre") monthsToShow = 24;
    else if (timeRange === "1 Jahr") monthsToShow = 12;
    else if (timeRange === "6 Monate") monthsToShow = 6;

    // Simple implementation - just return a subset based on the time range
    if (monthsToShow >= 36) return dataUpToLastExam;
    if (monthsToShow >= 24) return dataUpToLastExam.slice(-6);
    if (monthsToShow >= 12) return dataUpToLastExam.slice(-4);
    return dataUpToLastExam.slice(-2);
  };

  // Update the renderParameter function to pass the highlightedDate and onDataPointHover
  const renderParameter = () => {
    const chartData = getChartData(selectedParameter) as Array<{
      date: string;
      left: number;
      right: number;
      source: string;
      doctor: string;
    }>;
    const filteredData = filterDataByTimeRange(chartData);
    const parameterData = patientData.measurements[selectedParameter];

    switch (selectedParameter) {
      case "visus":
        return (
          <ParameterChart
            data={filteredData}
            selectedEyes={selectedEyes}
            showNormalRange={showNormalRange}
            normalRange={parameterData.normalRange}
            yAxis={{
              min: 0,
              max: 2,
              stepSize: 0.25
            }}
            unit={parameterData.unit}
            chartType="line"
            showDataPoints={true}
            showDataLabels={false}
            smoothLines={false}
            colorTheme="default"
            showGrid={true}
            showLegend={true}
            enableAnimation={true}
            onDataPointHover={date => setHighlightedDate(date)}
            dataSource={parameterData.source}
            doctor={parameterData.doctor}
          />
        );
      case "netzhautdicke":
        return (
          <ParameterChart
            data={filteredData}
            selectedEyes={selectedEyes}
            showNormalRange={showNormalRange}
            normalRange={parameterData.normalRange}
            yAxis={{
              min: 100,
              max: 500,
              stepSize: 50
            }}
            unit={parameterData.unit}
            chartType="line"
            showDataPoints={true}
            showDataLabels={false}
            smoothLines={false}
            colorTheme="default"
            showGrid={true}
            showLegend={true}
            enableAnimation={true}
            onDataPointHover={date => setHighlightedDate(date)}
            dataSource={parameterData.source}
            doctor={parameterData.doctor}
          />
        );
      case "augeninnendruck":
        return (
          <ParameterChart
            data={filteredData}
            selectedEyes={selectedEyes}
            showNormalRange={showNormalRange}
            normalRange={parameterData.normalRange}
            yAxis={{
              min: 0,
              max: 40,
              stepSize: 5
            }}
            unit={parameterData.unit}
            chartType="line"
            showDataPoints={true}
            showDataLabels={false}
            smoothLines={false}
            colorTheme="default"
            showGrid={true}
            showLegend={true}
            enableAnimation={true}
            onDataPointHover={date => setHighlightedDate(date)}
            dataSource={parameterData.source}
            doctor={parameterData.doctor}
          />
        );
    }
  };

  return (
    <div className="space-y-6 p-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Therapieverlauf</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          22.12.2023
        </div>
      </div>

      {/* Treatment History Table - Now with max height and scrolling */}
      <Card className="relative z-10">
        <CardContent className="p-6">
          <div className="relative">
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead>Datum</TableHead>
                    <TableHead>OPS-Code</TableHead>
                    <TableHead className="w-[40%]">
                      Ophthalmologische Behandlung
                    </TableHead>
                    <TableHead>Seite</TableHead>
                    <TableHead>Medikament</TableHead>
                    <TableHead>Dosis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientData.treatments.map((treatment, index) => (
                    <TableRow
                      key={index}
                      className={cn(
                        highlightedDate &&
                          patientData.formatDate.datesMatch(
                            highlightedDate,
                            treatment.date
                          ) &&
                          "bg-yellow-50 dark:bg-yellow-900/20",
                        "transition-colors duration-200"
                      )}
                    >
                      <TableCell>{treatment.date}</TableCell>
                      <TableCell>{treatment.opsCode}</TableCell>
                      <TableCell>{treatment.treatment}</TableCell>
                      <TableCell>{treatment.side}</TableCell>
                      <TableCell>{treatment.medication}</TableCell>
                      <TableCell>{treatment.dosage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Selection and Chart - Now with upward expansion */}
      <div
        ref={chartContainerRef}
        className="relative z-20"
        style={{
          marginTop: `${chartTop}px`,
          transition: isDragging.current ? "none" : "margin-top 0.3s ease-out"
        }}
      >
        {/* Resize Handle - Now at the top */}
        <div
          ref={resizeRef}
          className="h-2 cursor-ns-resize flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-t-md"
          onMouseDown={handleMouseDown}
        >
          <ChevronUp className="h-4 w-4 text-gray-600" />
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">
                    Letzter angezeigter Untersuchungszeitpunkt:
                  </Label>
                  <Select value={lastExamDate} onValueChange={setLastExamDate}>
                    <SelectTrigger className="w-[120px]">
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
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">
                    Angezeigter Zeitraum:
                  </Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 Jahre">3 Jahre</SelectItem>
                      <SelectItem value="2 Jahre">2 Jahre</SelectItem>
                      <SelectItem value="1 Jahr">1 Jahr</SelectItem>
                      <SelectItem value="6 Monate">6 Monate</SelectItem>
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

            <div className="space-y-4">
              <div className="flex gap-4 h-full">
                <div className="w-48 space-y-2">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      selectedParameter === "visus" &&
                        "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => setSelectedParameter("visus")}
                  >
                    Visus
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      selectedParameter === "augeninnendruck" &&
                        "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => setSelectedParameter("augeninnendruck")}
                  >
                    Augeninnendruck
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      selectedParameter === "netzhautdicke" &&
                        "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => setSelectedParameter("netzhautdicke")}
                  >
                    Netzhautdicke
                  </Button>
                </div>
                <div className="flex-1">{renderParameter()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
