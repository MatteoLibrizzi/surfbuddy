-- Simplified database schema for MVP
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_participants INTEGER DEFAULT 6,
  surf_level VARCHAR(50),
  description TEXT,
  notes TEXT,
  tags TEXT[], -- Array of tags
  creator_name VARCHAR(255) NOT NULL,
  creator_email VARCHAR(255) NOT NULL,
  creator_phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip participants (no user accounts needed)
CREATE TABLE IF NOT EXISTS trip_participants (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  surf_level VARCHAR(50),
  message TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trip_participants_trip_id ON trip_participants(trip_id);
