import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Car, MessageCircle, Waves, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SurfBuddy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/trips">
              <Button variant="ghost">Browse Trips</Button>
            </Link>
            <Link href="/create-trip">
              <Button>Create Trip</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-blue-600 block">Surf Trip</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find and join surf trips planned by fellow surfers. Explore new destinations, share the stoke and the expenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trips">
              <Button size="lg" className="text-lg px-8 py-3">
                Browse Trips
              </Button>
            </Link>
            <Link href="/create-trip">
              <Button size="lg" className="text-lg px-8 py-3">
                Create Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Epic Surf Trips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Find Surf Buddies</CardTitle>
                <CardDescription>
                  Connect with surfers who match your skill level, travel style, and destination preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Plan Surf Trips</CardTitle>
                <CardDescription>
                  Create and discover upcoming surf trips. Share your plans and find others heading to the same breaks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Car className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Share Rides & Stays</CardTitle>
                <CardDescription>
                  Split travel costs by sharing rides and accommodation. Make surf trips more affordable for everyone.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Surf Tribe?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of surfers already planning their next adventure together.
          </p>
          <Link href="/trips">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Join SurfBuddy Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="h-6 w-6" />
            <span className="text-xl font-bold">SurfBuddy</span>
          </div>
          <p className="text-gray-400">Connecting surfers worldwide, one wave at a time.</p>
        </div>
      </footer>
    </div>
  )
}
