import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Trophy, Medal, Flame, Crown, Leaf, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LeaderEntry {
  rank: number;
  name: string;
  points: number;
  level: string;
  tasks: number;
  isYou?: boolean;
}

function getTierBadge(points: number): { label: string; color: string } {
  if (points >= 10000) return { label: 'Elite', color: 'bg-purple-100 text-purple-700 border-purple-300' };
  if (points >= 4000) return { label: 'Platinum', color: 'bg-blue-100 text-blue-700 border-blue-300' };
  if (points >= 1500) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
  if (points >= 500) return { label: 'Silver', color: 'bg-gray-100 text-gray-700 border-gray-300' };
  return { label: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-300' };
}

const LeaderboardPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | '30d'>('all');

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, total_points, eco_score, level')
          .order('total_points', { ascending: false })
          .limit(100);

        if (error) throw error;
        if (data) {
          const mapped: LeaderEntry[] = data.map((p: any, i: number) => ({
            rank: i + 1,
            name: p.id === user?.id ? 'You' : (p.full_name || p.username || 'Anonymous'),
            points: p.total_points ?? 0,
            level: p.level ?? 'Beginner',
            tasks: 0,
            isYou: p.id === user?.id,
          }));
          setEntries(mapped);
        }
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchLeaderboard();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Leaf className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }
  if (!user) return null;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen pt-16">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-inter font-bold text-foreground">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">Top eco-warriors making a difference</p>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant={timeRange === 'all' ? 'default' : 'outline'}
              onClick={() => setTimeRange('all')}
              className={timeRange === 'all' ? 'bg-primary text-white' : 'border-[#CFF5D6] text-muted-foreground'}
            >
              All Time
            </Button>
            <Button
              size="sm"
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
              className={timeRange === '30d' ? 'bg-primary text-white' : 'border-[#CFF5D6] text-muted-foreground'}
            >
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* 2nd place */}
          {top3[1] && (
            <div className="glass-card rounded-[16px] p-5 text-center hover-lift">
              <div className="text-3xl mb-2">🥈</div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                {top3[1].name[0]}
              </div>
              <p className="font-inter font-bold text-foreground text-sm truncate">{top3[1].name}</p>
              <p className="font-inter font-black text-lg text-secondary">{top3[1].points.toLocaleString()}</p>
              <Badge className={`${getTierBadge(top3[1].points).color} border text-[10px] mt-1`}>
                {getTierBadge(top3[1].points).label}
              </Badge>
            </div>
          )}
          {/* 1st place */}
          {top3[0] && (
            <div className="glass-card rounded-[16px] p-6 text-center hover-lift ring-2 ring-yellow-400/50 relative">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
              <div className="w-18 h-18 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2 w-[72px] h-[72px] shadow-lg">
                {top3[0].name[0]}
              </div>
              <p className="font-inter font-bold text-foreground truncate">{top3[0].name}</p>
              <p className="font-inter font-black text-2xl text-primary">{top3[0].points.toLocaleString()}</p>
              <Badge className={`${getTierBadge(top3[0].points).color} border text-[10px] mt-1`}>
                {getTierBadge(top3[0].points).label}
              </Badge>
            </div>
          )}
          {/* 3rd place */}
          {top3[2] && (
            <div className="glass-card rounded-[16px] p-5 text-center hover-lift">
              <div className="text-3xl mb-2">🥉</div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                {top3[2].name[0]}
              </div>
              <p className="font-inter font-bold text-foreground text-sm truncate">{top3[2].name}</p>
              <p className="font-inter font-black text-lg text-primary">{top3[2].points.toLocaleString()}</p>
              <Badge className={`${getTierBadge(top3[2].points).color} border text-[10px] mt-1`}>
                {getTierBadge(top3[2].points).label}
              </Badge>
            </div>
          )}
        </div>

        {/* Full Rankings */}
        <div className="glass-card rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#CFF5D6] flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            <h2 className="font-inter font-bold text-foreground">Full Rankings</h2>
          </div>
          <div className="divide-y divide-[#CFF5D6]/50">
            {rest.map(entry => {
              const tierBadge = getTierBadge(entry.points);
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${entry.isYou ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : 'hover:bg-[#E8FBEA]/30'}`}
                >
                  <span className={`font-inter font-bold w-8 text-center text-sm ${entry.rank <= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {entry.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {entry.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>
                      {entry.isYou ? `${entry.name} (You)` : entry.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{entry.tasks} tasks</span>
                      <Badge className={`${tierBadge.color} border text-[10px]`}>{tierBadge.label}</Badge>
                    </div>
                  </div>
                  <span className="font-inter font-bold text-primary">{entry.points.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
