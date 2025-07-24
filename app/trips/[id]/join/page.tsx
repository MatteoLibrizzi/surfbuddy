"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"

// Mock trip data
const trip = {
  id: 1,
  destination: "Ericeira, Portugal",
  startDate: "Mar 15, 2024",
  endDate: "Mar 22, 2024",
  participants: 3,
  maxParticipants: 6,
  surfLevel: "Intermediate",
}

export default function JoinTripPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    surfLevel: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Joining trip with data:", formData)

    // In a real app, this would save to database
    alert("Great! You've joined the trip. The trip creator will be in touch soon!")

    // Redirect back to trip details
    window.location.href = `/trips/${trip.id}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${trip.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Trip
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Join Surf Trip</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                {trip.destination}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {trip.startDate} - {trip.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {trip.participants}/{trip.maxParticipants} surfers
                </span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Join Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>Provide your contact information so other surfers can connect with you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">Include country code for WhatsApp group creation</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Your Surf Level</Label>
                    <Select value={formData.surfLevel} onValueChange={(value) => handleInputChange("surfLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your surf level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - Learning the basics</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Comfortable in most conditions</SelectItem>
                        <SelectItem value="advanced">Advanced - Experienced in challenging waves</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Group (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Introduce yourself! Tell the group about your surf experience, what you're excited about, or anything else you'd like to share..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                {/* WhatsApp Notice */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">📱 WhatsApp Group</h3>
                  <p className="text-sm text-green-800">
                    After joining, the trip creator or other members will create a WhatsApp group using the phone
                    numbers provided. This is where you'll coordinate trip details, share updates, and get to know each
                    other before the trip!
                  </p>
                </div>

                {/* Safety Guidelines */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🛡️ Safety Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your contact info will be shared with other trip members</li>
                    <li>• Always meet in public places first</li>
                    <li>• Share your travel plans with trusted friends or family</li>
                    <li>• Trust your instincts - if something feels off, don't proceed</li>
                  </ul>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Link href={`/trips/${trip.id}`} className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1">
                    Join Trip
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
