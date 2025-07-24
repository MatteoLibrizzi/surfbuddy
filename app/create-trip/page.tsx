"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Users, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateTripPage() {
  const [tripData, setTripData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    maxParticipants: "",
    notes: "",
  })

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating trip:", tripData)
    // Handle trip creation logic
    // Redirect to the new trip page (replace '/trip/123' with the actual trip ID)
    router.push("/trip/123")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create Surf Trip</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Next Surf Adventure</CardTitle>
            <CardDescription>Share your trip details to connect with fellow surfers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={tripData.name}
                    onChange={(e) => setTripData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={tripData.email}
                    onChange={(e) => setTripData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    value={tripData.phone}
                    onChange={(e) => setTripData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="destination"
                    placeholder="e.g., Ericeira, Portugal or Malibu, CA"
                    value={tripData.destination}
                    onChange={(e) => setTripData((prev) => ({ ...prev, destination: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripData.startDate ? format(tripData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripData.startDate}
                        onSelect={(date) => setTripData((prev) => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripData.endDate ? format(tripData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripData.endDate}
                        onSelect={(date) => setTripData((prev) => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Group Size */}
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="e.g., 4"
                    value={tripData.maxParticipants}
                    onChange={(e) => setTripData((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                    className="pl-10"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Down to rent a van and chase swell..."
                  value={tripData.notes}
                  onChange={(e) => setTripData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* WhatsApp Group Notice */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">WhatsApp Group 💬</h3>
                <p className="text-sm text-green-800">
                  A WhatsApp group will be created for this trip to coordinate details and connect with fellow surfers.
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Create Trip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
