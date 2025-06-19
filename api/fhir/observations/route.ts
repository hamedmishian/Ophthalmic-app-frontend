import { type NextRequest, NextResponse } from "next/server"
import { fhirPatientData } from "@/data/fhir-patient-data"
import { FHIRValidator } from "@/lib/fhir-validation"

// GET /api/fhir/observations - Search observations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patient = searchParams.get("patient")
    const code = searchParams.get("code")
    const category = searchParams.get("category")
    const date = searchParams.get("date")

    let observations = fhirPatientData.observations

    // Filter by patient
    if (patient) {
      observations = observations.filter(
        (obs) => obs.subject.reference === `Patient/${patient}` || obs.subject.reference === patient,
      )
    }

    // Filter by LOINC code
    if (code) {
      observations = observations.filter((obs) =>
        obs.code.coding.some((coding) => coding.system === "http://loinc.org" && coding.code === code),
      )
    }

    // Filter by category
    if (category) {
      observations = observations.filter((obs) =>
        obs.category.some((cat) => cat.coding.some((coding) => coding.code === category)),
      )
    }

    // Filter by date (simplified - in real implementation would support date ranges)
    if (date) {
      observations = observations.filter((obs) => obs.effectiveDateTime.startsWith(date))
    }

    // Validate observations before returning
    const validObservations = observations.filter((obs) => {
      const validation = FHIRValidator.validateObservation(obs)
      return validation.isValid
    })

    return NextResponse.json({
      resourceType: "Bundle",
      type: "searchset",
      total: validObservations.length,
      entry: validObservations.map((obs) => ({
        resource: {
          ...obs,
          meta: {
            lastUpdated: new Date().toISOString(),
            versionId: "1",
          },
        },
      })),
    })
  } catch (error) {
    console.error("Error searching observations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/fhir/observations - Create new observation
export async function POST(request: NextRequest) {
  try {
    const newObservation = await request.json()

    // Validate the new observation
    const validation = FHIRValidator.validateObservation(newObservation)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid FHIR Observation resource",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    // In a real implementation, you would save to your FHIR server
    // For now, we'll just return the observation with metadata
    const createdObservation = {
      ...newObservation,
      id: `obs-${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString(),
        versionId: "1",
      },
    }

    return NextResponse.json(createdObservation, { status: 201 })
  } catch (error) {
    console.error("Error creating observation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
