// FHIR-compliant patient data structure
// Based on FHIR R4 specification

export interface FHIRPatient {
  resourceType: "Patient"
  id: string
  identifier: Array<{
    use: "usual" | "official" | "temp" | "secondary"
    type: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    value: string
  }>
  active: boolean
  name: Array<{
    use: "usual" | "official" | "temp" | "nickname" | "anonymous" | "old" | "maiden"
    family: string
    given: string[]
  }>
  gender: "male" | "female" | "other" | "unknown"
  birthDate: string // YYYY-MM-DD format
  address?: Array<{
    use: "home" | "work" | "temp" | "old" | "billing"
    line: string[]
    city: string
    postalCode: string
    country: string
  }>
}

export interface FHIRObservation {
  resourceType: "Observation"
  id: string
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled"
  category: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime: string // ISO 8601 format
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
  valueCodeableConcept?: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  bodySite?: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  performer: Array<{
    reference: string
    display: string
  }>
  referenceRange?: Array<{
    low?: {
      value: number
      unit: string
    }
    high?: {
      value: number
      unit: string
    }
    text?: string
  }>
}

export interface FHIRProcedure {
  resourceType: "Procedure"
  id: string
  status: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed"
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  performedDateTime: string
  performer: Array<{
    actor: {
      reference: string
      display: string
    }
  }>
  bodySite?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  note?: Array<{
    text: string
  }>
  usedCode?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
}

export interface FHIRCondition {
  resourceType: "Condition"
  id: string
  clinicalStatus: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  verificationStatus: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  onsetDateTime?: string
  recordedDate: string
}

export interface FHIRMedicationStatement {
  resourceType: "MedicationStatement"
  id: string
  status: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold"
  medicationCodeableConcept: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime: string
  dosage?: Array<{
    text: string
    doseAndRate?: Array<{
      doseQuantity: {
        value: number
        unit: string
      }
    }>
  }>
}

export interface FHIRAllergyIntolerance {
  resourceType: "AllergyIntolerance"
  id: string
  clinicalStatus: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  verificationStatus: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  patient: {
    reference: string
  }
  recordedDate: string
  reaction?: Array<{
    substance?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    manifestation: Array<{
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }>
    severity?: "mild" | "moderate" | "severe"
  }>
}

export interface FHIRDiagnosticReport {
  resourceType: "DiagnosticReport"
  id: string
  status: "registered" | "partial" | "preliminary" | "final" | "amended" | "corrected" | "appended" | "cancelled"
  category: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime: string
  issued: string
  performer: Array<{
    reference: string
    display: string
  }>
  result?: Array<{
    reference: string
  }>
  conclusion?: string
}

// FHIR observation codes for different parameters
export const FHIR_CODES = {
  VISUS_LEFT: "79893-4",
  VISUS_RIGHT: "79892-6",
  IOP_LEFT: "71484-0", // Intraocular pressure left eye
  IOP_RIGHT: "71485-7", // Intraocular pressure right eye
  RETINAL_THICKNESS_LEFT: "LA26772-1", // Custom LOINC for retinal thickness left
  RETINAL_THICKNESS_RIGHT: "LA26772-2", // Custom LOINC for retinal thickness right
  DRIL_LEFT: "LA26773-1", // Custom LOINC for DRIL left
  DRIL_RIGHT: "LA26773-2", // Custom LOINC for DRIL right
  HBA1C: "4548-4",
  HS_CRP: "30522-7",
  BLOOD_PRESSURE_SYSTOLIC: "8480-6",
  BLOOD_PRESSURE_DIASTOLIC: "8462-4",
} as const

// Generate complete FHIR observations for all dates and parameters
const generateObservations = (): FHIRObservation[] => {
  const observations: FHIRObservation[] = []
  const dates = [
    "2022-01-15",
    "2022-04-15",
    "2022-07-15",
    "2022-10-15",
    "2023-01-15",
    "2023-04-15",
    "2023-07-15",
    "2023-10-15",
  ]

  // Visus data
  const visusLeftValues = [0.6, 0.5, 0.4, 0.35, 0.4, 0.45, 0.5, 0.55]
  const visusRightValues = [0.55, 0.5, 0.45, 0.4, 0.45, 0.5, 0.45, 0.4]

  // IOP data
  const iopLeftValues = [18, 19, 20, 18, 17, 18, 19, 18]
  const iopRightValues = [17, 18, 19, 17, 16, 17, 18, 17]

  // HbA1c data
  const hba1cValues = [7.2, 7.0, 6.9, 6.8, 6.7, 6.6, 6.7, 6.7]

  // Blood pressure data
  const systolicValues = [145, 140, 138, 135, 132, 130, 132, 132]
  const diastolicValues = [95, 92, 90, 88, 88, 85, 88, 88]

  dates.forEach((date, index) => {
    // Visus Left
    observations.push({
      resourceType: "Observation",
      id: `obs-visus-left-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "survey",
              display: "Survey",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.VISUS_LEFT,
            display: "Left eye visual acuity",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: visusLeftValues[index],
        unit: "decimal",
        system: "http://unitsofmeasure.org",
        code: "1",
      },
      bodySite: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "8966001",
            display: "Left eye",
          },
        ],
      },
      performer: [
        {
          reference: "Practitioner/dr-mueller",
          display: "Dr. Erwin Müller",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 0.2,
            unit: "decimal",
          },
          high: {
            value: 0.8,
            unit: "decimal",
          },
        },
      ],
    })

    // Visus Right
    observations.push({
      resourceType: "Observation",
      id: `obs-visus-right-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "survey",
              display: "Survey",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.VISUS_RIGHT,
            display: "Right eye visual acuity",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: visusRightValues[index],
        unit: "decimal",
        system: "http://unitsofmeasure.org",
        code: "1",
      },
      bodySite: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "18944008",
            display: "Right eye",
          },
        ],
      },
      performer: [
        {
          reference: "Practitioner/dr-mueller",
          display: "Dr. Erwin Müller",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 0.2,
            unit: "decimal",
          },
          high: {
            value: 0.8,
            unit: "decimal",
          },
        },
      ],
    })

    // IOP Left
    observations.push({
      resourceType: "Observation",
      id: `obs-iop-left-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.IOP_LEFT,
            display: "Intraocular pressure of left eye",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: iopLeftValues[index],
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
      bodySite: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "8966001",
            display: "Left eye",
          },
        ],
      },
      performer: [
        {
          reference: "Practitioner/dr-mueller",
          display: "Dr. Erwin Müller",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 10,
            unit: "mmHg",
          },
          high: {
            value: 21,
            unit: "mmHg",
          },
        },
      ],
    })

    // IOP Right
    observations.push({
      resourceType: "Observation",
      id: `obs-iop-right-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.IOP_RIGHT,
            display: "Intraocular pressure of right eye",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: iopRightValues[index],
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
      bodySite: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "18944008",
            display: "Right eye",
          },
        ],
      },
      performer: [
        {
          reference: "Practitioner/dr-mueller",
          display: "Dr. Erwin Müller",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 10,
            unit: "mmHg",
          },
          high: {
            value: 21,
            unit: "mmHg",
          },
        },
      ],
    })

    // HbA1c
    observations.push({
      resourceType: "Observation",
      id: `obs-hba1c-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "laboratory",
              display: "Laboratory",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.HBA1C,
            display: "Hemoglobin A1c/Hemoglobin.total in Blood",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: hba1cValues[index],
        unit: "%",
        system: "http://unitsofmeasure.org",
        code: "%",
      },
      performer: [
        {
          reference: "Practitioner/dr-schmidt",
          display: "Dr. Maria Schmidt",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 6.0,
            unit: "%",
          },
          high: {
            value: 8.0,
            unit: "%",
          },
        },
      ],
    })

    // Blood Pressure Systolic
    observations.push({
      resourceType: "Observation",
      id: `obs-bp-systolic-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.BLOOD_PRESSURE_SYSTOLIC,
            display: "Systolic blood pressure",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: systolicValues[index],
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
      performer: [
        {
          reference: "Practitioner/dr-schmidt",
          display: "Dr. Maria Schmidt",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 115,
            unit: "mmHg",
          },
          high: {
            value: 155,
            unit: "mmHg",
          },
        },
      ],
    })

    // Blood Pressure Diastolic
    observations.push({
      resourceType: "Observation",
      id: `obs-bp-diastolic-${index + 1}`,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: FHIR_CODES.BLOOD_PRESSURE_DIASTOLIC,
            display: "Diastolic blood pressure",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: `${date}T10:00:00Z`,
      valueQuantity: {
        value: diastolicValues[index],
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
      performer: [
        {
          reference: "Practitioner/dr-schmidt",
          display: "Dr. Maria Schmidt",
        },
      ],
      referenceRange: [
        {
          low: {
            value: 60,
            unit: "mmHg",
          },
          high: {
            value: 100,
            unit: "mmHg",
          },
        },
      ],
    })
  })

  return observations
}

// Complete FHIR-compliant patient data
export const fhirPatientData = {
  patient: {
    resourceType: "Patient" as const,
    id: "patient-1",
    identifier: [
      {
        use: "official" as const,
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR",
              display: "Medical Record Number",
            },
          ],
        },
        value: "XXX74398",
      },
    ],
    active: true,
    name: [
      {
        use: "official" as const,
        family: "Becker",
        given: ["Michael"],
      },
    ],
    gender: "male" as const,
    birthDate: "1965-12-08",
    address: [
      {
        use: "home" as const,
        line: ["Musterstraße 123"],
        city: "Berlin",
        postalCode: "10115",
        country: "DE",
      },
    ],
  } as FHIRPatient,

  conditions: [
    {
      resourceType: "Condition" as const,
      id: "condition-1",
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: "active",
            display: "Active",
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: "confirmed",
            display: "Confirmed",
          },
        ],
      },
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "44054006",
            display: "Diabetes mellitus type 2",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      onsetDateTime: "2010-01-01",
      recordedDate: "2010-01-01",
    },
    {
      resourceType: "Condition" as const,
      id: "condition-2",
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: "active",
            display: "Active",
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: "confirmed",
            display: "Confirmed",
          },
        ],
      },
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "38341003",
            display: "Essential hypertension",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      recordedDate: "2015-01-01",
    },
  ] as FHIRCondition[],

  allergies: [
    {
      resourceType: "AllergyIntolerance" as const,
      id: "allergy-1",
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
            code: "active",
            display: "Active",
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
            code: "confirmed",
            display: "Confirmed",
          },
        ],
      },
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "716186003",
            display: "No known allergy",
          },
        ],
      },
      patient: {
        reference: "Patient/patient-1",
      },
      recordedDate: "2022-01-01",
    },
  ] as FHIRAllergyIntolerance[],

  medications: [
    {
      resourceType: "MedicationStatement" as const,
      id: "medication-1",
      status: "active" as const,
      medicationCodeableConcept: {
        coding: [
          {
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: "1551291",
            display: "Aflibercept",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2022-01-01",
      dosage: [
        {
          text: "2 mg intravitreal injection",
          doseAndRate: [
            {
              doseQuantity: {
                value: 2,
                unit: "mg",
              },
            },
          ],
        },
      ],
    },
    {
      resourceType: "MedicationStatement" as const,
      id: "medication-2",
      status: "active" as const,
      medicationCodeableConcept: {
        coding: [
          {
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: "6809",
            display: "Metformin",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2010-01-01",
    },
    {
      resourceType: "MedicationStatement" as const,
      id: "medication-3",
      status: "active" as const,
      medicationCodeableConcept: {
        coding: [
          {
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: "35208",
            display: "Ramipril",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2015-01-01",
    },
  ] as FHIRMedicationStatement[],

  observations: generateObservations(),

  diagnosticReports: [
    {
      resourceType: "DiagnosticReport" as const,
      id: "report-1",
      status: "final" as const,
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "LAB",
              display: "Laboratory",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "33747-0",
            display: "General chemistry study",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2022-01-15T10:00:00Z",
      issued: "2022-01-15T14:00:00Z",
      performer: [
        {
          reference: "Practitioner/dr-schmidt",
          display: "Dr. Maria Schmidt",
        },
      ],
      result: [
        {
          reference: "Observation/obs-hba1c-1",
        },
      ],
      conclusion: "HbA1c levels indicate good diabetic control.",
    },
    {
      resourceType: "DiagnosticReport" as const,
      id: "report-2",
      status: "final" as const,
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "OPH",
              display: "Ophthalmology",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "252779009",
            display: "Ophthalmic examination",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2022-01-15T10:00:00Z",
      issued: "2022-01-15T11:00:00Z",
      performer: [
        {
          reference: "Practitioner/dr-mueller",
          display: "Dr. Erwin Müller",
        },
      ],
      result: [
        {
          reference: "Observation/obs-visus-left-1",
        },
        {
          reference: "Observation/obs-visus-right-1",
        },
        {
          reference: "Observation/obs-iop-left-1",
        },
      ],
      conclusion: "Visual acuity stable, intraocular pressure within normal limits.",
    },
  ] as FHIRDiagnosticReport[],

  procedures: [
    {
      resourceType: "Procedure" as const,
      id: "procedure-1",
      status: "completed" as const,
      code: {
        coding: [
          {
            system: "http://www.cms.gov/Medicare/Coding/ICD10",
            code: "5-158.2",
            display: "Intravitreale Medikamentenabgabe mit kombinierter Laserbehandlung",
          },
        ],
      },
      subject: {
        reference: "Patient/patient-1",
      },
      performedDateTime: "2023-10-15T14:30:00Z",
      performer: [
        {
          actor: {
            reference: "Practitioner/dr-mueller",
            display: "Dr. Erwin Müller",
          },
        },
      ],
      bodySite: [
        {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "18944008",
              display: "Right eye",
            },
          ],
        },
      ],
      note: [
        {
          text: "Behandlung aufgrund erhöhter Netzhautdicke rechts",
        },
      ],
      usedCode: [
        {
          coding: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              code: "1551291",
              display: "Aflibercept 2 mg",
            },
          ],
        },
      ],
    },
  ] as FHIRProcedure[],
}

// FHIR Helper functions
export const fhirHelpers = {
  // Get patient display name
  getPatientName: (patient: FHIRPatient): string => {
    const name = patient.name?.[0]
    if (!name) return "Unknown Patient"
    return `${name.family}, ${name.given.join(" ")}`
  },

  // Get patient birth date in German format
  getPatientBirthDate: (patient: FHIRPatient): string => {
    if (!patient.birthDate) return "Unknown"
    const date = new Date(patient.birthDate)
    return date.toLocaleDateString("de-DE")
  },

  // Get patient ID
  getPatientId: (patient: FHIRPatient): string => {
    const mrn = patient.identifier?.find((id) => id.type?.coding?.some((coding) => coding.code === "MR"))
    return mrn?.value || patient.id
  },

  // Get observations by LOINC code
  getObservationsByCode: (observations: FHIRObservation[], loincCode: string): FHIRObservation[] => {
    return observations.filter((obs) =>
      obs.code.coding.some((coding) => coding.system === "http://loinc.org" && coding.code === loincCode),
    )
  },

  // Get observations by body site
  getObservationsByBodySite: (observations: FHIRObservation[], snomedCode: string): FHIRObservation[] => {
    return observations.filter((obs) =>
      obs.bodySite?.coding.some((coding) => coding.system === "http://snomed.info/sct" && coding.code === snomedCode),
    )
  },

  // Get observation value
  getObservationValue: (observation: FHIRObservation): number | null => {
    return observation.valueQuantity?.value || null
  },

  // Get observation unit
  getObservationUnit: (observation: FHIRObservation): string => {
    return observation.valueQuantity?.unit || ""
  },

  // Get observation date
  getObservationDate: (observation: FHIRObservation): Date => {
    return new Date(observation.effectiveDateTime)
  },

  // Get observation performer
  getObservationPerformer: (observation: FHIRObservation): string => {
    return observation.performer[0]?.display || "Unknown"
  },

  // Get observation reference range with proper null checking
  getObservationReferenceRange: (observation: FHIRObservation): { lower: number; upper: number } | null => {
    if (!observation.referenceRange || observation.referenceRange.length === 0) {
      return null
    }

    const range = observation.referenceRange[0]
    if (!range) {
      return null
    }

    // Check if both low and high values exist and have value properties
    if (!range.low?.value || !range.high?.value) {
      return null
    }

    return {
      lower: range.low.value,
      upper: range.high.value,
    }
  },

  // Get conditions display text
  getConditionsText: (conditions: FHIRCondition[]): string => {
    return conditions.map((condition) => condition.code.coding[0]?.display || "Unknown condition").join(", ")
  },

  // Get medications display text
  getMedicationsText: (medications: FHIRMedicationStatement[]): string => {
    return medications.map((med) => med.medicationCodeableConcept.coding[0]?.display || "Unknown medication").join(", ")
  },

  // Get allergies display text
  getAllergiesText: (allergies: FHIRAllergyIntolerance[]): string => {
    return allergies.map((allergy) => allergy.code.coding[0]?.display || "Unknown allergy").join(", ")
  },

  // Convert FHIR date to chart format (MM/YYYY)
  toChartDate: (fhirDate: string): string => {
    const date = new Date(fhirDate)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString()
    return `${month}/${year}`
  },

  // Convert FHIR date to display format (DD.MM.YYYY)
  toDisplayDate: (fhirDate: string): string => {
    const date = new Date(fhirDate)
    return date.toLocaleDateString("de-DE")
  },

  // Sort observations by date
  sortObservationsByDate: (observations: FHIRObservation[]): FHIRObservation[] => {
    return [...observations].sort(
      (a, b) => new Date(a.effectiveDateTime).getTime() - new Date(b.effectiveDateTime).getTime(),
    )
  },

  // Group observations by parameter and eye
  groupObservationsByParameter: (observations: FHIRObservation[]) => {
    const grouped: Record<string, { left: FHIRObservation[]; right: FHIRObservation[] }> = {}

    observations.forEach((obs) => {
      const loincCode = obs.code.coding.find((c) => c.system === "http://loinc.org")?.code
      if (!loincCode) return

      if (!grouped[loincCode]) {
        grouped[loincCode] = { left: [], right: [] }
      }

      const isLeftEye = obs.bodySite?.coding.some((c) => c.code === "8966001")
      const isRightEye = obs.bodySite?.coding.some((c) => c.code === "18944008")

      if (isLeftEye) {
        grouped[loincCode].left.push(obs)
      } else if (isRightEye) {
        grouped[loincCode].right.push(obs)
      } else {
        // For non-eye specific observations, add to both
        grouped[loincCode].left.push(obs)
        grouped[loincCode].right.push(obs)
      }
    })

    return grouped
  },
}

// FHIR-native chart data functions
export const getFHIRChartData = {
  // Get visus data
  getVisusData: () => {
    const leftObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.VISUS_LEFT)
    const rightObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.VISUS_RIGHT)

    const sortedLeft = fhirHelpers.sortObservationsByDate(leftObs)
    const sortedRight = fhirHelpers.sortObservationsByDate(rightObs)

    // Combine and create chart data
    const dates = Array.from(
      new Set([
        ...sortedLeft.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
        ...sortedRight.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
      ]),
    ).sort()

    return dates.map((date) => {
      const leftObs = sortedLeft.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)
      const rightObs = sortedRight.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)

      return {
        date,
        left: leftObs ? fhirHelpers.getObservationValue(leftObs) : null,
        right: rightObs ? fhirHelpers.getObservationValue(rightObs) : null,
        source: leftObs ? "Snellen-Tafel" : rightObs ? "Snellen-Tafel" : "Unknown",
        doctor: leftObs
          ? fhirHelpers.getObservationPerformer(leftObs)
          : rightObs
            ? fhirHelpers.getObservationPerformer(rightObs)
            : "Unknown",
      }
    })
  },

  // Get intraocular pressure data
  getIOPData: () => {
    const leftObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.IOP_LEFT)
    const rightObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.IOP_RIGHT)

    const sortedLeft = fhirHelpers.sortObservationsByDate(leftObs)
    const sortedRight = fhirHelpers.sortObservationsByDate(rightObs)

    const dates = Array.from(
      new Set([
        ...sortedLeft.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
        ...sortedRight.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
      ]),
    ).sort()

    return dates.map((date) => {
      const leftObs = sortedLeft.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)
      const rightObs = sortedRight.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)

      return {
        date,
        left: leftObs ? fhirHelpers.getObservationValue(leftObs) : null,
        right: rightObs ? fhirHelpers.getObservationValue(rightObs) : null,
        source: "Goldmann-Applanationstonometrie",
        doctor: leftObs
          ? fhirHelpers.getObservationPerformer(leftObs)
          : rightObs
            ? fhirHelpers.getObservationPerformer(rightObs)
            : "Unknown",
      }
    })
  },

  // Get HbA1c data
  getHbA1cData: () => {
    const observations = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.HBA1C)
    const sorted = fhirHelpers.sortObservationsByDate(observations)

    return sorted.map((obs) => ({
      date: fhirHelpers.toChartDate(obs.effectiveDateTime),
      value: fhirHelpers.getObservationValue(obs) || 0,
      source: "Laboruntersuchung",
      doctor: fhirHelpers.getObservationPerformer(obs),
    }))
  },

  // Get blood pressure data
  getBloodPressureData: () => {
    const systolicObs = fhirHelpers.getObservationsByCode(
      fhirPatientData.observations,
      FHIR_CODES.BLOOD_PRESSURE_SYSTOLIC,
    )
    const diastolicObs = fhirHelpers.getObservationsByCode(
      fhirPatientData.observations,
      FHIR_CODES.BLOOD_PRESSURE_DIASTOLIC,
    )

    const sortedSystolic = fhirHelpers.sortObservationsByDate(systolicObs)
    const sortedDiastolic = fhirHelpers.sortObservationsByDate(diastolicObs)

    const dates = Array.from(
      new Set([
        ...sortedSystolic.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
        ...sortedDiastolic.map((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime)),
      ]),
    ).sort()

    return dates.map((date) => {
      const systolicObs = sortedSystolic.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)
      const diastolicObs = sortedDiastolic.find((obs) => fhirHelpers.toChartDate(obs.effectiveDateTime) === date)

      return {
        date,
        systolic: systolicObs ? fhirHelpers.getObservationValue(systolicObs) : null,
        diastolic: diastolicObs ? fhirHelpers.getObservationValue(diastolicObs) : null,
        source: "Blutdruckmessung",
        doctor: systolicObs
          ? fhirHelpers.getObservationPerformer(systolicObs)
          : diastolicObs
            ? fhirHelpers.getObservationPerformer(diastolicObs)
            : "Unknown",
      }
    })
  },

  // Get reference ranges for parameters with fallback defaults
  getReferenceRanges: () => {
    const ranges: Record<string, any> = {
      // Default fallback ranges
      visus: { lower: 0.2, upper: 0.8 },
      augeninnendruck: { lower: 10, upper: 21 },
      hba1c: { lower: 6.0, upper: 8.0 },
      blutdruck: {
        systolic: { lower: 115, upper: 155 },
        diastolic: { lower: 60, upper: 100 },
      },
    }

    try {
      // Try to get reference ranges from FHIR observations
      const visusObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.VISUS_LEFT)[0]
      if (visusObs) {
        const range = fhirHelpers.getObservationReferenceRange(visusObs)
        if (range) ranges.visus = range
      }

      const iopObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.IOP_LEFT)[0]
      if (iopObs) {
        const range = fhirHelpers.getObservationReferenceRange(iopObs)
        if (range) ranges.augeninnendruck = range
      }

      const hba1cObs = fhirHelpers.getObservationsByCode(fhirPatientData.observations, FHIR_CODES.HBA1C)[0]
      if (hba1cObs) {
        const range = fhirHelpers.getObservationReferenceRange(hba1cObs)
        if (range) ranges.hba1c = range
      }

      const systolicObs = fhirHelpers.getObservationsByCode(
        fhirPatientData.observations,
        FHIR_CODES.BLOOD_PRESSURE_SYSTOLIC,
      )[0]
      const diastolicObs = fhirHelpers.getObservationsByCode(
        fhirPatientData.observations,
        FHIR_CODES.BLOOD_PRESSURE_DIASTOLIC,
      )[0]

      if (systolicObs && diastolicObs) {
        const systolicRange = fhirHelpers.getObservationReferenceRange(systolicObs)
        const diastolicRange = fhirHelpers.getObservationReferenceRange(diastolicObs)

        if (systolicRange && diastolicRange) {
          ranges.blutdruck = {
            systolic: systolicRange,
            diastolic: diastolicRange,
          }
        }
      }
    } catch (error) {
      console.warn("Error getting reference ranges from FHIR data, using defaults:", error)
    }

    return ranges
  },
}

// Export FHIR data as the main patient data
export const patientData = fhirPatientData
export const getChartData = getFHIRChartData
