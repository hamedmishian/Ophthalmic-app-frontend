"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User, Calendar, Hash, Eye, EyeOff, Table, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// This would typically come from an API or database
const patients = [
  {
    id: 1,
    name: "Becker, Michael",
    dob: "08.12.1965",
    patientId: "XXX74398",
    age: 58,
    status: "active",
    lastVisit: "15.11.2024",
    nextAppointment: "22.12.2024",
  },
  {
    id: 2,
    name: "Schmidt, Anna",
    dob: "15.03.1978",
    patientId: "YYY85209",
    age: 45,
    status: "inactive",
    lastVisit: "03.10.2024",
    nextAppointment: null,
  },
  {
    id: 3,
    name: "Müller, Thomas",
    dob: "22.07.1982",
    patientId: "ZZZ96320",
    age: 41,
    status: "inactive",
    lastVisit: "28.09.2024",
    nextAppointment: null,
  },
  {
    id: 4,
    name: "Fischer, Laura",
    dob: "30.11.1970",
    patientId: "AAA10731",
    age: 53,
    status: "inactive",
    lastVisit: "12.08.2024",
    nextAppointment: null,
  },
  {
    id: 5,
    name: "Weber, Klaus",
    dob: "05.09.1955",
    patientId: "BBB21842",
    age: 68,
    status: "inactive",
    lastVisit: "20.07.2024",
    nextAppointment: null,
  },
]

type ViewType = "cards" | "table" | "list"

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [viewType, setViewType] = useState<ViewType>("cards")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getInitials = (name: string) => {
    return name
      .split(", ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPatients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{patient.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Hash className="h-3 w-3 mr-1" />
                    {patient.patientId}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(patient.status)}>
                {patient.status === "active" ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Geburtsdatum</div>
                    <div>{patient.dob}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Alter</div>
                    <div>{patient.age} Jahre</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Letzter Besuch: {patient.lastVisit}</div>
                {patient.nextAppointment && (
                  <div className="text-xs text-blue-600 font-medium">Nächster Termin: {patient.nextAppointment}</div>
                )}
              </div>

              <div className="pt-2">
                {patient.id === 1 ? (
                  <Button asChild className="w-full" size="sm">
                    <Link href={`/patient/${patient.id}?tab=gesamtubersicht`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Dashboard anzeigen
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full" size="sm">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Nicht verfügbar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Table View Component
  const TableView = () => (
    <Card className="border-0 shadow-sm">
      <TableComponent>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Patient</TableHead>
            <TableHead className="font-semibold">Patienten-ID</TableHead>
            <TableHead className="font-semibold">Geburtsdatum</TableHead>
            <TableHead className="font-semibold">Alter</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Letzter Besuch</TableHead>
            <TableHead className="font-semibold">Nächster Termin</TableHead>
            <TableHead className="font-semibold">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-gray-900">{patient.name}</div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{patient.patientId}</TableCell>
              <TableCell>{patient.dob}</TableCell>
              <TableCell>{patient.age} Jahre</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(patient.status)} className={getStatusColor(patient.status)}>
                  {patient.status === "active" ? "Aktiv" : "Inaktiv"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{patient.lastVisit}</TableCell>
              <TableCell className="text-sm">
                {patient.nextAppointment ? (
                  <span className="text-blue-600 font-medium">{patient.nextAppointment}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {patient.id === 1 ? (
                  <Button asChild size="sm">
                    <Link href={`/patient/${patient.id}?tab=gesamtubersicht`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Anzeigen
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled size="sm">
                    <EyeOff className="h-4 w-4 mr-1" />
                    Nicht verfügbar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </Card>
  )

  // List View Component
  const ListView = () => (
    <Card className="border-0 shadow-sm">
      <div className="divide-y divide-gray-100">
        {filteredPatients.map((patient, index) => (
          <div key={patient.id} className="p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
                    <Badge className={getStatusColor(patient.status)} variant="secondary">
                      {patient.status === "active" ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {patient.patientId}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {patient.dob} ({patient.age} Jahre)
                    </div>
                    <div className="hidden sm:block">Letzter Besuch: {patient.lastVisit}</div>
                    {patient.nextAppointment && (
                      <div className="hidden md:block text-blue-600 font-medium">
                        Nächster Termin: {patient.nextAppointment}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-4">
                {patient.id === 1 ? (
                  <Button asChild size="sm">
                    <Link href={`/patient/${patient.id}?tab=gesamtubersicht`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled size="sm">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Nicht verfügbar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )

  const renderView = () => {
    switch (viewType) {
      case "cards":
        return <CardView />
      case "table":
        return <TableView />
      case "list":
        return <ListView />
      default:
        return <CardView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patientenliste</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Patienten und greifen Sie auf deren Dashboards zu</p>
        </div>

        {/* Search, Filter, and View Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Nach Name oder Patienten-ID suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Alle ({patients.length})
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                size="sm"
              >
                Aktiv ({patients.filter((p) => p.status === "active").length})
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "outline" : "outline"}
                onClick={() => setFilterStatus("inactive")}
                size="sm"
              >
                Inaktiv ({patients.filter((p) => p.status === "inactive").length})
              </Button>
            </div>
          </div>

          {/* View Controls and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              {filteredPatients.length} von {patients.length} Patienten angezeigt
            </p>

            {/* View Toggle Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewType === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("cards")}
                className={`h-8 px-3 ${
                  viewType === "cards"
                    ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Karten
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("table")}
                className={`h-8 px-3 ${
                  viewType === "table"
                    ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Table className="h-4 w-4 mr-1" />
                Tabelle
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("list")}
                className={`h-8 px-3 ${
                  viewType === "list"
                    ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <List className="h-4 w-4 mr-1" />
                Liste
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {filteredPatients.length > 0 ? (
          renderView()
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <User className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Patienten gefunden</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Versuchen Sie es mit anderen Suchbegriffen."
                : "Es sind keine Patienten in dieser Kategorie vorhanden."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
