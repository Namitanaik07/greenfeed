import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Cpu, Wifi, Play, Square, Terminal, Save, CheckCircle,
  Zap, Radio, Users, FlaskConical
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// ── Types ──────────────────────────────────────────────────
interface LogEntry {
  id: number;
  time: string;
  type: 'sys' | 'info' | 'success' | 'warning' | 'error' | 'data';
  message: string;
}

interface SyncStats {
  totalScans: number;
  totalPointsAwarded: number;
  uniqueUsers: Set<string>;
  lastScanTime: string | null;
}

// ── Point rates (must match the DB trigger or Edge Function) ──
const POINT_RATES: Record<string, number> = {
  dry:         8,
  wet:        10,
  recyclable: 12,
  'e-waste':  15,
};

// ── Component ──────────────────────────────────────────────
export const HardwareSync = () => {
  // ── Settings ──
  const [espIp, setEspIp] = useState(() => localStorage.getItem('esp32_ip') || 'http://192.168.4.1/data');
  const [edgeFnUrl, setEdgeFnUrl] = useState(() =>
    localStorage.getItem('edge_fn_url') ||
    `${import.meta.env.VITE_SUPABASE_URL || 'https://hbqzmciruusgqwxrjfus.supabase.co'}/functions/v1/iot-dustbin`
  );
  const [binApiKey, setBinApiKey] = useState(() => localStorage.getItem('bin_api_key') || '');
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem('bin_device_id') || 'BIN_001');

  // ── State ──
  const [mode, setMode] = useState<'bridge' | 'simulation'>('bridge');
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastProcessedScanId, setLastProcessedScanId] = useState<string | null>(null);
  const [stats, setStats] = useState<SyncStats>({
    totalScans: 0,
    totalPointsAwarded: 0,
    uniqueUsers: new Set<string>(),
    lastScanTime: null,
  });

  // ── Simulation ──
  const [simUserId, setSimUserId] = useState('');
  const [simWeight, setSimWeight] = useState('250');
  const [simWasteType, setSimWasteType] = useState('dry');
  const [simQrToken, setSimQrToken] = useState('');
  const [isSending, setIsSending] = useState(false);

  // ── Refs ──
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Log helper ──
  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      type,
      message,
    }].slice(-80));
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ── Save settings ──
  const saveSettings = () => {
    localStorage.setItem('esp32_ip', espIp);
    localStorage.setItem('edge_fn_url', edgeFnUrl);
    localStorage.setItem('bin_api_key', binApiKey);
    localStorage.setItem('bin_device_id', deviceId);
    toast({ title: '💾 Settings Saved' });
    addLog('sys', 'Configuration saved to browser.');
  };

  // ══════════════════════════════════════════════════════════
  // MODE 1 — BRIDGE: poll ESP32 local IP, push to Edge Fn
  // ══════════════════════════════════════════════════════════
  const pollAndBridge = useCallback(async () => {
    try {
      const res = await fetch(espIp, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Deduplicate
      const scanId = data.scanId || data.scan_id || `${data.qr_token || data.userId}-${data.weight_grams || data.weight}-${data.timestamp || ''}`;
      if (scanId === lastProcessedScanId) return;
      setLastProcessedScanId(scanId);

      addLog('data', `ESP32 → ${JSON.stringify(data).slice(0, 120)}`);

      // Forward to Edge Function
      const payload = {
        device_id: data.device_id || deviceId,
        qr_token: data.qr_token || data.userId || '',
        waste_type: data.waste_type || data.type || 'dry',
        weight_grams: data.weight_grams || data.weight || 0,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      const fnRes = await fetch(edgeFnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bin-api-key': binApiKey,
        },
        body: JSON.stringify(payload),
      });

      const result = await fnRes.json();
      if (fnRes.ok && result.success) {
        addLog('success', `✅ ${result.message} (log #${result.log_id})`);
        setStats(prev => ({
          totalScans: prev.totalScans + 1,
          totalPointsAwarded: prev.totalPointsAwarded + (result.points_awarded || 0),
          uniqueUsers: new Set([...prev.uniqueUsers, payload.qr_token]),
          lastScanTime: new Date().toLocaleTimeString(),
        }));
      } else {
        addLog('error', `Edge Function error: ${result.error || result.detail || JSON.stringify(result)}`);
      }
    } catch (err: any) {
      // Only log non-timeout errors once in a while to avoid spam
      if (!err.message?.includes('AbortError') && !err.message?.includes('timeout')) {
        // Silently keep trying – the ESP32 might not have data yet
      }
    }
  }, [espIp, edgeFnUrl, binApiKey, deviceId, lastProcessedScanId, addLog]);

  const toggleBridgeSync = () => {
    if (isSyncing) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setIsSyncing(false);
      addLog('warning', '⏸ Bridge sync stopped.');
    } else {
      addLog('sys', `🔗 Starting Bridge: ${espIp} → ${edgeFnUrl}`);
      addLog('sys', `   Device: ${deviceId}`);
      setIsSyncing(true);
      pollAndBridge();
      pollIntervalRef.current = setInterval(pollAndBridge, 2000);
    }
  };

  // ══════════════════════════════════════════════════════════
  // MODE 2 — SIMULATION: fire directly to Edge Function
  // ══════════════════════════════════════════════════════════
  const fireSimulation = async () => {
    if (!simQrToken && !simUserId) {
      toast({ title: '⚠️ Enter QR Token or User ID', variant: 'destructive' });
      return;
    }
    const weight = parseFloat(simWeight);
    if (!weight || weight <= 0) {
      toast({ title: '⚠️ Enter valid weight', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    addLog('info', `🧪 SIM → device=${deviceId}, token=${simQrToken || simUserId}, ${weight}g ${simWasteType}`);

    try {
      // Resolve QR token: if user entered a userId, look up their qr_token
      let qrToken = simQrToken;
      if (!qrToken && simUserId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('qr_token')
          .eq('id', simUserId)
          .single();
        qrToken = profile?.qr_token || simUserId;
        addLog('info', `   Resolved user → qr_token: ${qrToken}`);
      }

      const payload = {
        device_id: deviceId,
        qr_token: qrToken,
        waste_type: simWasteType,
        weight_grams: weight,
        latitude: 12.2958,
        longitude: 76.6394,
      };

      const res = await fetch(edgeFnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bin-api-key': binApiKey,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        addLog('success', `✅ SIM: ${result.message}`);
        addLog('success', `   +${result.points_awarded} pts → ${result.user?.username || 'unknown'} (total: ${result.user?.total_points || '?'})`);
        setStats(prev => ({
          totalScans: prev.totalScans + 1,
          totalPointsAwarded: prev.totalPointsAwarded + (result.points_awarded || 0),
          uniqueUsers: new Set([...prev.uniqueUsers, qrToken]),
          lastScanTime: new Date().toLocaleTimeString(),
        }));
        toast({ title: `✅ +${result.points_awarded} points awarded!`, description: result.message });
      } else {
        addLog('error', `❌ SIM Failed: ${result.error} — ${result.detail || ''}`);
        toast({ title: '❌ Simulation Failed', description: result.error, variant: 'destructive' });
      }
    } catch (err: any) {
      addLog('error', `❌ Network error: ${err.message}`);
      toast({ title: '❌ Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  // Cleanup
  useEffect(() => () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  }, []);

  // ── Render ──
  const logColor: Record<string, string> = {
    sys: 'text-purple-400',
    info: 'text-blue-300',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    data: 'text-cyan-300',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cpu className="w-6 h-6 text-primary" />
          Hardware Sync Bridge
        </h2>
        <p className="text-muted-foreground mt-1">
          Connect your ESP32 smart dustbin to the live Supabase cloud. Supports bridge polling and direct simulation.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'Total Scans', value: stats.totalScans, color: 'text-yellow-500' },
          { icon: CheckCircle, label: 'Points Awarded', value: stats.totalPointsAwarded, color: 'text-green-500' },
          { icon: Users, label: 'Unique Users', value: stats.uniqueUsers.size, color: 'text-blue-500' },
          { icon: Radio, label: 'Last Scan', value: stats.lastScanTime || '—', color: 'text-purple-500' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <div className="font-inter font-bold text-lg text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'bridge' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('bridge')}
          className={mode === 'bridge' ? 'bg-gradient-primary' : ''}
        >
          <Wifi className="w-4 h-4 mr-1" /> Bridge Mode
        </Button>
        <Button
          variant={mode === 'simulation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('simulation')}
          className={mode === 'simulation' ? 'bg-gradient-primary' : ''}
        >
          <FlaskConical className="w-4 h-4 mr-1" /> Simulation Mode
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ─── Left: Controls ─── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Common Settings */}
          <div className="glass-card p-5 rounded-2xl border border-primary/20 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-secondary" /> Device & Backend Config
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Device ID</label>
              <Input value={deviceId} onChange={e => setDeviceId(e.target.value)} className="bg-black/40 border-primary/20 text-xs" placeholder="BIN_001" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Edge Function URL</label>
              <Input value={edgeFnUrl} onChange={e => setEdgeFnUrl(e.target.value)} className="bg-black/40 border-primary/20 text-xs" placeholder="https://...supabase.co/functions/v1/iot-dustbin" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bin API Key</label>
              <Input value={binApiKey} onChange={e => setBinApiKey(e.target.value)} type="password" className="bg-black/40 border-primary/20 text-xs" placeholder="From smart_dustbins table" />
            </div>

            {mode === 'bridge' && (
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ESP32 Local Endpoint</label>
                <Input value={espIp} onChange={e => setEspIp(e.target.value)} className="bg-black/40 border-primary/20 text-xs" placeholder="http://192.168.4.1/data" disabled={isSyncing} />
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={saveSettings} className="flex-1 border-primary/20 text-xs">
                <Save className="w-3 h-3 mr-1" /> Save Config
              </Button>
            </div>
          </div>

          {/* Mode-specific controls */}
          {mode === 'bridge' ? (
            <div className="glass-card p-5 rounded-2xl border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Bridge Polling</h3>
                <Badge className={isSyncing ? "bg-green-500/20 text-green-600 border-green-500/30 animate-pulse" : "bg-muted text-muted-foreground"}>
                  {isSyncing ? '● LIVE' : 'OFFLINE'}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">Polls the ESP32 every 2s, forwards payloads to the Edge Function.</p>
              <Button className={`w-full font-bold ${isSyncing ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-primary glow-primary'}`} onClick={toggleBridgeSync}>
                {isSyncing ? <><Square className="w-4 h-4 mr-2" /> Stop Bridge</> : <><Play className="w-4 h-4 mr-2" /> Start Bridge</>}
              </Button>
            </div>
          ) : (
            <div className="glass-card p-5 rounded-2xl border border-secondary/20 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-secondary" /> Fire Simulated Scan
              </h3>
              <p className="text-[10px] text-muted-foreground">Send a fake dustbin event directly to the Edge Function. The user's profile will update in real-time.</p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">QR Token (from user profile)</label>
                <Input value={simQrToken} onChange={e => setSimQrToken(e.target.value)} className="bg-black/40 border-secondary/20 text-xs" placeholder="e.g. GF-ab12cd34..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">Or User ID (UUID)</label>
                <Input value={simUserId} onChange={e => setSimUserId(e.target.value)} className="bg-black/40 border-secondary/20 text-xs" placeholder="e.g. a1b2c3d4-..." />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Weight (g)</label>
                  <Input value={simWeight} onChange={e => setSimWeight(e.target.value)} type="number" className="bg-black/40 border-secondary/20 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Waste Type</label>
                  <select
                    value={simWasteType}
                    onChange={e => setSimWasteType(e.target.value)}
                    className="w-full h-9 rounded-md border border-secondary/20 bg-black/40 text-xs text-foreground px-2"
                  >
                    <option value="dry">📦 Dry</option>
                    <option value="wet">🍃 Wet</option>
                    <option value="recyclable">♻️ Recyclable</option>
                    <option value="e-waste">🔋 E-Waste</option>
                  </select>
                </div>
              </div>

              <Button
                className="w-full font-bold bg-gradient-to-r from-secondary to-primary text-white"
                onClick={fireSimulation}
                disabled={isSending}
              >
                {isSending ? (
                  <><span className="animate-spin mr-2">⟳</span> Sending...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Fire Scan Event</>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* ─── Right: Terminal ─── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden border border-[#333] bg-[#0a0a0a] flex flex-col h-[520px]">
            <div className="bg-[#161616] px-4 py-2.5 border-b border-[#333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-gray-400">greenfeed-sync-daemon v2.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                <span className="text-[10px] font-mono text-gray-500">{isSyncing ? 'POLLING' : 'IDLE'}</span>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-0.5 custom-scrollbar leading-relaxed">
              {logs.length === 0 ? (
                <div className="text-gray-600 text-center mt-16 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-gray-700" />
                  <p>Awaiting commands...</p>
                  <p className="text-[10px] text-gray-700">Start the bridge or fire a simulation to begin.</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-gray-600 shrink-0 select-none">{log.time}</span>
                    <span className={`${logColor[log.type] || 'text-gray-400'}`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
