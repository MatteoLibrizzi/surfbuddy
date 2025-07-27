import { NextRequest, NextResponse } from 'next/server';
import { TripsService } from '@/lib/dynamodb';
import { NotificationService } from '@/lib/notifications';

// GET /api/trips - Get all trips
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    let trips;
    if (location) {
      // Search trips by location
      trips = await TripsService.searchTripsByLocation(location);
    } else {
      // Get all trips
      trips = await TripsService.getAllTrips();
    }

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      destination,
      startDate,
      endDate,
      maxParticipants,
      surfLevel,
      description,
      creatorName,
      creatorEmail,
      creatorPhone,
      whatsappGroupLink
    } = body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !creatorName || !creatorEmail || !creatorPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use email as user ID for simplicity
    const creatorId = creatorEmail;

    // Create the trip (no user management needed)
    const trip = await TripsService.createTrip({
      destination,
      startDate,
      endDate,
      maxParticipants: maxParticipants || 6,
      surfLevel: surfLevel || 'intermediate',
      description: description || '',
      creatorId,
      creatorName,
      creatorEmail,
      creatorPhone,
      whatsappGroupLink
    });

    // Send notification email (async, don't wait for it)
    if (trip) {
      NotificationService.sendTripCreatedNotification({
        tripId: trip.tripId,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        creatorName: trip.creatorName,
        creatorEmail: trip.creatorEmail,
        creatorPhone: trip.creatorPhone,
        surfLevel: trip.surfLevel,
        maxParticipants: trip.maxParticipants,
        description: trip.description,
        whatsappGroupLink: trip.whatsappGroupLink ?? undefined,
      }).catch(error => {
        console.error('Notification failed (non-blocking):', error);
      });
    }

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
