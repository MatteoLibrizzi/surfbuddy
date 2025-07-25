import { useState, useEffect } from 'react';
// TODO remove the USER concept as it's superfluous for the MVP, just keep some user data in the TRIPs table when a user asks to join a trip, but most importantly tell user that they should join the whatsapp group or tell the organizer
// Types
export interface Trip {
  tripId: string;
  entityType: string;
  destination: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  surfLevel: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  creatorPhone: string;
  whatsappGroupLink?: string;
  createdAt: string;
  participants?: Participant[];
}

export interface Participant {
  tripId: string;
  entityType: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userSurfLevel: string;
  role: 'creator' | 'participant';
  joinedAt: string;
  message?: string;
  status: string;
}

export interface CreateTripData {
  destination: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  surfLevel: string;
  description: string;
  creatorName: string;
  creatorEmail: string;
  creatorPhone: string;
  whatsappGroupLink?: string;
}

export interface JoinTripData {
  name: string;
  email: string;
  phone: string;
  surfLevel: string;
  message?: string;
}

// Hook for fetching all trips with optional location filter
export function useTrips(location?: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async (searchLocation?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = searchLocation 
        ? `/api/trips?location=${encodeURIComponent(searchLocation)}`
        : '/api/trips';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(location);
  }, [location]);

  return {
    trips,
    loading,
    error,
    refetch: () => fetchTrips(location),
    searchByLocation: (searchLocation: string) => fetchTrips(searchLocation),
    clearSearch: () => fetchTrips()
  };
}

// Hook for fetching a single trip
export function useTrip(tripId: string | null) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/trips/${tripId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Trip not found');
        }
        throw new Error('Failed to fetch trip');
      }
      
      const data = await response.json();
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  return {
    trip,
    loading,
    error,
    refetch: fetchTrip
  };
}

// Hook for creating trips
export function useCreateTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (tripData: CreateTripData): Promise<Trip | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trip');
      }
      
      const trip = await response.json();
      return trip;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTrip,
    loading,
    error
  };
}

// Hook for joining trips
export function useJoinTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinTrip = async (tripId: string, userData: JoinTripData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/trips/${tripId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join trip');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinTrip,
    loading,
    error
  };
}
