DROP TABLE IF EXISTS cycle_logs CASCADE;
DROP TABLE IF EXISTS cycle_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS suggestions CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (char_length(trim(email)) > 0)
);

CREATE TABLE cycle_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  cycle_start_date DATE NOT NULL,
  cycle_length_days INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycle_profiles_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT chk_cycle_length
    CHECK (cycle_length_days BETWEEN 21 AND 40)
);

CREATE TABLE cycle_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  period_start_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycle_logs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_period_date
    UNIQUE (user_id, period_start_date)
);

CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category in ('mind', 'move', 'rest', 'nourish')),
  effort_level TEXT NOT NULL CHECK (effort_level IN ('low','medium','high')),
  phase_tag TEXT CHECK (phase_tag IN ('menstrual','follicular','ovulatory','luteal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);