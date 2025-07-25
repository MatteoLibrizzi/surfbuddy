"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Users, Phone, Mail, ArrowLeft, MessageCircle, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTrip } from "@/hooks/use-trips"
import { format } from "date-fns"

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const { trip, loading, error } = useTrip(params.id)

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  if (loading) {
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Trip not found</h3>
            <p className="text-gray-500 mb-4">{error || "This trip doesn't exist or has been removed."}</p>
            <Link href="/trips">
              <Button>Browse Other Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const availableSpots = trip.maxParticipants - trip.currentParticipants
  const participants = trip.participants || []

  const createWhatsAppGroup = () => {
    if (!participants.length) return
    
    const phoneNumbers = participants.map((p) => p.userPhone.replace(/\D/g, "")).join(",")
    const message = encodeURIComponent(
      `Hey everyone! This is the WhatsApp group for our surf trip to ${trip.destination} (${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}). Looking forward to surfing with you all! 🏄‍♂️`,
    )

    // This would open WhatsApp with pre-filled group creation
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const openWhatsAppGroup = () => {
    if (trip.whatsappGroupLink) {
      window.open(trip.whatsappGroupLink, "_blank")
    }
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
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {participants.length}/{trip.maxParticipants} surfers
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {trip.surfLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About this trip</h3>
                  <p className="text-gray-700">{trip.description}</p>
                </div>

                {trip.whatsappGroupLink && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">WhatsApp Group</h3>
                        <p className="text-sm text-green-700">Join the group chat to coordinate with other participants</p>
                      </div>
                      <Button onClick={openWhatsAppGroup} size="sm" className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join Group
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trip Members ({participants.length})</span>
                  {participants.length >= 2 && !trip.whatsappGroupLink && (
                    <Button onClick={createWhatsAppGroup} size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Create WhatsApp Group
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participants.map((participant, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>
                            {participant.userName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar> */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{participant.userName}</h4>
                            {participant.role === 'creator' && (
                              <Badge variant="secondary" className="text-xs">
                                Trip Creator
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {participant.userPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {participant.userEmail}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 min-w-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-7"
                            onClick={() =>
                              window.open(`https://wa.me/${participant.userPhone.replace(/\D/g, "")}`, "_blank")
                            }
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">WhatsApp</span>
                            <span className="sm:hidden">WA</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-7"
                            onClick={() => window.open(`mailto:${participant.userEmail}`, "_blank")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Email</span>
                            <span className="sm:hidden">Mail</span>
                          </Button>
                        </div>
                      </div>
                      {index < participants.length - 1 && <Separator className="mt-4" />}
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
                    Connect with {participants.length} other surfer{participants.length > 1 ? "s" : ""}{" "}
                    heading to {trip.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{availableSpots}</div>
                      <div className="text-sm text-gray-600">spot{availableSpots > 1 ? "s" : ""} left</div>
                    </div>
                    <Link href={`/trips/${trip.tripId}/join`} className="block">
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
