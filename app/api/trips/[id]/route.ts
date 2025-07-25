import { NextRequest, NextResponse } from 'next/server';
import { TripsService } from '@/lib/dynamodb';

// GET /api/trips/[id] - Get trip by ID with participants
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id: tripId} = await params

    // Get trip metadata and participants
    const [trip, participants] = await Promise.all([
      TripsService.getTripById(tripId),
      TripsService.getTripParticipants(tripId)
    ]);

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Update current participants count
    const currentParticipants = participants.length;
    const tripWithParticipants = {
      ...trip,
      currentParticipants,
      participants
    };

    return NextResponse.json(tripWithParticipants);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
}
