// FHIR Validation utilities
// Based on FHIR R4 specification

import type {
  FHIRPatient,
  FHIRObservation,
  FHIRCondition,
  FHIRMedicationStatement,
  FHIRProcedure,
  FHIRAllergyIntolerance,
  FHIRDiagnosticReport,
} from "@/data/fhir-patient-data"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class FHIRValidator {
  // Validate Patient resource
  static validatePatient(patient: FHIRPatient): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!patient.resourceType || patient.resourceType !== "Patient") {
      errors.push("Patient must have resourceType 'Patient'")
    }

    if (!patient.id) {
      errors.push("Patient must have an id")
    }

    if (!patient.active) {
      warnings.push("Patient active status should be specified")
    }

    // Validate identifiers
    if (!patient.identifier || patient.identifier.length === 0) {
      warnings.push("Patient should have at least one identifier")
    } else {
      patient.identifier.forEach((identifier, index) => {
        if (!identifier.value) {
          errors.push(`Patient identifier[${index}] must have a value`)
        }
        if (!identifier.type?.coding?.[0]?.code) {
          warnings.push(`Patient identifier[${index}] should have a type`)
        }
      })
    }

    // Validate name
    if (!patient.name || patient.name.length === 0) {
      errors.push("Patient must have at least one name")
    } else {
      patient.name.forEach((name, index) => {
        if (!name.family) {
          errors.push(`Patient name[${index}] must have a family name`)
        }
        if (!name.given || name.given.length === 0) {
          warnings.push(`Patient name[${index}] should have given names`)
        }
      })
    }

    // Validate gender
    if (!patient.gender) {
      warnings.push("Patient should have a gender specified")
    } else if (!["male", "female", "other", "unknown"].includes(patient.gender)) {
      errors.push("Patient gender must be one of: male, female, other, unknown")
    }

    // Validate birth date
    if (!patient.birthDate) {
      warnings.push("Patient should have a birth date")
    } else {
      const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!birthDateRegex.test(patient.birthDate)) {
        errors.push("Patient birthDate must be in YYYY-MM-DD format")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate Observation resource
  static validateObservation(observation: FHIRObservation): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!observation.resourceType || observation.resourceType !== "Observation") {
      errors.push("Observation must have resourceType 'Observation'")
    }

    if (!observation.id) {
      errors.push("Observation must have an id")
    }

    if (!observation.status) {
      errors.push("Observation must have a status")
    } else if (
      !["registered", "preliminary", "final", "amended", "corrected", "cancelled"].includes(observation.status)
    ) {
      errors.push("Observation status must be one of: registered, preliminary, final, amended, corrected, cancelled")
    }

    // Validate code
    if (!observation.code?.coding?.[0]?.code) {
      errors.push("Observation must have a code")
    }

    // Validate subject
    if (!observation.subject?.reference) {
      errors.push("Observation must have a subject reference")
    }

    // Validate effective date
    if (!observation.effectiveDateTime) {
      errors.push("Observation must have an effectiveDateTime")
    } else {
      try {
        new Date(observation.effectiveDateTime)
      } catch {
        errors.push("Observation effectiveDateTime must be a valid ISO 8601 date")
      }
    }

    // Validate value (either valueQuantity or valueCodeableConcept)
    if (!observation.valueQuantity && !observation.valueCodeableConcept) {
      warnings.push("Observation should have either valueQuantity or valueCodeableConcept")
    }

    if (observation.valueQuantity) {
      if (typeof observation.valueQuantity.value !== "number") {
        errors.push("Observation valueQuantity.value must be a number")
      }
      if (!observation.valueQuantity.unit) {
        warnings.push("Observation valueQuantity should have a unit")
      }
    }

    // Validate performer
    if (!observation.performer || observation.performer.length === 0) {
      warnings.push("Observation should have at least one performer")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate Condition resource
  static validateCondition(condition: FHIRCondition): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!condition.resourceType || condition.resourceType !== "Condition") {
      errors.push("Condition must have resourceType 'Condition'")
    }

    if (!condition.id) {
      errors.push("Condition must have an id")
    }

    // Validate clinical status
    if (!condition.clinicalStatus?.coding?.[0]?.code) {
      errors.push("Condition must have a clinicalStatus")
    }

    // Validate verification status
    if (!condition.verificationStatus?.coding?.[0]?.code) {
      errors.push("Condition must have a verificationStatus")
    }

    // Validate code
    if (!condition.code?.coding?.[0]?.code) {
      errors.push("Condition must have a code")
    }

    // Validate subject
    if (!condition.subject?.reference) {
      errors.push("Condition must have a subject reference")
    }

    // Validate recorded date
    if (!condition.recordedDate) {
      warnings.push("Condition should have a recordedDate")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate MedicationStatement resource
  static validateMedicationStatement(medication: FHIRMedicationStatement): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!medication.resourceType || medication.resourceType !== "MedicationStatement") {
      errors.push("MedicationStatement must have resourceType 'MedicationStatement'")
    }

    if (!medication.id) {
      errors.push("MedicationStatement must have an id")
    }

    if (!medication.status) {
      errors.push("MedicationStatement must have a status")
    } else if (
      !["active", "completed", "entered-in-error", "intended", "stopped", "on-hold"].includes(medication.status)
    ) {
      errors.push(
        "MedicationStatement status must be one of: active, completed, entered-in-error, intended, stopped, on-hold",
      )
    }

    // Validate medication
    if (!medication.medicationCodeableConcept?.coding?.[0]?.code) {
      errors.push("MedicationStatement must have a medicationCodeableConcept")
    }

    // Validate subject
    if (!medication.subject?.reference) {
      errors.push("MedicationStatement must have a subject reference")
    }

    // Validate effective date
    if (!medication.effectiveDateTime) {
      warnings.push("MedicationStatement should have an effectiveDateTime")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate Procedure resource
  static validateProcedure(procedure: FHIRProcedure): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!procedure.resourceType || procedure.resourceType !== "Procedure") {
      errors.push("Procedure must have resourceType 'Procedure'")
    }

    if (!procedure.id) {
      errors.push("Procedure must have an id")
    }

    if (!procedure.status) {
      errors.push("Procedure must have a status")
    } else if (
      !["preparation", "in-progress", "not-done", "on-hold", "stopped", "completed"].includes(procedure.status)
    ) {
      errors.push("Procedure status must be one of: preparation, in-progress, not-done, on-hold, stopped, completed")
    }

    // Validate code
    if (!procedure.code?.coding?.[0]?.code) {
      errors.push("Procedure must have a code")
    }

    // Validate subject
    if (!procedure.subject?.reference) {
      errors.push("Procedure must have a subject reference")
    }

    // Validate performed date
    if (!procedure.performedDateTime) {
      warnings.push("Procedure should have a performedDateTime")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate AllergyIntolerance resource
  static validateAllergyIntolerance(allergy: FHIRAllergyIntolerance): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!allergy.resourceType || allergy.resourceType !== "AllergyIntolerance") {
      errors.push("AllergyIntolerance must have resourceType 'AllergyIntolerance'")
    }

    if (!allergy.id) {
      errors.push("AllergyIntolerance must have an id")
    }

    // Validate clinical status
    if (!allergy.clinicalStatus?.coding?.[0]?.code) {
      errors.push("AllergyIntolerance must have a clinicalStatus")
    }

    // Validate verification status
    if (!allergy.verificationStatus?.coding?.[0]?.code) {
      errors.push("AllergyIntolerance must have a verificationStatus")
    }

    // Validate code
    if (!allergy.code?.coding?.[0]?.code) {
      errors.push("AllergyIntolerance must have a code")
    }

    // Validate patient
    if (!allergy.patient?.reference) {
      errors.push("AllergyIntolerance must have a patient reference")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate DiagnosticReport resource
  static validateDiagnosticReport(report: FHIRDiagnosticReport): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!report.resourceType || report.resourceType !== "DiagnosticReport") {
      errors.push("DiagnosticReport must have resourceType 'DiagnosticReport'")
    }

    if (!report.id) {
      errors.push("DiagnosticReport must have an id")
    }

    if (!report.status) {
      errors.push("DiagnosticReport must have a status")
    } else if (
      !["registered", "partial", "preliminary", "final", "amended", "corrected", "appended", "cancelled"].includes(
        report.status,
      )
    ) {
      errors.push(
        "DiagnosticReport status must be one of: registered, partial, preliminary, final, amended, corrected, appended, cancelled",
      )
    }

    // Validate code
    if (!report.code?.coding?.[0]?.code) {
      errors.push("DiagnosticReport must have a code")
    }

    // Validate subject
    if (!report.subject?.reference) {
      errors.push("DiagnosticReport must have a subject reference")
    }

    // Validate effective date
    if (!report.effectiveDateTime) {
      warnings.push("DiagnosticReport should have an effectiveDateTime")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Validate entire patient bundle
  static validatePatientBundle(data: {
    patient: FHIRPatient
    observations: FHIRObservation[]
    conditions: FHIRCondition[]
    medications: FHIRMedicationStatement[]
    procedures: FHIRProcedure[]
    allergies: FHIRAllergyIntolerance[]
    diagnosticReports: FHIRDiagnosticReport[]
  }): ValidationResult {
    const allErrors: string[] = []
    const allWarnings: string[] = []

    // Validate patient
    const patientValidation = this.validatePatient(data.patient)
    allErrors.push(...patientValidation.errors.map((e) => `Patient: ${e}`))
    allWarnings.push(...patientValidation.warnings.map((w) => `Patient: ${w}`))

    // Validate observations
    data.observations.forEach((obs, index) => {
      const validation = this.validateObservation(obs)
      allErrors.push(...validation.errors.map((e) => `Observation[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `Observation[${index}]: ${w}`))
    })

    // Validate conditions
    data.conditions.forEach((condition, index) => {
      const validation = this.validateCondition(condition)
      allErrors.push(...validation.errors.map((e) => `Condition[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `Condition[${index}]: ${w}`))
    })

    // Validate medications
    data.medications.forEach((medication, index) => {
      const validation = this.validateMedicationStatement(medication)
      allErrors.push(...validation.errors.map((e) => `MedicationStatement[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `MedicationStatement[${index}]: ${w}`))
    })

    // Validate procedures
    data.procedures.forEach((procedure, index) => {
      const validation = this.validateProcedure(procedure)
      allErrors.push(...validation.errors.map((e) => `Procedure[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `Procedure[${index}]: ${w}`))
    })

    // Validate allergies
    data.allergies.forEach((allergy, index) => {
      const validation = this.validateAllergyIntolerance(allergy)
      allErrors.push(...validation.errors.map((e) => `AllergyIntolerance[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `AllergyIntolerance[${index}]: ${w}`))
    })

    // Validate diagnostic reports
    data.diagnosticReports.forEach((report, index) => {
      const validation = this.validateDiagnosticReport(report)
      allErrors.push(...validation.errors.map((e) => `DiagnosticReport[${index}]: ${e}`))
      allWarnings.push(...validation.warnings.map((w) => `DiagnosticReport[${index}]: ${w}`))
    })

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    }
  }
}

// Utility function to validate and log results
export function validateAndLog(data: any): boolean {
  const validation = FHIRValidator.validatePatientBundle(data)

  if (validation.errors.length > 0) {
    console.error("FHIR Validation Errors:", validation.errors)
  }

  if (validation.warnings.length > 0) {
    console.warn("FHIR Validation Warnings:", validation.warnings)
  }

  if (validation.isValid) {
    console.log("✅ FHIR data is valid")
  } else {
    console.error("❌ FHIR data validation failed")
  }

  return validation.isValid
}
