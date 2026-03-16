-- UnPhased Phase 1 Schema

CREATE TABLE IF NOT EXISTS cycle_profiles (
  id SERIAL PRIMARY KEY,
  cycle_start_date DATE NOT NULL,
  cycle_length_days INTEGER NOT NULL CHECK (cycle_length_days BETWEEN 20 AND 45),
  period_length_days INTEGER CHECK (period_length_days BETWEEN 2 AND 10),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category in ('mind', 'move', 'rest', 'nourish')),
  effort_level TEXT NOT NULL CHECK (effort_level IN ('low','medium','high')),
  phase_tag TEXT CHECK (phase_tag IN ('menstrual','follicular','ovulatory','luteal')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);