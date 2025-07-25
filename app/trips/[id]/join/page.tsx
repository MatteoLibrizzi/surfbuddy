"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin, Calendar, Users, MessageCircle, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTrip, useJoinTrip } from "@/hooks/use-trips"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function JoinTripPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { trip, loading: tripLoading, error: tripError } = useTrip(params.id)
  const { joinTrip, loading: joinLoading, error: joinError } = useJoinTrip()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    surfLevel: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trip) return
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await joinTrip(params.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        surfLevel: formData.surfLevel || 'intermediate',
        message: formData.message,
      })

      if (success) {
        toast({
          title: "Trip Joined!",
          description: "You've successfully joined the trip. Other participants can now see your contact info.",
        })
        router.push(`/trips/${trip.tripId}`)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: joinError || "Failed to join trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/trips">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trips
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (tripError || !trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/trips">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trips
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Trip not found</h3>
            <p className="text-gray-500 mb-4">{tripError || "This trip doesn't exist or has been removed."}</p>
            <Link href="/trips">
              <Button>Browse Other Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const participants = trip.participants || []
  const availableSpots = trip.maxParticipants - trip.currentParticipants

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${trip.tripId}`}>
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
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {participants.length}/{trip.maxParticipants} surfers
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

                {/* WhatsApp Group */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">📱 WhatsApp Group</h3>
                  {trip.whatsappGroupLink ? (
                    <div className="space-y-3">
                      <p className="text-sm text-green-800">
                        This trip already has a WhatsApp group! Join the group to coordinate with other participants.
                      </p>
                      <Button
                        onClick={() => window.open(trip.whatsappGroupLink!, "_blank")}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join WhatsApp Group
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-green-800">
                      After joining, the trip creator or other members will create a WhatsApp group using the phone
                      numbers provided. This is where you'll coordinate trip details, share updates, and get to know each
                      other before the trip!
                    </p>
                  )}
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
                  <Link href={`/trips/${trip.tripId}`} className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent" disabled={joinLoading}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={joinLoading}>
                    {joinLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining Trip...
                      </>
                    ) : (
                      "Join Trip"
                    )}
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
