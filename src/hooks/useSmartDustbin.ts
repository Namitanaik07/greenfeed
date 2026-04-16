import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DustbinLog {
  id: string;
  device_id: string;
  waste_type: "dry" | "wet" | "recyclable" | "e-waste";
  weight_grams: number;
  points_awarded: number;
  location_name: string | null;
  created_at: string;
}

export function useSmartDustbin(userId: string | null) {
  const [logs, setLogs]               = useState<DustbinLog[]>([]);
  const [latestEvent, setLatestEvent] = useState<DustbinLog | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!userId) { setIsLoading(false); return; }
    const { data } = await supabase
      .from("dustbin_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setLogs(data as DustbinLog[]);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`dustbin-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dustbin_logs",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newLog = payload.new as DustbinLog;
          setLogs(prev => [newLog, ...prev].slice(0, 20));
          setLatestEvent(newLog);
        }
      )
      .subscribe(status => setIsConnected(status === "SUBSCRIBED"));

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const totalPoints   = logs.reduce((s, l) => s + l.points_awarded, 0);
  const totalWeightKg = logs.reduce((s, l) => s + l.weight_grams, 0) / 1000;

  return { logs, latestEvent, isConnected, isLoading, totalPoints, totalWeightKg, refresh: fetchLogs };
}