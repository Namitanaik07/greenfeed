import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bin-api-key",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });

  try {
    const { device_id, qr_token, waste_type = "dry", weight_grams, latitude, longitude } = await req.json();

    if (!device_id || !qr_token || weight_grams === undefined || weight_grams <= 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Authenticate device
    const binApiKey = req.headers.get("x-bin-api-key");
    if (!binApiKey) return new Response(JSON.stringify({ error: "Missing x-bin-api-key" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: bin, error: binErr } = await supabase
      .from("smart_dustbins")
      .select("id, location_name, latitude, longitude, is_active")
      .eq("device_id", device_id)
      .eq("api_key", binApiKey)
      .single();

    if (binErr || !bin?.is_active) return new Response(JSON.stringify({ error: "Invalid device or inactive" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Update last ping
    await supabase.from("smart_dustbins").update({ last_ping: new Date().toISOString() }).eq("device_id", device_id);

    // Resolve user from QR token
    const { data: user } = await supabase.from("profiles").select("id, username, total_points").eq("qr_token", qr_token).single();

    const validTypes = ["dry", "wet", "recyclable", "e-waste"];
    const safeWasteType = validTypes.includes(waste_type) ? waste_type : "dry";

    // Insert log — DB trigger auto-calculates and awards points
    const { data: log, error: logErr } = await supabase
      .from("dustbin_logs")
      .insert({
        user_id: user?.id ?? null,
        qr_token,
        device_id,
        waste_type: safeWasteType,
        weight_grams: parseFloat(weight_grams),
        latitude: latitude ?? bin.latitude,
        longitude: longitude ?? bin.longitude,
        location_name: bin.location_name,
      })
      .select()
      .single();

    if (logErr) return new Response(JSON.stringify({ error: "DB insert failed", detail: logErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Fetch updated profile after trigger
    let updated = null;
    if (user) {
      const { data } = await supabase.from("profiles").select("total_points, streak_days, level").eq("id", user.id).single();
      updated = data;
    }

    return new Response(JSON.stringify({
      success: true,
      log_id: log.id,
      points_awarded: log.points_awarded,
      user: user ? { username: user.username, total_points: updated?.total_points, streak_days: updated?.streak_days, level: updated?.level } : null,
      message: user ? `+${log.points_awarded} pts awarded to ${user.username}!` : "Logged but QR not matched",
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});