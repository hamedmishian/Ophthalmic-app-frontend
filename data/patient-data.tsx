// Centralized mock data for patient with ID 1
// This file serves as a single source of truth for all patient data

// Common date format for all data: MM/YYYY for charts, DD.MM.YYYY for tables
export const patientData = {
  // Basic patient information
  info: {
    id: 1,
    name: "Becker, Michael",
    dob: "08.12.1965",
    patientId: "XXX74398",
    gender: "Male",
    medication: "Aflibercept, Metformin, Ramipril",
    diabeticConditions: "Diabetes mellitus Typ 2 (seit 2010)",
    cardiovascularConditions: "Arterielle Hypertonie",
    allergies: "Keine bekannt"
  },

  // Parameter measurements with consistent dates across all parameters
  measurements: {
    // Dates in MM/YYYY format for charts
    dates: [
      "01/2022",
      "04/2022",
      "07/2022",
      "10/2022",
      "01/2023",
      "04/2023",
      "07/2023",
      "10/2023"
    ],

    // Visus values (decimal)
    visus: {
      left: [0.6, 0.5, 0.4, 0.35, 0.4, 0.45, 0.5, 0.55],
      right: [0.55, 0.5, 0.45, 0.4, 0.45, 0.5, 0.45, 0.4],
      normalRange: { lower: 0.2, upper: 0.8 },
      unit: "",
      source: "Snellen-Tafel",
      doctor: "Dr. Erwin Müller"
    },

    // Augeninnendruck values (mmHg)
    augeninnendruck: {
      left: [18, 19, 20, 18, 17, 18, 19, 18],
      right: [17, 18, 19, 17, 16, 17, 18, 17],
      normalRange: { lower: 10, upper: 21 },
      unit: " mmHg",
      source: "Goldmann-Applanationstonometrie",
      doctor: "Dr. Erwin Müller"
    },

    // Netzhautdicke values (µm)
    netzhautdicke: {
      left: [300, 310, 320, 330, 340, 345, 350, 350],
      right: [320, 330, 340, 350, 360, 370, 380, 393],
      normalRange: { lower: 250, upper: 350 },
      unit: " µm",
      source: "OCT-Untersuchung",
      doctor: "Dr. Erwin Müller"
    },

    // DRIL (Disorganization of Retinal Inner Layers) - binary values (0 = not present, 1 = present)
    dril: {
      left: [0, 0, 1, 1, 1, 1, 1, 1],
      right: [0, 0, 0, 1, 1, 1, 0, 0],
      normalRange: { lower: 0, upper: 0 },
      unit: "",
      source: "OCT-Untersuchung",
      doctor: "Dr. Erwin Müller"
    },

    // HbA1c values (%)
    hba1c: {
      value: [7.2, 7.0, 6.9, 6.8, 6.7, 6.6, 6.7, 6.7],
      normalRange: { lower: 6.0, upper: 8.0 },
      unit: " %",
      source: "Laboruntersuchung",
      doctor: "Dr. Maria Schmidt"
    },

    // hs-CRP values (mg/l)
    hscrp: {
      value: [1.2, 1.1, 1.0, 0.9, 0.85, 0.8, 0.85, 0.85],
      normalRange: { lower: 0.0, upper: 0.5 },
      unit: " mg/l",
      source: "Laboruntersuchung",
      doctor: "Dr. Maria Schmidt"
    },

    // Blood pressure values (mmHg)
    blutdruck: {
      systolic: [145, 140, 138, 135, 132, 130, 132, 132],
      diastolic: [95, 92, 90, 88, 88, 85, 88, 88],
      normalRange: {
        systolic: { lower: 115, upper: 155 },
        diastolic: { lower: 60, upper: 100 }
      },
      unit: " mmHg",
      source: "Blutdruckmessung",
      doctor: "Dr. Maria Schmidt"
    }
  },

  // Treatment history with dates matching measurement dates
  // Dates in DD.MM.YYYY format for tables
  treatments: [
    {
      date: "15.10.2023",
      opsCode: "5-158.2",
      treatment:
        "Intravitreale Medikamentenabgabe mit kombinierter Laserbehandlung",
      side: "R",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Behandlung aufgrund erhöhter Netzhautdicke rechts"
    },
    {
      date: "20.07.2023",
      opsCode: "5-158.0",
      treatment: "Intravitreale Medikamentenabgabe",
      side: "B",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Routinebehandlung bei diabetischer Retinopathie"
    },
    {
      date: "18.04.2023",
      opsCode: "5-158.0",
      treatment: "Intravitreale Medikamentenabgabe",
      side: "B",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Verbesserung des Visus links erkennbar"
    },
    {
      date: "12.01.2023",
      opsCode: "5-158.0",
      treatment: "Intravitreale Medikamentenabgabe",
      side: "B",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Stabilisierung der Netzhautdicke links"
    },
    {
      date: "22.10.2022",
      opsCode: "5-152.1",
      treatment: "Kryokoagulation der Netzhaut",
      side: "R",
      medication: "",
      dosage: "",
      doctor: "Dr. Erwin Müller",
      notes: "Behandlung peripherer Netzhautveränderungen"
    },
    {
      date: "15.07.2022",
      opsCode: "5-158.0",
      treatment: "Intravitreale Medikamentenabgabe",
      side: "B",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Erhöhter Augeninnendruck links beobachtet"
    },
    {
      date: "20.04.2022",
      opsCode: "5-158.0",
      treatment: "Intravitreale Medikamentenabgabe",
      side: "B",
      medication: "Aflibercept",
      dosage: "2 mg",
      doctor: "Dr. Erwin Müller",
      notes: "Routinebehandlung bei diabetischer Retinopathie"
    },
    {
      date: "10.01.2022",
      opsCode: "5-131.01",
      treatment: "Pars-Plana-Vitrektomie mit Entfernung epiretinaler Membran",
      side: "B",
      medication: "Perfluorodekalin",
      dosage: "",
      doctor: "Dr. Erwin Müller",
      notes: "Erstbehandlung nach Diagnose diabetischer Retinopathie"
    }
  ],

  // Helper function to convert between date formats
  formatDate: {
    // Convert from MM/YYYY to DD.MM.YYYY (for display)
    toDisplayDate: (dateStr: string): string => {
      const [month, year] = dateStr.split("/");
      // Use the 15th of the month as a default day
      return `15.${month}.${year}`;
    },

    // Convert from DD.MM.YYYY to MM/YYYY (for chart data)
    toChartDate: (dateStr: string): string => {
      const [day, month, year] = dateStr.split(".");
      return `${month}/${year}`;
    },

    // Check if two dates match (one in MM/YYYY format, one in DD.MM.YYYY format)
    datesMatch: (chartDate: string, tableDate: string): boolean => {
      const [chartMonth, chartYear] = chartDate.split("/");
      const [tableDay, tableMonth, tableYear] = tableDate.split(".");
      return chartMonth === tableMonth && chartYear === tableYear;
    }
  }
};

type MeasurementParameter = keyof Omit<
  typeof patientData.measurements,
  "dates"
>;

type BilateralMeasurement = {
  left: number[];
  right: number[];
  normalRange: { lower: number; upper: number };
  unit: string;
  source: string;
  doctor: string;
};

type SingleValueMeasurement = {
  value: number[];
  normalRange: { lower: number; upper: number };
  unit: string;
  source: string;
  doctor: string;
};

type BloodPressureMeasurement = {
  systolic: number[];
  diastolic: number[];
  normalRange: {
    systolic: { lower: number; upper: number };
    diastolic: { lower: number; upper: number };
  };
  unit: string;
  source: string;
  doctor: string;
};

export function getChartData(parameterName: MeasurementParameter) {
  const { dates } = patientData.measurements;
  const parameterData = patientData.measurements[parameterName];

  if (!parameterData) return [];

  // Handle different parameter structures
  if (parameterName === "blutdruck") {
    const data = parameterData as BloodPressureMeasurement;
    return dates.map((date, index) => ({
      date,
      systolic: data.systolic[index],
      diastolic: data.diastolic[index],
      source: data.source,
      doctor: data.doctor
    }));
  } else if (parameterName === "hba1c" || parameterName === "hscrp") {
    const data = parameterData as SingleValueMeasurement;
    return dates.map((date, index) => ({
      date,
      value: data.value[index],
      source: data.source,
      doctor: data.doctor
    }));
  } else {
    const data = parameterData as BilateralMeasurement;
    return dates.map((date, index) => ({
      date,
      left: data.left[index],
      right: data.right[index],
      source: data.source,
      doctor: data.doctor
    }));
  }
}
