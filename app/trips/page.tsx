"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MapPin, Calendar, Users, Filter, Waves, Phone, Mail } from "lucide-react"
import Link from "next/link"

// Mock data for trips
const trips = [
  {
    id: 1,
    destination: "Ericeira, Portugal",
    startDate: "Mar 15, 2024",
    endDate: "Mar 22, 2024",
    creator: {
      name: "Sarah Chen",
      phone: "+1 (555) 123-4567",
      email: "sarah@example.com",
    },
    participants: [
      { name: "Sarah Chen", phone: "+1 (555) 123-4567", email: "sarah@example.com" },
      { name: "Mike Johnson", phone: "+1 (555) 234-5678", email: "mike@example.com" },
    ],
    maxParticipants: 6,
    surfLevel: "Intermediate",
    description:
      "Planning to surf dawn patrol every day and explore the local surf culture. Looking for chill people to share the stoke!",
    tags: ["Looking for ride", "Accommodation sharing"],
  },
  {
    id: 2,
    destination: "Biarritz, France",
    startDate: "Apr 2, 2024",
    endDate: "Apr 9, 2024",
    creator: {
      name: "Miguel Santos",
      phone: "+33 6 12 34 56 78",
      email: "miguel@example.com",
    },
    participants: [
      { name: "Miguel Santos", phone: "+33 6 12 34 56 78", email: "miguel@example.com" },
      { name: "Emma Wilson", phone: "+44 7700 900123", email: "emma@example.com" },
    ],
    maxParticipants: 4,
    surfLevel: "Advanced",
    description:
      "Looking for experienced surfers to tackle some bigger waves. Can provide local insights and coaching.",
    tags: ["Van rental", "Surf coaching"],
  },
  {
    id: 3,
    destination: "Baja, Mexico",
    startDate: "May 10, 2024",
    endDate: "May 17, 2024",
    creator: {
      name: "Alex Rivera",
      phone: "+1 (619) 555-0123",
      email: "alex@example.com",
    },
    participants: [{ name: "Alex Rivera", phone: "+1 (619) 555-0123", email: "alex@example.com" }],
    maxParticipants: 8,
    surfLevel: "Any Level",
    description: "Epic Baja road trip! Planning to camp and chase swells down the coast. Van rental already sorted.",
    tags: ["Camping", "Road trip", "All levels welcome"],
  },
]

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTrips, setFilteredTrips] = useState(trips)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredTrips(trips)
    } else {
      const filtered = trips.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(query.toLowerCase()) ||
          trip.description.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredTrips(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SurfBuddy</span>
            </Link>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Link href="/create-trip">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Trip
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Surf Trips 🏄‍♂️</h1>
            <p className="text-gray-600 mt-1">Find your next surf adventure and connect with fellow surfers</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {trip.destination}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2 text-base">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {trip.startDate} - {trip.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {trip.participants.length}/{trip.maxParticipants} surfers
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {trip.surfLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{trip.description}</p>

                <div className="flex flex-wrap gap-2">
                  {trip.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          {trip.creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Created by {trip.creator.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {trip.creator.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {trip.creator.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/trips/${trip.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/trips/${trip.id}/join`}>
                        <Button size="sm">Join Trip</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or create a new trip!</p>
            <Link href="/create-trip">
              <Button>Create Your First Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
