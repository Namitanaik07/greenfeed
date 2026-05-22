import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trophy, Flame, Target, Bell, Star, TrendingUp, Medal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const notifications = [
  { id: 1, text: 'Your task "Central Park Cleanup" was verified! +50 pts', time: '2h ago', read: false },
  { id: 2, text: 'New challenge available: Beach Cleanup Drive', time: '5h ago', read: false },
  { id: 3, text: 'You earned the "Week Warrior" badge! 🏆', time: '1d ago', read: true },
  { id: 4, text: 'Leaderboard updated — you moved up 2 ranks!', time: '2d ago', read: true },
];

interface LeaderEntry {
  rank: number;
  name: string;
  points: number;
  level: string;
  tasks: number;
}

const ProfileSection = () => {
  const { profile, user: authUser } = useAuth();
  const { toast } = useToast();
  const [leaderboardData, setLeaderboardData] = useState<LeaderEntry[]>([]);

  const userName = profile?.full_name || profile?.username || 'Eco Warrior';
  const userLevel = profile?.level || 'Beginner';
  const userPoints = profile?.total_points || 0;
  const userStreak = profile?.streak_days || 0;
  const userImpact = profile?.eco_score || 0;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, username, total_points, level, eco_score')
        .order('total_points', { ascending: false })
        .limit(10);

      if (data) {
        setLeaderboardData(data.map((p, i) => ({
          rank: i + 1,
          name: p.id === authUser?.id ? 'You' : (p.full_name || p.username || 'Anonymous'),
          points: p.total_points || 0,
          level: p.level || 'Beginner',
          tasks: 0,
        })));
      }
    };
    fetchLeaderboard();
  }, [authUser?.id]);

  return (
    <section id="profile" className="py-24 px-4 ">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl lg:text-5xl font-orbitron font-bold mb-4">
            Your <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Profile</span> & Community
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-6 fade-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-foreground">{userName}</h3>
              <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">{userLevel}</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="flex items-center gap-2 text-sm text-foreground/70"><Trophy className="w-4 h-4 text-accent-solar" /> Points</span>
                <span className="font-orbitron font-bold text-foreground">{userPoints}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="flex items-center gap-2 text-sm text-foreground/70"><Target className="w-4 h-4 text-secondary" /> Tasks</span>
                <span className="font-orbitron font-bold text-foreground">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="flex items-center gap-2 text-sm text-foreground/70"><Flame className="w-4 h-4 text-accent-solar" /> Streak</span>
                <span className="font-orbitron font-bold text-foreground">{userStreak} days 🔥</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="flex items-center gap-2 text-sm text-foreground/70"><TrendingUp className="w-4 h-4 text-primary" /> Impact</span>
                <span className="font-orbitron font-bold text-foreground">{userImpact}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-foreground/50 mb-2">Level</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                  <Star className="w-2.5 h-2.5 mr-0.5" />{userLevel}
                </Badge>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass-card rounded-2xl p-6 fade-in" style={{ animationDelay: '0.15s' }}>
            <h3 className="text-lg font-orbitron font-bold text-foreground mb-6 flex items-center gap-2">
              <Medal className="w-5 h-5 text-accent-solar" /> Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboardData.map((entry) => {
                const isYou = entry.name === 'You';
                const medalColors = ['text-accent-solar', 'text-foreground/60', 'text-accent-solar/60'];
                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isYou ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted/20'}`}
                  >
                    <span className={`font-orbitron font-bold w-6 text-center ${entry.rank <= 3 ? medalColors[entry.rank - 1] : 'text-foreground/40'}`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${isYou ? 'text-primary' : 'text-foreground'}`}>
                        {entry.name}
                      </div>
                      <div className="text-[10px] text-foreground/40">{entry.tasks} tasks</div>
                    </div>
                    <span className="font-orbitron text-xs font-bold text-accent-solar">{entry.points}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card rounded-2xl p-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-orbitron font-bold text-foreground mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-secondary" /> Notifications
              <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] ml-auto">
                {notifications.filter(n => !n.read).length} new
              </Badge>
            </h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => toast({ title: 'Notification', description: n.text })}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${n.read ? 'bg-muted/10' : 'bg-primary/5 ring-1 ring-primary/20'}`}
                >
                  <p className={`text-sm ${n.read ? 'text-foreground/50' : 'text-foreground'}`}>{n.text}</p>
                  <p className="text-[10px] text-foreground/30 mt-1">{n.time}</p>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-secondary/30 text-secondary text-sm"
              onClick={() => toast({ title: '🔔 All Caught Up!', description: 'No more unread notifications.' })}
            >
              Mark All as Read
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
