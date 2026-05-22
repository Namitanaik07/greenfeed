import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, AlertTriangle, CheckSquare, Zap, Loader2, Trophy, Trash2, TrendingUp, Flame, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  activeIssues: number;
  totalPointsAwarded: number;
  totalBinPoints: number;
  recentTasks: { id: string; title: string; location_name: string | null; status: string }[];
  submittedTasks: { id: string; title: string; reward_points: number; location_name: string | null }[];
}

interface UserPointRow {
  id: string;
  full_name: string | null;
  username: string | null;
  email?: string;
  total_points: number;
  eco_score: number;
  streak_days: number;
  tasks_completed: number;
  level: string | null;
  bin_deposits: number;
  bin_weight_g: number;
  bin_points: number;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userPoints, setUserPoints] = useState<UserPointRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    // Fetch counts in parallel
    const [usersRes, tasksRes, submittedRes, pointsRes, binLogsRes, profilesRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('eco_tasks').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('eco_tasks').select('*').eq('status', 'submitted'),
      supabase.from('point_transactions').select('points'),
      supabase.from('dustbin_logs').select('user_id, weight_grams, points_awarded'),
      supabase.from('profiles').select('id, full_name, username, total_points, eco_score, streak_days, tasks_completed, level').order('total_points', { ascending: false }),
    ]);

    const allTasks = tasksRes.data || [];
    const submitted = submittedRes.data || [];
    const totalPts = (pointsRes.data || []).reduce((sum, pt) => sum + (pt.points || 0), 0);
    const openTasks = allTasks.filter(t => t.status === 'open' || t.status === 'in_progress');

    // Aggregate bin stats per user
    const binLogs = binLogsRes.data || [];
    const binByUser: Record<string, { deposits: number; weight: number; points: number }> = {};
    let totalBinPts = 0;
    for (const log of binLogs) {
      if (!log.user_id) continue;
      if (!binByUser[log.user_id]) binByUser[log.user_id] = { deposits: 0, weight: 0, points: 0 };
      binByUser[log.user_id].deposits += 1;
      binByUser[log.user_id].weight += log.weight_grams || 0;
      binByUser[log.user_id].points += log.points_awarded || 0;
      totalBinPts += log.points_awarded || 0;
    }

    // Build user rows
    const profiles = profilesRes.data || [];
    const rows: UserPointRow[] = profiles.map(p => ({
      id: p.id,
      full_name: p.full_name,
      username: p.username,
      total_points: p.total_points || 0,
      eco_score: p.eco_score || 0,
      streak_days: p.streak_days || 0,
      tasks_completed: p.tasks_completed || 0,
      level: p.level,
      bin_deposits: binByUser[p.id]?.deposits || 0,
      bin_weight_g: binByUser[p.id]?.weight || 0,
      bin_points: binByUser[p.id]?.points || 0,
    }));

    setUserPoints(rows);
    setStats({
      totalUsers: usersRes.count || 0,
      pendingVerifications: submitted.length,
      activeIssues: openTasks.length,
      totalPointsAwarded: totalPts + totalBinPts,
      totalBinPoints: totalBinPts,
      recentTasks: allTasks.slice(0, 3),
      submittedTasks: submitted.slice(0, 3),
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    const subscription = supabase
      .channel('admin_dashboard_overview')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eco_tasks' }, () => fetchStats())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dustbin_logs' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: CheckSquare, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Active Issues', value: stats.activeIssues, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' },
    { label: 'Total Points Awarded', value: stats.totalPointsAwarded, icon: Zap, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-inter">Dashboard Overview</h2>
          <p className="text-muted-foreground text-sm">Welcome back to the GreenFeed Admin Panel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold font-orbitron">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ─── User Points Leaderboard (LIVE from Supabase) ─── */}
      <div className="glass-card rounded-2xl overflow-hidden border border-primary/20 mt-8">
        <div className="p-5 border-b border-primary/20 bg-gradient-to-r from-yellow-500/5 to-green-500/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold font-inter">User Points Overview</h3>
          </div>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">LIVE</Badge>
        </div>

        {/* Table Header */}
        <div className="hidden lg:grid px-5 py-3 border-b border-primary/10 bg-[#E8FBEA]/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
          style={{ gridTemplateColumns: '40px 1.5fr repeat(6, 1fr)' }}>
          <span>#</span>
          <span>User</span>
          <span className="text-center">Total Pts</span>
          <span className="text-center">Eco-Score</span>
          <span className="text-center">Streak</span>
          <span className="text-center">Tasks</span>
          <span className="text-center">Bin Uses</span>
          <span className="text-center">Bin Pts</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-primary/5 max-h-[400px] overflow-y-auto custom-scrollbar">
          {userPoints.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="w-10 h-10 text-primary/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No users registered yet.</p>
            </div>
          ) : (
            userPoints.map((u, i) => (
              <div
                key={u.id}
                className="grid items-center px-5 py-3 hover:bg-primary/[0.02] transition-colors gap-3 lg:gap-0"
                style={{ gridTemplateColumns: '40px 1.5fr repeat(6, 1fr)' }}
              >
                {/* Rank */}
                <span className={`font-inter font-bold text-sm ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                </span>

                {/* User info */}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{u.full_name || u.username || 'Anonymous'}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.level || 'Beginner'}</p>
                </div>

                {/* Total Points */}
                <div className="text-center">
                  <span className="font-inter font-bold text-sm text-primary">{u.total_points}</span>
                </div>

                {/* Eco Score */}
                <div className="text-center">
                  <span className="text-sm text-foreground">{u.eco_score}</span>
                </div>

                {/* Streak */}
                <div className="text-center">
                  <span className="text-sm text-foreground">{u.streak_days > 0 ? `${u.streak_days} 🔥` : '0'}</span>
                </div>

                {/* Tasks */}
                <div className="text-center">
                  <span className="text-sm text-foreground">{u.tasks_completed}</span>
                </div>

                {/* Bin Deposits */}
                <div className="text-center">
                  <span className="text-sm text-foreground">{u.bin_deposits > 0 ? `${u.bin_deposits} (${(u.bin_weight_g / 1000).toFixed(1)}kg)` : '—'}</span>
                </div>

                {/* Bin Points */}
                <div className="text-center">
                  <span className={`font-inter font-bold text-sm ${u.bin_points > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {u.bin_points > 0 ? `+${u.bin_points}` : '—'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Recent Tasks</h3>
          <div className="space-y-3">
            {stats.recentTasks.map(task => (
              <div key={task.id} className="p-3 border border-primary/20 rounded-xl glass-card glass-card/40 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.location_name || 'No location'}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                  task.status === 'verified' ? 'bg-green-100 text-green-700' : 
                  task.status === 'submitted' ? 'bg-purple-100 text-purple-700' :
                  task.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {stats.recentTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks yet.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-orange-500" /> Pending Verifications</h3>
          <div className="space-y-3">
            {stats.submittedTasks.map(task => (
              <div key={task.id} className="p-3 border border-primary/20 rounded-xl glass-card glass-card/40 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.location_name || 'No location'}</p>
                </div>
                <span className="text-xs font-bold text-primary">{task.reward_points} pts</span>
              </div>
            ))}
            {stats.submittedTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending tasks to verify.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

