-- UnPhased Phase 1 seed data

-- single-profile MVP (id will be 1 if table is empty)
INSERT INTO cycle_profiles (cycle_start_date, cycle_length_days, period_length_days)
VALUES ('2026-02-15', 28, 5);

INSERT INTO suggestions (title, description, effort_level, phase_tag) VALUES
('Tidy one small area for 10 minutes', 'Quick win to reduce mental clutter.', 'low', NULL),
('Short walk or light stretch', 'Gentle movement to support mood and energy.', 'low', 'menstrual'),
('Meal prep: protein + veggie', 'Simple meal to reduce decision fatigue.', 'medium', 'follicular'),
('Focus sprint: 25 minutes', 'Short focused sprint with a clear end.', 'medium', NULL),
('Plan tomorrow lightly', 'Outline only essentials; avoid overcommitting.', 'low', 'luteal');