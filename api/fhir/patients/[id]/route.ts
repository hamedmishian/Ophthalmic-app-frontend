import { type NextRequest, NextResponse } from "next/server"
import { fhirPatientData } from "@/data/fhir-patient-data"
import { FHIRValidator } from "@/lib/fhir-validation"

// GET /api/fhir/patients/[id] - Get patient by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // In a real implementation, you would fetch from a FHIR server
    // For now, we'll return our mock data if the ID matches
    if (patientId === fhirPatientData.patient.id) {
      // Validate the patient data before returning
      const validation = FHIRValidator.validatePatient(fhirPatientData.patient)

      if (!validation.isValid) {
        return NextResponse.json(
          {
            error: "Invalid FHIR Patient resource",
            details: validation.errors,
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        resourceType: "Patient",
        ...fhirPatientData.patient,
        meta: {
          lastUpdated: new Date().toISOString(),
          versionId: "1",
        },
      })
    }

    return NextResponse.json({ error: "Patient not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/fhir/patients/[id] - Update patient
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const updatedPatient = await request.json()

    // Validate the updated patient data
    const validation = FHIRValidator.validatePatient(updatedPatient)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid FHIR Patient resource",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    // In a real implementation, you would update the patient in your FHIR server
    // For now, we'll just return the updated patient with metadata
    return NextResponse.json({
      ...updatedPatient,
      meta: {
        lastUpdated: new Date().toISOString(),
        versionId: "2",
      },
    })
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
