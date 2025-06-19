"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { patientData } from "@/data/patient-data";

// Define thresholds for critical values
const CRITICAL_THRESHOLDS = {
  visus: { min: 0.5 }, // Visus below 0.5 is critical
  augeninnendruck: { min: 10, max: 21 }, // Outside 10-21 mmHg is critical
  netzhautdicke: { min: 250, max: 350 }, // Outside 250-350 µm is critical
  dril: { max: 0 } // DRIL present (value 1) is critical
};

interface CriticalValue {
  parameter: string;
  side: string;
  value: string | number;
  formattedValue: string;
  delta?: string;
  date: string;
  year: string;
}

export function KritischeWerte() {
  const router = useRouter();
  const params = useParams();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const currentDate = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Extract years from the treatment dates
  const availableYears = useMemo(() => {
    const years = new Set<string>();

    // Add years from treatments
    patientData.treatments.forEach(treatment => {
      const year = treatment.date.split(".")[2];
      years.add(year);
    });

    // Add years from measurements
    patientData.measurements.dates.forEach(date => {
      const year = date.split("/")[1];
      years.add(year);
    });

    return Array.from(years).sort();
  }, []);

  // Generate critical values from patient data
  const allCriticalValues = useMemo(() => {
    const criticalValues: CriticalValue[] = [];

    // Process Visus values
    patientData.measurements.dates.forEach((date, index) => {
      const leftValue = patientData.measurements.visus.left[index];
      const rightValue = patientData.measurements.visus.right[index];
      const displayDate = patientData.formatDate.toDisplayDate(date);
      const year = date.split("/")[1];

      // Calculate deltas (change from previous measurement)
      const leftDelta =
        index > 0
          ? leftValue - patientData.measurements.visus.left[index - 1]
          : 0;
      const rightDelta =
        index > 0
          ? rightValue - patientData.measurements.visus.right[index - 1]
          : 0;

      // Check if values are critical
      if (leftValue < CRITICAL_THRESHOLDS.visus.min) {
        criticalValues.push({
          parameter: "Visus",
          side: "L",
          value: leftValue,
          formattedValue: leftValue.toFixed(2).replace(".", ","),
          delta: `Δ ${leftDelta.toFixed(2).replace(".", ",")}`,
          date: displayDate,
          year
        });
      }

      if (rightValue < CRITICAL_THRESHOLDS.visus.min) {
        criticalValues.push({
          parameter: "Visus",
          side: "R",
          value: rightValue,
          formattedValue: rightValue.toFixed(2).replace(".", ","),
          delta: `Δ ${rightDelta.toFixed(2).replace(".", ",")}`,
          date: displayDate,
          year
        });
      }
    });

    // Process Augeninnendruck values
    patientData.measurements.dates.forEach((date, index) => {
      const leftValue = patientData.measurements.augeninnendruck.left[index];
      const rightValue = patientData.measurements.augeninnendruck.right[index];
      const displayDate = patientData.formatDate.toDisplayDate(date);
      const year = date.split("/")[1];

      // Calculate deltas
      const leftDelta =
        index > 0
          ? leftValue - patientData.measurements.augeninnendruck.left[index - 1]
          : 0;
      const rightDelta =
        index > 0
          ? rightValue -
            patientData.measurements.augeninnendruck.right[index - 1]
          : 0;

      // Check if values are critical
      if (
        leftValue < CRITICAL_THRESHOLDS.augeninnendruck.min ||
        leftValue > CRITICAL_THRESHOLDS.augeninnendruck.max
      ) {
        criticalValues.push({
          parameter: "Augeninnendruck",
          side: "L",
          value: leftValue,
          formattedValue: `${leftValue} mmHg`,
          delta: `Δ ${leftDelta > 0 ? "+" : ""}${leftDelta} mmHg`,
          date: displayDate,
          year
        });
      }

      if (
        rightValue < CRITICAL_THRESHOLDS.augeninnendruck.min ||
        rightValue > CRITICAL_THRESHOLDS.augeninnendruck.max
      ) {
        criticalValues.push({
          parameter: "Augeninnendruck",
          side: "R",
          value: rightValue,
          formattedValue: `${rightValue} mmHg`,
          delta: `Δ ${rightDelta > 0 ? "+" : ""}${rightDelta} mmHg`,
          date: displayDate,
          year
        });
      }
    });

    // Process Netzhautdicke values
    patientData.measurements.dates.forEach((date, index) => {
      const leftValue = patientData.measurements.netzhautdicke.left[index];
      const rightValue = patientData.measurements.netzhautdicke.right[index];
      const displayDate = patientData.formatDate.toDisplayDate(date);
      const year = date.split("/")[1];

      // Calculate deltas
      const leftDelta =
        index > 0
          ? leftValue - patientData.measurements.netzhautdicke.left[index - 1]
          : 0;
      const rightDelta =
        index > 0
          ? rightValue - patientData.measurements.netzhautdicke.right[index - 1]
          : 0;

      // Check if values are critical
      if (
        leftValue < CRITICAL_THRESHOLDS.netzhautdicke.min ||
        leftValue > CRITICAL_THRESHOLDS.netzhautdicke.max
      ) {
        criticalValues.push({
          parameter: "Netzhautdicke",
          side: "L",
          value: leftValue,
          formattedValue: `${leftValue} µm`,
          delta: `Δ ${leftDelta > 0 ? "+" : ""}${leftDelta} µm`,
          date: displayDate,
          year
        });
      }

      if (
        rightValue < CRITICAL_THRESHOLDS.netzhautdicke.min ||
        rightValue > CRITICAL_THRESHOLDS.netzhautdicke.max
      ) {
        criticalValues.push({
          parameter: "Netzhautdicke",
          side: "R",
          value: rightValue,
          formattedValue: `${rightValue} µm`,
          delta: `Δ ${rightDelta > 0 ? "+" : ""}${rightDelta} µm`,
          date: displayDate,
          year
        });
      }
    });

    // Process DRIL values
    patientData.measurements.dates.forEach((date, index) => {
      const leftValue = patientData.measurements.dril.left[index];
      const rightValue = patientData.measurements.dril.right[index];
      const displayDate = patientData.formatDate.toDisplayDate(date);
      const year = date.split("/")[1];

      // Check if values are critical (DRIL present)
      if (leftValue > CRITICAL_THRESHOLDS.dril.max) {
        criticalValues.push({
          parameter: "DRIL",
          side: "L",
          value: leftValue,
          formattedValue: "vorhanden",
          date: displayDate,
          year
        });
      }

      if (rightValue > CRITICAL_THRESHOLDS.dril.max) {
        criticalValues.push({
          parameter: "DRIL",
          side: "R",
          value: rightValue,
          formattedValue: "vorhanden",
          date: displayDate,
          year
        });
      }
    });

    return criticalValues;
  }, []);

  // Filter critical values by selected year
  const filteredCriticalValues = useMemo(() => {
    if (!selectedYear) return allCriticalValues;
    return allCriticalValues.filter(value => value.year === selectedYear);
  }, [allCriticalValues, selectedYear]);

  // Group critical values by parameter
  const groupedCriticalValues = useMemo(() => {
    const grouped = new Map<string, CriticalValue[]>();

    // Initialize with all parameters to ensure we have entries even for empty ones
    const allParameters = [
      "Visus",
      "Augeninnendruck",
      "Netzhautdicke",
      "DRIL",
      "HIF",
      "VMT"
    ];
    allParameters.forEach(param => grouped.set(param, []));

    // Add filtered values
    filteredCriticalValues.forEach(value => {
      const paramValues = grouped.get(value.parameter) || [];
      paramValues.push(value);
      grouped.set(value.parameter, paramValues);
    });

    return grouped;
  }, [filteredCriticalValues]);

  const handleParameterClick = (parameter: string) => {
    router.push(
      `/patient/${params.id}?tab=parameter&parameter=${parameter.toLowerCase()}`
    );
  };

  const renderParameterRow = (parameter: string) => {
    const values = groupedCriticalValues.get(parameter) || [];

    if (values.length === 0) {
      return (
        <tr key={parameter} className="border-b dark:border-gray-700">
          <td className="p-4">{parameter}</td>
          <td className="p-4">-</td>
          <td className="p-4">-</td>
          <td className="p-4">-</td>
          <td className="p-4 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleParameterClick(parameter.toLowerCase())}
            >
              Zu den {parameter}-Werten
            </Button>
          </td>
        </tr>
      );
    }

    return values.map((value, index) => (
      <tr
        key={`${parameter}-${index}`}
        className="border-b dark:border-gray-700"
      >
        {index === 0 ? (
          <td className="p-4" rowSpan={values.length}>
            {parameter}
          </td>
        ) : null}
        <td className="p-4">{value.side}</td>
        <td className="p-4">
          {value.formattedValue}{" "}
          {value.delta && (
            <span className="text-gray-500">({value.delta})</span>
          )}
        </td>
        <td className="p-4">{value.date}</td>
        {index === 0 ? (
          <td className="p-4 text-right" rowSpan={values.length}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleParameterClick(parameter.toLowerCase())}
            >
              Zu den {parameter}-Werten
            </Button>
          </td>
        ) : null}
      </tr>
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Zusammengefasste Empfehlungen</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentDate}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={cn(
            "min-w-[4rem]",
            !selectedYear &&
              "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
          )}
          onClick={() => setSelectedYear(null)}
        >
          Alle
        </Button>
        {availableYears.map(year => (
          <Button
            key={year}
            variant="outline"
            className={cn(
              "min-w-[4rem]",
              selectedYear === year &&
                "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
            )}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="p-4 font-medium">Parameter</th>
                  <th className="p-4 font-medium">Seite</th>
                  <th className="p-4 font-medium">Kritische Werte</th>
                  <th className="p-4 font-medium">Datum</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {renderParameterRow("Visus")}
                {renderParameterRow("Augeninnendruck")}
                {renderParameterRow("Netzhautdicke")}
                {renderParameterRow("DRIL")}
                {renderParameterRow("HIF")}
                {renderParameterRow("VMT")}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
