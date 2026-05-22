-- ═══════════════════════════════════════════════════════════════
-- GreenFeed — Updated Point Calculation Trigger
-- Matches the official SRS Point Matrix:
--   dry recyclable = 20 pts / kg   (+5 scan bonus)
--   wet            = 10 pts / kg   (+5 scan bonus)
--   recyclable     = 20 pts / kg   (+5 scan bonus)
--   e-waste        = 25 pts / kg   (+5 scan bonus)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_calc_dustbin_points()
RETURNS TRIGGER AS $$
DECLARE
  rate_per_kg INT;
  scan_bonus  INT := 5;   -- +5 per scan (SRS: "Scan QR and use smart bin")
  pts         INT;
BEGIN
  CASE NEW.waste_type
    WHEN 'dry'        THEN rate_per_kg := 20;
    WHEN 'wet'        THEN rate_per_kg := 10;
    WHEN 'recyclable' THEN rate_per_kg := 20;
    WHEN 'e-waste'    THEN rate_per_kg := 25;
    ELSE                   rate_per_kg := 10;
  END CASE;

  -- Points = (weight_in_kg × rate) + scan_bonus
  pts := GREATEST(1, ROUND((NEW.weight_grams / 1000.0) * rate_per_kg) + scan_bonus);
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
