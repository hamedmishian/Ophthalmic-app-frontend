import { type NextRequest, NextResponse } from "next/server"
import { fhirPatientData } from "@/data/fhir-patient-data"

// GET /api/fhir/search - FHIR-compliant search across resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get("_type")
    const patient = searchParams.get("patient")
    const subject = searchParams.get("subject")
    const code = searchParams.get("code")
    const status = searchParams.get("status")
    const count = Number.parseInt(searchParams.get("_count") || "50")
    const offset = Number.parseInt(searchParams.get("_offset") || "0")

    const results: any[] = []

    // Search across different resource types
    if (!resourceType || resourceType.includes("Patient")) {
      if (!patient || patient === fhirPatientData.patient.id) {
        results.push({
          resource: fhirPatientData.patient,
          search: { mode: "match" },
        })
      }
    }

    if (!resourceType || resourceType.includes("Observation")) {
      let observations = fhirPatientData.observations

      if (patient || subject) {
        const patientRef = patient || subject
        observations = observations.filter((obs) => obs.subject.reference.includes(patientRef))
      }

      if (code) {
        observations = observations.filter((obs) => obs.code.coding.some((coding) => coding.code.includes(code)))
      }

      if (status) {
        observations = observations.filter((obs) => obs.status === status)
      }

      results.push(
        ...observations.map((obs) => ({
          resource: obs,
          search: { mode: "match" },
        })),
      )
    }

    if (!resourceType || resourceType.includes("Condition")) {
      let conditions = fhirPatientData.conditions

      if (patient || subject) {
        const patientRef = patient || subject
        conditions = conditions.filter((condition) => condition.subject.reference.includes(patientRef))
      }

      results.push(
        ...conditions.map((condition) => ({
          resource: condition,
          search: { mode: "match" },
        })),
      )
    }

    if (!resourceType || resourceType.includes("MedicationStatement")) {
      let medications = fhirPatientData.medications

      if (patient || subject) {
        const patientRef = patient || subject
        medications = medications.filter((med) => med.subject.reference.includes(patientRef))
      }

      results.push(
        ...medications.map((med) => ({
          resource: med,
          search: { mode: "match" },
        })),
      )
    }

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + count)

    return NextResponse.json({
      resourceType: "Bundle",
      type: "searchset",
      total: results.length,
      entry: paginatedResults.map((result) => ({
        ...result,
        resource: {
          ...result.resource,
          meta: {
            lastUpdated: new Date().toISOString(),
            versionId: "1",
          },
        },
      })),
    })
  } catch (error) {
    console.error("Error in FHIR search:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
