import { NextRequest, NextResponse } from 'next/server';
import { TripsService } from '@/lib/dynamodb';

// POST /api/trips/[id]/join - Join a trip
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id: tripId} = await params
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      surfLevel,
      message
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if trip exists and has space
    const trip = await TripsService.getTripById(tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Get current participants to check capacity
    const participants = await TripsService.getTripParticipants(tripId);
    if (participants.length >= trip.maxParticipants) {
      return NextResponse.json(
        { error: 'Trip is full' },
        { status: 400 }
      );
    }

    // Use email as user ID
    const userId = email;

    // Join the trip (no user management needed)
    const participation = await TripsService.joinTrip(tripId, {
      userId,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userSurfLevel: surfLevel || 'intermediate',
      message: message || ''
    });

    return NextResponse.json(participation, { status: 201 });
  } catch (error: any) {
    console.error('Error joining trip:', error);
    
    if (error.message === 'User has already joined this trip') {
      return NextResponse.json(
        { error: 'You have already joined this trip' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to join trip' },
      { status: 500 }
    );
  }
}
