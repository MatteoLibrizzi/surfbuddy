import { useState, useEffect } from 'react';

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
        if (response.status === 404) {
          throw new Error('No trips found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      }
      
      const data = await response.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTrips([]); // Clear trips on error
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
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      }
      
      const data = await response.json();
      setTrip(data);
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTrip(null); // Clear trip on error
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
        let errorMessage = 'Something went wrong. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse error response, use default message
        }
        
        if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }
      
      const trip = await response.json();
      return trip;
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
        let errorMessage = 'Something went wrong. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse error response, use default message
        }
        
        if (response.status === 404) {
          errorMessage = 'Trip not found';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }
      
      return true;
    } catch (err) {
      console.error('Error joining trip:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
