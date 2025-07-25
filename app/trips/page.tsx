"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, MapPin, Calendar, Users, Filter, Waves, Phone, Mail, Loader2, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { useTrips } from "@/hooks/use-trips"
import { format } from "date-fns"

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const { trips, loading, error, refetch, searchByLocation, clearSearch } = useTrips(activeSearch)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedQuery = searchQuery.trim()
    
    try {
      setActiveSearch(trimmedQuery)
    } catch (error) {
      // Handle any search errors
      console.error('Search error:', error)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setActiveSearch("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
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
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
                {activeSearch && (
                  <Button type="button" variant="outline" size="sm" onClick={handleClearSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>
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
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Waves className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading trips</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <Loader2 className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <Card key={trip.tripId} className="hover:shadow-md transition-shadow">
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
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {trip.currentParticipants}/{trip.maxParticipants} surfers
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

                  {trip.whatsappGroupLink && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp group available</span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {trip.creatorName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Created by {trip.creatorName}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {trip.creatorPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {trip.creatorEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/trips/${trip.tripId}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/trips/${trip.tripId}/join`}>
                          <Button size="sm">Join Trip</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {trips.length === 0 && !loading && (
          <div className="text-center py-12">
            <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-4">
              {activeSearch ? "Try adjusting your search or create a new trip!" : "No trips available yet. Create the first one!"}
            </p>
            {activeSearch && (
              <Button onClick={handleClearSearch} variant="outline" className="mr-4">
                <X className="h-4 w-4 mr-2" />
                Clear Search
              </Button>
            )}
            <Link href="/create-trip">
              <Button>Create Your First Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
