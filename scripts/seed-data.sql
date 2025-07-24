-- Insert sample users
INSERT INTO users (id, email, name, bio, surf_level, board_types, favorite_spots, languages, travel_style, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', 'Passionate surfer from California. Love chasing swells and meeting new people!', 'intermediate', ARRAY['Shortboard', 'Fish'], ARRAY['Malibu', 'Trestles', 'Rincon'], ARRAY['English', 'Spanish'], 'mid-range', 'San Diego, CA'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'Sarah Chen', 'Surf photographer and intermediate surfer. Always looking for the perfect wave and shot!', 'intermediate', ARRAY['Longboard', 'Funboard'], ARRAY['Ericeira', 'Hossegor', 'Mundaka'], ARRAY['English', 'Mandarin'], 'mid-range', 'Los Angeles, CA'),
('550e8400-e29b-41d4-a716-446655440003', 'miguel@example.com', 'Miguel Santos', 'Advanced surfer from Portugal. Local guide in Ericeira and Peniche.', 'advanced', ARRAY['Shortboard', 'Gun'], ARRAY['Nazaré', 'Ericeira', 'Peniche'], ARRAY['Portuguese', 'English', 'Spanish'], 'budget', 'Ericeira, Portugal'),
('550e8400-e29b-41d4-a716-446655440004', 'alex@example.com', 'Alex Rivera', 'Beginner surfer eager to learn and explore new spots. Love the surf community!', 'beginner', ARRAY['Longboard', 'Funboard'], ARRAY['La Jolla', 'Cowell Beach'], ARRAY['English'], 'budget', 'San Diego, CA'),
('550e8400-e29b-41d4-a716-446655440005', 'emma@example.com', 'Emma Thompson', 'Surf instructor and ocean lover. Happy to help beginners and share local knowledge.', 'advanced', ARRAY['Shortboard', 'Longboard', 'SUP'], ARRAY['Santa Cruz', 'Mavericks', 'Steamer Lane'], ARRAY['English'], 'comfort', 'Santa Cruz, CA');

-- Insert sample trips
INSERT INTO trips (id, creator_id, destination, start_date, end_date, max_participants, current_participants, surf_level, travel_intentions, open_to, notes) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Ericeira, Portugal', '2024-03-15', '2024-03-22', 6, 1, 'intermediate', ARRAY['Just surfing', 'Photography', 'Local culture'], ARRAY['Surfing buddies', 'Lodging share', 'Carpooling'], 'Planning to surf dawn patrol every day and explore the local surf culture. Have camera gear for surf photography!'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Biarritz, France', '2024-04-02', '2024-04-09', 4, 2, 'advanced', ARRAY['Just surfing', 'Surf coaching'], ARRAY['Surfing buddies', 'Equipment sharing'], 'Looking for experienced surfers to tackle some bigger waves. Can provide local insights and coaching.'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Baja, Mexico', '2024-05-10', '2024-05-17', 8, 3, 'any', ARRAY['Just surfing', 'Also sightseeing', 'Local culture'], ARRAY['Surfing buddies', 'Carpooling', 'Lodging share', 'Meal sharing'], 'Epic Baja road trip! Planning to camp and chase swells down the coast. Van rental already sorted.');

-- Insert trip participants
INSERT INTO trip_participants (trip_id, user_id, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'accepted'), -- Sarah's own trip
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'accepted'), -- Miguel's own trip
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'accepted'), -- Emma joined Miguel's trip
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'accepted'), -- John's own trip
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'accepted'), -- Alex joined John's trip
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'pending'); -- Sarah requested to join John's trip

-- Insert sample conversations
INSERT INTO conversations (id, type, name, trip_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'direct', NULL, NULL),
('770e8400-e29b-41d4-a716-446655440002', 'direct', NULL, NULL),
('770e8400-e29b-41d4-a716-446655440003', 'group', 'Ericeira Trip Group', '660e8400-e29b-41d4-a716-446655440001');

-- Insert conversation participants
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'), -- John
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'), -- Sarah
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'), -- John
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'), -- Miguel
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'), -- Sarah (group)
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'), -- Alex (group)
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'); -- Emma (group)

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, content) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Hey! I saw your trip to Ericeira. I''m super interested!'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Awesome! Have you been to Ericeira before?'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Yes, a couple times. The waves at Ribeira d''Ilhas are incredible. What''s your surf level?'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'I''d say intermediate. Been surfing for about 5 years. Looking forward to some European waves!'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Perfect! I''m intermediate too. Are you planning to rent a car or looking for rides?'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'I was thinking about renting a car. Happy to share if you''re interested!'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Sounds great! I''ll bring my 6''2" shortboard'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'The forecast looks perfect for next week'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Can''t wait! I''ve been checking the charts daily'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Who''s driving to the airport?'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'I can pick up 2 people on my way'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'Perfect! Alex and I need a ride');

-- Insert sample ride shares
INSERT INTO ride_shares (id, driver_id, from_location, to_location, departure_date, departure_time, available_seats, cost_per_person, notes) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Los Angeles', 'San Diego', '2024-03-10', '06:00', 2, 25.00, 'Early morning departure to catch dawn patrol. Surfboard racks available.'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'San Francisco', 'Santa Cruz', '2024-03-12', '07:30', 3, 15.00, 'Regular weekend surf trip. Can pick up boards from local shops.');

-- Insert sample accommodation shares
INSERT INTO accommodation_shares (id, host_id, location, accommodation_type, available_from, available_to, max_guests, cost_per_night, description, amenities) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Ericeira, Portugal', 'room', '2024-03-01', '2024-04-30', 2, 30.00, 'Private room in surf house, 5 min walk to beach. Perfect for surfers!', ARRAY['WiFi', 'Kitchen access', 'Surfboard storage', 'Wetsuit drying area']),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Santa Cruz, CA', 'couch', '2024-03-15', '2024-03-25', 1, 20.00, 'Cozy couch in surfer''s apartment. Great local knowledge included!', ARRAY['WiFi', 'Kitchen access', 'Parking']);
