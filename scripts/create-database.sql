-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  surf_level VARCHAR(50),
  board_types TEXT[], -- Array of board types
  favorite_spots TEXT[], -- Array of surf spots
  languages TEXT[], -- Array of languages
  travel_style VARCHAR(50),
  profile_image_url TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_participants INTEGER DEFAULT 6,
  current_participants INTEGER DEFAULT 1,
  surf_level VARCHAR(50),
  travel_intentions TEXT[], -- Array of intentions
  open_to TEXT[], -- Array of what they're open to
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_participants table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) DEFAULT 'direct', -- direct, group
  name VARCHAR(255), -- For group chats
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL, -- Optional trip association
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, file
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ride_shares table
CREATE TABLE IF NOT EXISTS ride_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME,
  available_seats INTEGER NOT NULL,
  cost_per_person DECIMAL(10,2),
  notes TEXT,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL, -- Optional trip association
  status VARCHAR(50) DEFAULT 'active', -- active, full, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ride_requests table
CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_share_id UUID REFERENCES ride_shares(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_share_id, passenger_id)
);

-- Create accommodation_shares table
CREATE TABLE IF NOT EXISTS accommodation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  accommodation_type VARCHAR(100), -- room, couch, bed, apartment
  available_from DATE NOT NULL,
  available_to DATE NOT NULL,
  max_guests INTEGER DEFAULT 1,
  cost_per_night DECIMAL(10,2),
  description TEXT,
  amenities TEXT[], -- Array of amenities
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL, -- Optional trip association
  status VARCHAR(50) DEFAULT 'active', -- active, booked, unavailable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accommodation_requests table
CREATE TABLE IF NOT EXISTS accommodation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_share_id UUID REFERENCES accommodation_shares(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_creator ON trips(creator_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_ride_shares_locations ON ride_shares(from_location, to_location);
CREATE INDEX IF NOT EXISTS idx_accommodation_shares_location ON accommodation_shares(location);
