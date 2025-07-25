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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Users, ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCreateTrip } from "@/hooks/use-trips"
import { useToast } from "@/hooks/use-toast"

interface Location {
  city: string;
  country: string;
}

export default function CreateTripPage() {
  const [tripData, setTripData] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    maxParticipants: "6",
    surfLevel: "intermediate",
    notes: "",
    whatsappGroupLink: "",
  })

  const [locations, setLocations] = useState<Location[]>([
    { city: "", country: "" }
  ])

  const router = useRouter()
  const { toast } = useToast()
  const { createTrip, loading, error } = useCreateTrip()

  // Helper functions for location management
  const addLocation = () => {
    setLocations([...locations, { city: "", country: "" }])
  }

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index))
    }
  }

  const updateLocation = (index: number, field: keyof Location, value: string) => {
    const updatedLocations = locations.map((location, i) =>
      i === index ? { ...location, [field]: value } : location
    )
    setLocations(updatedLocations)
  }

  // Generate destination string from locations
  const getDestinationString = () => {
    return locations
      .filter(loc => loc.city.trim() || loc.country.trim())
      .map(loc => {
        const parts = [loc.city.trim(), loc.country.trim()].filter(Boolean)
        return parts.join(', ')
      })
      .join(' | ')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const destinationString = getDestinationString()
    const hasValidLocation = locations.some(loc => loc.city.trim() || loc.country.trim())

    // Validation
    if (!tripData.name || !tripData.email || !tripData.phone || !hasValidLocation || !tripData.startDate || !tripData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including at least one location.",
        variant: "destructive",
      })
      return
    }

    if (tripData.startDate >= tripData.endDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    try {
      const trip = await createTrip({
        destination: destinationString,
        startDate: tripData.startDate.toISOString().split('T')[0],
        endDate: tripData.endDate.toISOString().split('T')[0],
        maxParticipants: parseInt(tripData.maxParticipants) || 6,
        surfLevel: tripData.surfLevel,
        description: tripData.notes,
        creatorName: tripData.name,
        creatorEmail: tripData.email,
        creatorPhone: tripData.phone,
        whatsappGroupLink: tripData.whatsappGroupLink || undefined,
      })

      if (trip) {
        toast({
          title: "Trip Created!",
          description: "Your surf trip has been created successfully.",
        })
        router.push(`/trips/${trip.tripId}`)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to create trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
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

              {/* Locations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Destinations *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLocation}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Location
                  </Button>
                </div>

                {locations.map((location, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Location {index + 1}
                      </span>
                      {locations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`city-${index}`}>City/Spot</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id={`city-${index}`}
                            placeholder="e.g., Ericeira, Malibu"
                            value={location.city}
                            onChange={(e) => updateLocation(index, 'city', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`country-${index}`}>Country/Region</Label>
                        <Input
                          id={`country-${index}`}
                          placeholder="e.g., Portugal, California"
                          value={location.country}
                          onChange={(e) => updateLocation(index, 'country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {getDestinationString() && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Preview:</strong> {getDestinationString()}
                    </p>
                  </div>
                )}
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
                        selected={tripData.startDate}
                        onSelect={(date) => setTripData((prev) => ({ ...prev, startDate: date }))}
                        mode="single"
                        required
                        hideWeekdays
                        navLayout={"after"}
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
                        selected={tripData.endDate}
                        onSelect={(date) => setTripData((prev) => ({ ...prev, endDate: date }))}
                        mode="single"
                        required
                        hideWeekdays
                        navLayout={"after"}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Group Size and Surf Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="surfLevel">Surf Level</Label>
                  <Select
                    value={tripData.surfLevel}
                    onValueChange={(value) => setTripData((prev) => ({ ...prev, surfLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select surf level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="mixed">Mixed Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* WhatsApp Group Link */}
              {/* <div className="space-y-2">
                <Label htmlFor="whatsappGroupLink">WhatsApp Group Link (Optional)</Label>
                <Input
                  id="whatsappGroupLink"
                  placeholder="https://chat.whatsapp.com/..."
                  value={tripData.whatsappGroupLink}
                  onChange={(e) => setTripData((prev) => ({ ...prev, whatsappGroupLink: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  Share your WhatsApp group invite link so participants can easily join the group chat.
                </p>
              </div> */}

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

              {/* Submit */}
              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Trip...
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
