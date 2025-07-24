-- Insert sample trips
INSERT INTO trips (destination, start_date, end_date, max_participants, surf_level, description, notes, tags, creator_name, creator_email, creator_phone) VALUES
('Ericeira, Portugal', '2024-03-15', '2024-03-22', 6, 'Intermediate', 'Planning to surf dawn patrol every day and explore the local surf culture. Looking for chill people to share the stoke!', 'I''ve been to Ericeira twice before and know some great local spots. Happy to show everyone around!', ARRAY['Looking for ride', 'Accommodation sharing', 'Dawn patrol'], 'Sarah Chen', 'sarah@example.com', '+1 (555) 123-4567'),
('Biarritz, France', '2024-04-02', '2024-04-09', 4, 'Advanced', 'Looking for experienced surfers to tackle some bigger waves. Can provide local insights and coaching.', 'I''m a local surf instructor and can show you the best spots depending on conditions.', ARRAY['Van rental', 'Surf coaching'], 'Miguel Santos', 'miguel@example.com', '+33 6 12 34 56 78'),
('Baja, Mexico', '2024-05-10', '2024-05-17', 8, 'Any Level', 'Epic Baja road trip! Planning to camp and chase swells down the coast. Van rental already sorted.', 'This will be an adventure! We''ll be camping and following the swell. Perfect for anyone wanting to experience the real Baja surf culture.', ARRAY['Camping', 'Road trip', 'All levels welcome'], 'Alex Rivera', 'alex@example.com', '+1 (619) 555-0123');

-- Insert sample participants
INSERT INTO trip_participants (trip_id, name, email, phone, surf_level, message) VALUES
(1, 'Sarah Chen', 'sarah@example.com', '+1 (555) 123-4567', 'Intermediate', 'Trip creator'),
(1, 'Mike Johnson', 'mike@example.com', '+1 (555) 234-5678', 'Intermediate', 'Super excited for this trip! Been wanting to surf Portugal for years.'),
(1, 'Lisa Park', 'lisa@example.com', '+1 (555) 345-6789', 'Beginner', 'New to surfing but really eager to learn in such a beautiful place!'),
(2, 'Miguel Santos', 'miguel@example.com', '+33 6 12 34 56 78', 'Advanced', 'Trip creator'),
(2, 'Emma Wilson', 'emma@example.com', '+44 7700 900123', 'Advanced', 'Looking forward to some challenging waves and improving my technique!'),
(3, 'Alex Rivera', 'alex@example.com', '+1 (619) 555-0123', 'Intermediate', 'Trip creator');
