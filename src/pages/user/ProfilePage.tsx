import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSmartDustbin } from '@/hooks/useSmartDustbin';
import NavBar from '@/components/NavBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserPosts } from '@/hooks/useFeed';
import PostCard from '@/components/feed/PostCard';
import { QrCode, Trophy, Flame, Target, TrendingUp, Star, Award, Calendar, Leaf, Shield, BarChart3, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TaskSection } from '@/components/sections/TaskSection';
import PointMatrixSection from '@/components/sections/PointMatrixSection';
import { useRef } from 'react';

const tierConfig: Record<string, { label: string; color: string; min: number }> = {
  bronze:   { label: '🥉 Bronze',   color: 'bg-orange-100 text-orange-700 border-orange-300', min: 0 },
  silver:   { label: '🥈 Silver',   color: 'bg-gray-100 text-gray-700 border-gray-300',       min: 500 },
  gold:     { label: '🥇 Gold',     color: 'bg-yellow-100 text-yellow-700 border-yellow-300', min: 1500 },
  platinum: { label: '💎 Platinum', color: 'bg-blue-100 text-blue-700 border-blue-300',       min: 4000 },
  elite:    { label: '🏆 Elite',    color: 'bg-purple-100 text-purple-700 border-purple-300', min: 10000 },
};

function getTier(points: number) {
  if (points >= 10000) return tierConfig.elite;
  if (points >= 4000)  return tierConfig.platinum;
  if (points >= 1500)  return tierConfig.gold;
  if (points >= 500)   return tierConfig.silver;
  return tierConfig.bronze;
}

const defaultBadges = ['First Action', 'Week Warrior', 'Eco Starter', 'River Saver'];

const ProfilePage = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { totalPoints: binPoints, totalWeightKg, logs, latestEvent } = useSmartDustbin(user?.id ?? null);
  const { posts: userPosts, loading: loadingPosts, toggleLike } = useUserPosts(user?.id);

  const prevEvent = useRef<string | null>(null);

  // 🔔 Show notification when new dustbin event arrives
  useEffect(() => {
    if (!latestEvent || latestEvent.id === prevEvent.current) return;
    prevEvent.current = latestEvent.id;
    const labels: Record<string, string> = { dry: "📦 Dry", wet: "🍃 Wet", recyclable: "♻️ Recyclable", "e-waste": "🔋 E-Waste" };
    toast({
      title: `🗑️ Smart Bin — +${latestEvent.points_awarded} pts!`,
      description: `${labels[latestEvent.waste_type] ?? latestEvent.waste_type} waste · ${latestEvent.weight_grams}g`,
    });
  }, [latestEvent]);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Leaf className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }
  if (!user) return null;

  const name = profile?.full_name ?? user.email?.split('@')[0] ?? 'Eco Warrior';
  const points = profile?.total_points ?? 0;
  const ecoScore = profile?.eco_score ?? 0;
  const streak = profile?.streak_days ?? 0;
  const tier = getTier(points);
  const badges = defaultBadges;

  // Eco-Score breakdown (FR-8.1)
  const taskScore = ecoScore * 0.5;
  const binScore = ecoScore * 0.3;
  const socialScore = ecoScore * 0.2;

  return (
    <div className="min-h-screen pt-16">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Profile Header */}
        <div className="glass-card rounded-[16px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {name[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-inter font-bold text-foreground">{name}</h1>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                <Badge className={`${tier.color} border text-xs font-semibold`}>{tier.label}</Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <Flame className="w-3 h-3 mr-1" /> {streak} day streak
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 border-red-500/30 text-red-500 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <div className="text-center sm:ml-auto">
              <div className="text-4xl font-inter font-black text-primary">{ecoScore}</div>
              <div className="text-xs text-muted-foreground">Eco-Score</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Trophy, label: 'Total Points', value: points, color: 'text-yellow-500' },
            { icon: Flame, label: 'Day Streak', value: `${streak} 🔥`, color: 'text-orange-500' },
            { icon: Target, label: 'Tasks Done', value: profile?.tasks_completed ?? 0, color: 'text-secondary' },
            { icon: TrendingUp, label: 'Waste Disposed', value: `${totalWeightKg.toFixed(1)} kg`, color: 'text-primary' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-[16px] p-5 text-center hover-lift">
              <Icon className={`w-7 h-7 mx-auto mb-3 ${color}`} />
              <div className="font-inter font-bold text-xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Eco-Score Breakdown (FR-8.1) */}
          <div className="glass-card rounded-[16px] p-6">
            <h2 className="font-inter font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Eco-Score Breakdown
            </h2>
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground font-mono bg-[#E8FBEA] p-3 rounded-xl">
                EcoScore = (Tasks × 0.50) + (SmartBin × 0.30) + (Social × 0.20)
              </div>
              {[
                { label: 'Task Completion (50%)', value: taskScore.toFixed(1), width: 50, color: 'bg-primary' },
                { label: 'Smart Bin Usage (30%)', value: binScore.toFixed(1), width: 30, color: 'bg-secondary' },
                { label: 'Social Engagement (20%)', value: socialScore.toFixed(1), width: 20, color: 'bg-[#4CAF50]' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-inter font-bold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="glass-card rounded-[16px] p-6">
            <h2 className="font-inter font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> Achievements
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => (
                <div key={badge} className="flex items-center gap-2 p-3 bg-[#FFF9D6] rounded-xl border border-[#CFF5D6]">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{badge}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
                <Shield className="w-5 h-5 text-muted-foreground/40" />
                <span className="text-sm text-muted-foreground">More to unlock...</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="glass-card rounded-[16px] p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-primary" />
            <h2 className="font-inter font-bold text-xl text-foreground">Your Smart Bin QR Code</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Show this at any GreenFeed smart bin to earn points automatically</p>
          {profile?.qr_token ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-2xl border-2 border-primary/30 p-3 bg-white inline-block shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profile.qr_token)}&bgcolor=ffffff&color=4CAF50`}
                  alt="Your GreenFeed QR Code"
                  className="w-48 h-48 rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: '🔄 QR Code regenerated', description: 'Your new QR is ready.' })}
                className="border-[#CFF5D6] text-primary"
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Regenerate QR
              </Button>
            </div>
          ) : (
            <div className="text-muted-foreground py-8">Generating QR code…</div>
          )}
        </div>

        {/* Recent Bin Activity */}
        {logs.length > 0 && (
          <div className="glass-card rounded-[16px] p-6">
            <h2 className="font-inter font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" /> Recent Activity
            </h2>
            <div className="space-y-2">
              {logs.slice(0, 5).map(log => {
                const icons: Record<string, string> = { dry: '📦', wet: '🍃', recyclable: '♻️', 'e-waste': '🔋' };
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-[#CFF5D6]">
                    <span className="text-xl">{icons[log.waste_type] ?? '🗑️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground capitalize">{log.waste_type} waste</div>
                      <div className="text-xs text-muted-foreground">{log.weight_grams}g · {new Date(log.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="font-inter font-bold text-primary">+{log.points_awarded}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Point Matrix & Rewards Dashboard */}
        <PointMatrixSection />

        {/* Tasks Section */}
        <div className="mb-8">
          <TaskSection />
        </div>

        {/* User Posts Section */}
        <div className="space-y-6">
          <h2 className="font-inter font-bold text-2xl text-foreground mb-4">Your Recent Posts</h2>
          {loadingPosts ? (
            <div className="flex items-center justify-center py-10">
              <Leaf className="w-8 h-8 animate-pulse text-primary" />
            </div>
          ) : userPosts.length === 0 ? (
            <div className="glass-card rounded-[16px] p-12 text-center">
              <Leaf className="w-12 h-12 text-primary/40 mx-auto mb-4" />
              <p className="text-foreground font-semibold">No posts yet</p>
              <p className="text-muted-foreground text-sm mt-1">Share your first eco-action in the Community Feed!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {userPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={toggleLike}
                  onHashtagClick={(tag) => navigate(`/feed?tag=${tag}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
