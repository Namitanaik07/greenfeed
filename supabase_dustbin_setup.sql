-- ═══════════════════════════════════════════════════════════════
-- GreenFeed — Smart Dustbin Integration Tables & Triggers
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ═══════════════════════════════════════════════════════════════

-- 1. Smart Dustbin Registry
-- Each physical dustbin device gets a row here.
CREATE TABLE IF NOT EXISTS smart_dustbins (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id   TEXT UNIQUE NOT NULL,             -- e.g. "BIN_001"
  api_key     TEXT NOT NULL DEFAULT gen_random_uuid()::text, -- secret key for auth
  location_name TEXT,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  is_active   BOOLEAN DEFAULT true,
  last_ping   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Dustbin Logs (every scan event)
CREATE TABLE IF NOT EXISTS dustbin_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  qr_token        TEXT,
  device_id       TEXT NOT NULL,
  waste_type      TEXT NOT NULL DEFAULT 'dry'
                    CHECK (waste_type IN ('dry','wet','recyclable','e-waste')),
  weight_grams    DOUBLE PRECISION NOT NULL DEFAULT 0,
  points_awarded  INTEGER NOT NULL DEFAULT 0,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  location_name   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_dustbin_logs_user     ON dustbin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_dustbin_logs_device   ON dustbin_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_dustbin_logs_created  ON dustbin_logs(created_at DESC);

-- 3. Auto-calculate points trigger
-- Point rates: dry=8, wet=10, recyclable=12, e-waste=15 per 100g
CREATE OR REPLACE FUNCTION fn_calc_dustbin_points()
RETURNS TRIGGER AS $$
DECLARE
  rate INT;
  pts  INT;
BEGIN
  CASE NEW.waste_type
    WHEN 'wet'        THEN rate := 10;
    WHEN 'recyclable' THEN rate := 12;
    WHEN 'e-waste'    THEN rate := 15;
    ELSE                   rate := 8;  -- dry / default
  END CASE;

  pts := GREATEST(1, ROUND((NEW.weight_grams / 100.0) * rate));
  NEW.points_awarded := pts;

  -- Auto-update profile total_points if user is known
  IF NEW.user_id IS NOT NULL THEN
    UPDATE profiles
       SET total_points = COALESCE(total_points, 0) + pts
     WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_dustbin_points ON dustbin_logs;
CREATE TRIGGER trg_calc_dustbin_points
  BEFORE INSERT ON dustbin_logs
  FOR EACH ROW
  EXECUTE FUNCTION fn_calc_dustbin_points();

-- 4. Enable Realtime on dustbin_logs (so the website gets instant updates)
-- ALTER PUBLICATION supabase_realtime ADD TABLE dustbin_logs;

-- 5. Row Level Security
ALTER TABLE smart_dustbins ENABLE ROW LEVEL SECURITY;
ALTER TABLE dustbin_logs   ENABLE ROW LEVEL SECURITY;

-- Dustbins: service role only (Edge Function uses service role key)
CREATE POLICY "Service role manages dustbins"
  ON smart_dustbins FOR ALL
  USING (true) WITH CHECK (true);

-- Logs: users can read their own, service role can insert
CREATE POLICY "Users can read own logs"
  ON dustbin_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role inserts logs"
  ON dustbin_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates logs"
  ON dustbin_logs FOR UPDATE
  USING (true) WITH CHECK (true);

-- 6. Seed a demo dustbin device (copy the api_key to your firmware!)
INSERT INTO smart_dustbins (device_id, location_name, latitude, longitude)
VALUES ('BIN_001', 'MITE Campus - Main Gate', 12.2958, 76.6394)
ON CONFLICT (device_id) DO NOTHING;

-- Print the API key for the demo bin
SELECT device_id, api_key, location_name FROM smart_dustbins WHERE device_id = 'BIN_001';
