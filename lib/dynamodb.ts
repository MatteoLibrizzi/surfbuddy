import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Environment configuration
const isDev = process.env.NODE_ENV !== 'production';

// AWS Configuration based on environment
const awsConfig = {
  region: 'eu-west-1',
  credentials: {
    accessKeyId: isDev 
      ? process.env.DEV_ACCESS_KEY! 
      : process.env.PROD_ACCESS_KEY!,
    secretAccessKey: isDev 
      ? process.env.DEV_SECRET_ACCESS_KEY! 
      : process.env.PROD_SECRET_ACCESS_KEY!,
  },
};

// Create DynamoDB client
const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Table names based on environment
export const TABLE_NAMES = {
  TRIPS: `surfbuddy-Trips-${isDev ? 'dev' : 'prod'}`,
};

// Index names
export const INDEX_NAMES = {
  LOCATION_SEARCH: 'LocationSearchIndex',
  LOCATION_PREFIX: 'LocationPrefixIndex',
};

// Helper function to parse locations from destination string
export function parseLocations(destination: string): string[] {
  const parts = destination.split(',').map(s => s.trim());
  const locations = [];
  
  // Add specific location (city/spot)
  if (parts[0]) locations.push(parts[0]);
  
  // Add country/region
  if (parts[1]) locations.push(parts[1]);
  
  return locations;
}

// Trip-related operations
export class TripsService {
  
  // Create a new trip with multiple location records
  static async createTrip(tripData: {
    destination: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    surfLevel: string;
    description: string;
    creatorId: string;
    creatorName: string;
    creatorEmail: string;
    creatorPhone: string;
    whatsappGroupLink?: string;
  }) {
    const tripId = crypto.randomUUID();
    const now = new Date().toISOString();
    const locations = parseLocations(tripData.destination);
    
    // Create single metadata record
    const metadataRecord = {
      pk: tripId,
      sk: 'METADATA',
      tripId,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      maxParticipants: tripData.maxParticipants,
      surfLevel: tripData.surfLevel,
      description: tripData.description,
      creatorId: tripData.creatorId,
      creatorName: tripData.creatorName,
      creatorEmail: tripData.creatorEmail,
      creatorPhone: tripData.creatorPhone,
      whatsappGroupLink: tripData.whatsappGroupLink || null,
      currentParticipants: 1,
      createdAt: now,
    };

    // Create search records for prefix matching (separate from metadata)
    const searchRecords = locations.map((location) => ({
      pk: 'SEARCHBYPREFIX',
      sk: `${location.toLowerCase()}#${tripId}`,
      entityType: 'SEARCHBYPREFIX',
      locationSortKey: `${location.toLowerCase()}#${tripId}`,
      actualTripId: tripId,
      startDate: tripData.startDate,
      destination: tripData.destination,
      createdAt: now,
    }));
    
    // Create creator participation record
    const creatorParticipationRecord = {
      pk: tripId,
      sk: `USERJOINS#${tripData.creatorId}`,
      userId: tripData.creatorId,
      userName: tripData.creatorName,
      userEmail: tripData.creatorEmail,
      userPhone: tripData.creatorPhone,
      userSurfLevel: tripData.surfLevel,
      role: 'creator',
      joinedAt: now,
      status: 'confirmed',
    };
    
    try {
      // Insert all records
      await Promise.all([
        // Insert metadata record
        docClient.send(new PutCommand({
          TableName: TABLE_NAMES.TRIPS,
          Item: metadataRecord,
        })),
        // Insert search records
        ...searchRecords.map(record => 
          docClient.send(new PutCommand({
            TableName: TABLE_NAMES.TRIPS,
            Item: record,
          }))
        ),
        // Insert creator participation
        docClient.send(new PutCommand({
          TableName: TABLE_NAMES.TRIPS,
          Item: creatorParticipationRecord,
        })),
      ]);
      
      // Return the metadata record
      return metadataRecord;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new Error('Failed to create trip');
    }
  }
  
  // Get trip by ID with metadata
  static async getTripById(tripId: string) {
    try {
      const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAMES.TRIPS,
        Key: {
          pk: tripId,
          sk: 'METADATA',
        },
      }));
      
      return result.Item;
    } catch (error) {
      console.error('Error getting trip:', error);
      throw new Error('Failed to get trip');
    }
  }
  
  // Get trip participants
  static async getTripParticipants(tripId: string) {
    try {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAMES.TRIPS,
        KeyConditionExpression: 'pk = :tripId AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: {
          ':tripId': tripId,
          ':prefix': 'USERJOINS#',
        },
      }));
      
      return result.Items || [];
    } catch (error) {
      console.error('Error getting trip participants:', error);
      throw new Error('Failed to get trip participants');
    }
  }
  
  // Search trips by location with prefix matching - returns metadata records sorted by most recent
  static async searchTripsByLocation(location: string) {
    try {
      const searchPrefix = location.toLowerCase().trim();
      
      // First, search for matching location prefixes in SEARCHBYPREFIX records
      const searchResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAMES.TRIPS,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :locationPrefix)',
        ExpressionAttributeValues: {
          ':pk': 'SEARCHBYPREFIX',
          ':locationPrefix': searchPrefix,
        },
      }));
      
      const searchRecords = searchResult.Items || [];
      
      if (searchRecords.length === 0) {
        return [];
      }
      
      // Get unique trip IDs from search records
      const tripIds = [...new Set(searchRecords.map(record => record.actualTripId))];
      
      // Fetch metadata records for each trip
      const metadataPromises = tripIds.map(tripId => 
        docClient.send(new GetCommand({
          TableName: TABLE_NAMES.TRIPS,
          Key: {
            pk: tripId,
            sk: 'METADATA',
          },
        }))
      );
      
      const metadataResults = await Promise.all(metadataPromises);
      const trips = metadataResults
        .map(result => result.Item)
        .filter(item => item !== undefined);
      
      // Sort by startDate descending (most recent first)
      return trips.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error searching trips by location:', error);
      throw new Error('Failed to search trips');
    }
  }
  
  // Get all trips (for browse page) - sorted by most recent
  static async getAllTrips() {
    try {
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAMES.TRIPS,
        FilterExpression: 'sk = :sk',
        ExpressionAttributeValues: {
          ':sk': 'METADATA'
        },
        Limit: 7,
      }));
      
      const trips = result.Items || [];
      
      // Sort by startDate descending (most recent first)
      return trips.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error getting all trips:', error);
      throw new Error('Failed to get trips');
    }
  }
  
  // Join a trip
  static async joinTrip(tripId: string, userData: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userSurfLevel: string;
    message?: string;
  }) {
    const now = new Date().toISOString();
    
    // Create trip participation record
    const tripParticipationRecord = {
      tripId,
      entityType: `USERJOINS#${userData.userId}`,
      userId: userData.userId,
      userName: userData.userName,
      userEmail: userData.userEmail,
      userPhone: userData.userPhone,
      userSurfLevel: userData.userSurfLevel,
      role: 'participant',
      joinedAt: now,
      message: userData.message || '',
      status: 'confirmed',
    };
    
    try {
      // Insert participation record
      await docClient.send(new PutCommand({
        TableName: TABLE_NAMES.TRIPS,
        Item: tripParticipationRecord,
        ConditionExpression: 'attribute_not_exists(tripId)', // Prevent duplicate joins
      }));
      
      return tripParticipationRecord;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User has already joined this trip');
      }
      console.error('Error joining trip:', error);
      throw new Error('Failed to join trip');
    }
  }
}


export { docClient };
