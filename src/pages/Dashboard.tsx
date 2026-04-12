import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NavBar from '@/components/NavBar';
import { Trophy, Flame, Target, TrendingUp, QrCode, LogOut, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
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
        <div className="glass-card rounded-2xl p-8">
          <h2 className="font-orbitron font-bold text-xl text-foreground mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-foreground/30">
            <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No activity yet. Use a smart dustbin or take an eco action to get started!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;