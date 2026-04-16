
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NavBar from '@/components/NavBar';
import { Trophy, Flame, Target, TrendingUp, QrCode, LogOut, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef } from "react";
import { useSmartDustbin } from "@/hooks/useSmartDustbin";
import { toast } from "@/hooks/use-toast";
import { Wifi, WifiOff, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { logs, latestEvent, isConnected, totalPoints, totalWeightKg } = useSmartDustbin(user?.id ?? null);
  const prevEvent = useRef<string | null>(null);

  // 🔔 Show notification when new dustbin event arrives
  useEffect(() => {
    if (!latestEvent || latestEvent.id === prevEvent.current) return;
    prevEvent.current = latestEvent.id;
    const labels: Record<string, string> = { dry: "📦 Dry", wet: "🍃 Wet", recyclable: "♻️ Recyclable", "e-waste": "🔋 E-Waste" };
    toast({
      title: `🗑️ Smart Bin — +${latestEvent.points_awarded} pts!`,
      description: `${labels[latestEvent.waste_type] ?? latestEvent.waste_type} waste · ${latestEvent.weight_grams}g · ${latestEvent.location_name ?? latestEvent.device_id}`,
    });
  }, [latestEvent]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-foreground/50">Loading your eco dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { icon: Trophy,    label: 'Total Points',  value: profile?.total_points ?? 0,  color: 'text-yellow-400' },
    { icon: Flame,     label: 'Day Streak',    value: `${profile?.streak_days ?? 0} 🔥`, color: 'text-orange-400' },
    { icon: Target,    label: 'Eco Score',     value: profile?.eco_score ?? 0,      color: 'text-secondary' },
    { icon: TrendingUp,label: 'Level',         value: profile?.level ?? 'Beginner', color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background particles-bg">
      <NavBar />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">

        {/* Welcome header */}
        <div className="glass-card rounded-2xl p-8 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
              {profile?.full_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-foreground">
                {profile?.full_name ?? user.email?.split('@')[0]}
              </h1>
              <p className="text-foreground/50 text-sm mt-1">{user.email}</p>
              <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                {profile?.level ?? 'Beginner'}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5 text-center">
              <Icon className={`w-7 h-7 mx-auto mb-3 ${color}`} />
              <div className="font-orbitron font-bold text-xl text-foreground">{value}</div>
              <div className="text-xs text-foreground/50 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* QR Code section */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-primary" />
            <h2 className="font-orbitron font-bold text-xl text-foreground">Your Smart Bin QR Code</h2>
          </div>
          <p className="text-foreground/50 text-sm mb-6">
            Show this QR at any GreenFeed smart dustbin to earn points automatically based on waste weight
          </p>
          {profile?.qr_token ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-2xl border-2 border-primary/30 p-3 bg-black/40 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profile.qr_token)}&bgcolor=0a0a0a&color=4ade80`}
                  alt="Your GreenFeed QR Code"
                  className="w-48 h-48 rounded-xl"
                />
              </div>
              <p className="text-xs text-foreground/30 font-mono">{profile.qr_token.slice(0, 20)}…</p>
              <div className="grid grid-cols-3 gap-3 text-sm max-w-sm w-full">
                {[
                  { emoji: '📦', type: 'Dry',        rate: '2 pts/100g' },
                  { emoji: '♻️', type: 'Recyclable', rate: '5 pts/100g' },
                  { emoji: '🔋', type: 'E-Waste',    rate: '10 pts/100g' },
                ].map(r => (
                  <div key={r.type} className="bg-primary/10 rounded-xl p-3 text-center">
                    <div className="text-xl">{r.emoji}</div>
                    <div className="font-semibold text-foreground text-xs mt-1">{r.type}</div>
                    <div className="text-primary text-[10px] font-mono">{r.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-foreground/30 py-8">Generating QR code…</div>
          )}
        </div>

        {/* Recent activity placeholder */}
        {/* Smart Dustbin Activity */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron font-bold text-xl text-foreground flex items-center gap-2">
              🗑️ Smart Dustbin Activity
            </h2>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isConnected ? "text-green-400" : "text-foreground/30"}`}>
              {isConnected ? <><Wifi className="w-3.5 h-3.5"/>Live</> : <><WifiOff className="w-3.5 h-3.5"/>Offline</>}
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="font-orbitron font-bold text-2xl text-primary">{totalPoints}</div>
              <div className="text-xs text-foreground/50 mt-1">Points from bins</div>
            </div>
            <div className="bg-secondary/10 rounded-xl p-4 text-center">
              <div className="font-orbitron font-bold text-2xl text-secondary">{totalWeightKg.toFixed(2)} kg</div>
              <div className="text-xs text-foreground/50 mt-1">Total waste disposed</div>
            </div>
          </div>

          {/* Log list */}
          {logs.length === 0 ? (
            <div className="text-center py-12 text-foreground/30">
              <p>No dustbin events yet.</p>
              <p className="text-xs mt-1">Show your QR at a GreenFeed bin to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map(log => {
                const icons: Record<string, string> = { dry: "📦", wet: "🍃", recyclable: "♻️", "e-waste": "🔋" };
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-muted/10">
                    <span className="text-xl">{icons[log.waste_type] ?? "🗑️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground capitalize">{log.waste_type} waste</div>
                      <div className="text-xs text-foreground/40">{log.weight_grams}g · {log.location_name ?? log.device_id} · {new Date(log.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-orbitron font-bold text-primary">+{log.points_awarded}</div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 ml-auto mt-0.5"/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;