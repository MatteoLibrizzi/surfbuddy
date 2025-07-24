"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Users, Phone, Mail, ArrowLeft, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"

// Mock trip data - in real app this would come from params
const trip = {
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
    {
      name: "Sarah Chen",
      phone: "+1 (555) 123-4567",
      email: "sarah@example.com",
      isCreator: true,
    },
    {
      name: "Mike Johnson",
      phone: "+1 (555) 234-5678",
      email: "mike@example.com",
      isCreator: false,
    },
    {
      name: "Lisa Park",
      phone: "+1 (555) 345-6789",
      email: "lisa@example.com",
      isCreator: false,
    },
  ],
  maxParticipants: 6,
  surfLevel: "Intermediate",
  description:
    "Planning to surf dawn patrol every day and explore the local surf culture. Looking for chill people to share the stoke! We'll be staying near Ribeira d'Ilhas and exploring different breaks each day.",
  tags: ["Looking for ride", "Accommodation sharing", "Dawn patrol", "Local culture"],
  notes:
    "I've been to Ericeira twice before and know some great local spots. Happy to show everyone around! Planning to rent a car so we can chase the best conditions each day.",
}

export default function TripDetailsPage() {
  const availableSpots = trip.maxParticipants - trip.participants.length

  const createWhatsAppGroup = () => {
    const phoneNumbers = trip.participants.map((p) => p.phone.replace(/\D/g, "")).join(",")
    const message = encodeURIComponent(
      `Hey everyone! This is the WhatsApp group for our surf trip to ${trip.destination} (${trip.startDate} - ${trip.endDate}). Looking forward to surfing with you all! 🏄‍♂️`,
    )

    // This would open WhatsApp with pre-filled group creation
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      {trip.destination}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-3 text-base">
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
                <div className="flex flex-wrap gap-2">
                  {trip.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">About this trip</h3>
                  <p className="text-gray-700">{trip.description}</p>
                </div>

                {trip.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Additional notes</h3>
                    <p className="text-gray-700">{trip.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trip Members ({trip.participants.length})</span>
                  {trip.participants.length >= 2 && (
                    <Button onClick={createWhatsAppGroup} size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Create WhatsApp Group
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trip.participants.map((participant, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{participant.name}</h4>
                            {participant.isCreator && (
                              <Badge variant="secondary" className="text-xs">
                                Trip Creator
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {participant.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(`https://wa.me/${participant.phone.replace(/\D/g, "")}`, "_blank")
                            }
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${participant.email}`, "_blank")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                      {index < trip.participants.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                {availableSpots > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      {availableSpots} spot{availableSpots > 1 ? "s" : ""} still available!
                    </p>
                    <p className="text-blue-600 text-sm mt-1">Join this trip to connect with these awesome surfers.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Trip Card */}
            {availableSpots > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Join This Trip</CardTitle>
                  <CardDescription>
                    Connect with {trip.participants.length} other surfer{trip.participants.length > 1 ? "s" : ""}{" "}
                    heading to {trip.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{availableSpots}</div>
                      <div className="text-sm text-gray-600">spot{availableSpots > 1 ? "s" : ""} left</div>
                    </div>
                    <Link href={`/trips/${trip.id}/join`} className="block">
                      <Button className="w-full" size="lg">
                        Join Trip
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center">
                      You'll provide your contact info and be added to the trip
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share Trip */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share This Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert("Trip link copied to clipboard!")
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Safety First 🛡️</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Meet in public places first</li>
                  <li>• Share your plans with friends/family</li>
                  <li>• Trust your instincts</li>
                  <li>• Verify accommodations independently</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
