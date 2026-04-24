import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  LayoutDashboard, Users, ClipboardList, Shield, Wifi, WifiOff,
  Plus, Trash2, CheckCircle, XCircle, BarChart3, Activity,
  Leaf, AlertTriangle, TrendingUp
} from 'lucide-react';

// Tabs
type AdminTab = 'overview' | 'tasks' | 'users' | 'moderation' | 'bins';

// Mock data for demo
const mockStats = {
  totalUsers: 2847,
  dailyActive: 412,
  totalTasks: 156,
  openTasks: 23,
  completedTasks: 118,
  wasteCollected: 4218,
  activeBins: 12,
};

const mockUsers = [
  { id: 'u1', full_name: 'Priya Sharma', email: 'priya@example.com', total_points: 4520, level: 'Eco Hero', role: 'user', status: 'active' },
  { id: 'u2', full_name: 'Rahul Verma', email: 'rahul@example.com', total_points: 3890, level: 'Eco Hero', role: 'user', status: 'active' },
  { id: 'u3', full_name: 'Ananya Patel', email: 'ananya@example.com', total_points: 3210, level: 'Eco Hero', role: 'user', status: 'active' },
  { id: 'u4', full_name: 'Arjun Singh', email: 'arjun@example.com', total_points: 2780, level: 'Intermediate', role: 'user', status: 'active' },
  { id: 'u5', full_name: 'Meera Reddy', email: 'meera@example.com', total_points: 2450, level: 'Intermediate', role: 'user', status: 'suspended' },
];

const mockBins = [
  { id: 'bin-001', area_name: 'MITE Campus - Block A', is_online: true, fill_level: 45, last_seen: new Date(Date.now() - 30000).toISOString(), total_interactions: 234 },
  { id: 'bin-002', area_name: 'MITE Campus - Canteen', is_online: true, fill_level: 72, last_seen: new Date(Date.now() - 60000).toISOString(), total_interactions: 512 },
  { id: 'bin-003', area_name: 'MITE Campus - Library', is_online: false, fill_level: 15, last_seen: new Date(Date.now() - 3600000).toISOString(), total_interactions: 89 },
  { id: 'bin-004', area_name: 'Community Park', is_online: true, fill_level: 88, last_seen: new Date(Date.now() - 120000).toISOString(), total_interactions: 178 },
];

const mockFlaggedPosts = [
  { id: 'fp1', author: 'user123', content: 'Buy cheap electronics here!!! Visit...', reports: 5, reason: 'Spam / irrelevant content' },
  { id: 'fp2', author: 'greenuser', content: 'This cleanup drive was fake, I saw them staging photos...', reports: 3, reason: 'Misinformation / unverified claim' },
];

const AdminPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [searchUser, setSearchUser] = useState('');

  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', category: 'cleanup', deadline: '',
    max_claimants: '20', points_reward: '50',
  });
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(20);
        if (error) throw error;
        setTasks(data || []);
      } catch {
        setTasks([
          { id: 't1', title: 'Beach Cleanup Drive', category: 'cleanup', status: 'published', points_reward: 50, deadline: new Date(Date.now() + 86400000 * 3).toISOString() },
          { id: 't2', title: 'Tree Planting at City Park', category: 'planting', status: 'published', points_reward: 75, deadline: new Date(Date.now() + 86400000 * 5).toISOString() },
          { id: 't3', title: 'River Bank Cleanup', category: 'cleanup', status: 'draft', points_reward: 100, deadline: new Date(Date.now() + 86400000 * 7).toISOString() },
        ]);
      }
    }
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Leaf className="w-10 h-10 text-primary animate-pulse" /></div>;
  }
  if (!user) return null;

  const handleCreateTask = async () => {
    if (!taskForm.title || !taskForm.description) {
      toast({ title: 'Fill all required fields', variant: 'destructive' }); return;
    }
    try {
      const { error } = await supabase.from('tasks').insert({
        title: taskForm.title, description: taskForm.description, category: taskForm.category,
        deadline: taskForm.deadline || new Date(Date.now() + 86400000 * 7).toISOString(),
        max_claimants: parseInt(taskForm.max_claimants), points_reward: parseInt(taskForm.points_reward),
        status: 'published', created_by: user.id,
      });
      if (error) throw error;
      toast({ title: '✅ Task created!', description: 'Published and visible to users.' });
    } catch {
      toast({ title: '✅ Task created (demo)', description: 'Supabase migration pending — mock success.' });
    }
    setTasks(prev => [{ id: `new-${Date.now()}`, ...taskForm, status: 'published', points_reward: parseInt(taskForm.points_reward) }, ...prev]);
    setTaskForm({ title: '', description: '', category: 'cleanup', deadline: '', max_claimants: '20', points_reward: '50' });
  };

  const filteredUsers = mockUsers.filter(u =>
    u.full_name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'bins', label: 'Smart Bins', icon: Activity },
  ];

  return (
    <div className="min-h-screen pt-16">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-inter font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">GreenFeed Platform Management</p>
          </div>
          <Badge className="bg-red-100 text-red-700 border-red-300">Admin Access</Badge>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <Button
              key={t.id}
              variant={tab === t.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTab(t.id)}
              className={`gap-2 rounded-xl whitespace-nowrap ${tab === t.id ? 'bg-primary text-white' : 'border-[#CFF5D6] text-muted-foreground'}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </Button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'text-primary' },
                { label: 'Daily Active', value: mockStats.dailyActive.toLocaleString(), icon: TrendingUp, color: 'text-secondary' },
                { label: 'Tasks Open', value: mockStats.openTasks, icon: ClipboardList, color: 'text-primary' },
                { label: 'Waste (kg)', value: mockStats.wasteCollected.toLocaleString(), icon: BarChart3, color: 'text-secondary' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-[16px] p-5 hover-lift">
                  <s.icon className={`w-6 h-6 mb-2 ${s.color}`} />
                  <div className="font-inter font-black text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-[16px] p-6">
                <h3 className="font-inter font-bold mb-4">Task Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Open', value: mockStats.openTasks, color: 'bg-primary', pct: (mockStats.openTasks / mockStats.totalTasks) * 100 },
                    { label: 'Completed', value: mockStats.completedTasks, color: 'bg-secondary', pct: (mockStats.completedTasks / mockStats.totalTasks) * 100 },
                    { label: 'In Progress', value: mockStats.totalTasks - mockStats.openTasks - mockStats.completedTasks, color: 'bg-yellow-400', pct: 10 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-[16px] p-6">
                <h3 className="font-inter font-bold mb-4">Smart Bin Status</h3>
                <div className="space-y-3">
                  {mockBins.map(bin => (
                    <div key={bin.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-[#CFF5D6]">
                      {bin.is_online ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-400" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{bin.area_name}</p>
                        <p className="text-xs text-muted-foreground">Fill: {bin.fill_level}%</p>
                      </div>
                      <Badge className={bin.is_online ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
                        {bin.is_online ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {tab === 'tasks' && (
          <div className="space-y-6">
            <div className="glass-card rounded-[16px] p-6">
              <h3 className="font-inter font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Create New Task</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Task Title *" value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} className="border-[#CFF5D6]" />
                <select value={taskForm.category} onChange={e => setTaskForm(p => ({ ...p, category: e.target.value }))} className="border border-[#CFF5D6] rounded-lg px-3 py-2 text-sm bg-white text-foreground">
                  <option value="cleanup">Cleanup</option>
                  <option value="segregation">Segregation</option>
                  <option value="planting">Planting</option>
                  <option value="awareness">Awareness</option>
                </select>
                <Textarea placeholder="Description *" value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} className="border-[#CFF5D6] md:col-span-2" />
                <Input type="date" value={taskForm.deadline} onChange={e => setTaskForm(p => ({ ...p, deadline: e.target.value }))} className="border-[#CFF5D6]" />
                <div className="flex gap-2">
                  <Input placeholder="Max Claimants" type="number" value={taskForm.max_claimants} onChange={e => setTaskForm(p => ({ ...p, max_claimants: e.target.value }))} className="border-[#CFF5D6]" />
                  <Input placeholder="Points" type="number" value={taskForm.points_reward} onChange={e => setTaskForm(p => ({ ...p, points_reward: e.target.value }))} className="border-[#CFF5D6]" />
                </div>
              </div>
              <Button onClick={handleCreateTask} className="mt-4 bg-primary text-white gap-2"><Plus className="w-4 h-4" /> Publish Task</Button>
            </div>
            <div className="glass-card rounded-[16px] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#CFF5D6]"><h3 className="font-inter font-bold">Existing Tasks</h3></div>
              <div className="divide-y divide-[#CFF5D6]/50">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{t.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">{t.category}</Badge>
                        <Badge className={t.status === 'published' ? 'bg-green-100 text-green-700 border-green-300 text-[10px]' : 'bg-gray-100 text-gray-500 border-gray-300 text-[10px]'}>{t.status}</Badge>
                      </div>
                    </div>
                    <span className="font-inter font-bold text-primary text-sm">{t.points_reward} pts</span>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="space-y-6">
            <Input placeholder="Search users by name or email..." value={searchUser} onChange={e => setSearchUser(e.target.value)} className="border-[#CFF5D6] max-w-md" />
            <div className="glass-card rounded-[16px] overflow-hidden">
              <div className="divide-y divide-[#CFF5D6]/50">
                {filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center text-white font-bold text-sm">{u.full_name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-inter font-bold text-primary text-sm">{u.total_points.toLocaleString()} pts</p>
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">{u.level}</Badge>
                    </div>
                    <Badge className={u.status === 'active' ? 'bg-green-100 text-green-700 border-green-300 text-[10px]' : 'bg-red-100 text-red-700 border-red-300 text-[10px]'}>{u.status}</Badge>
                    <Button variant="outline" size="sm" className="text-xs border-red-200 text-red-500" onClick={() => toast({ title: `User ${u.full_name} suspended` })}>
                      Suspend
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODERATION TAB */}
        {tab === 'moderation' && (
          <div className="space-y-4">
            <h3 className="font-inter font-bold text-foreground flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" /> Flagged Content ({mockFlaggedPosts.length})</h3>
            {mockFlaggedPosts.map(post => (
              <div key={post.id} className="glass-card rounded-[16px] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">By: {post.author}</p>
                    <Badge className="bg-red-100 text-red-700 border-red-300 text-[10px] mt-1">{post.reports} reports — {post.reason}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl mb-4">{post.content}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-500 text-white gap-1" onClick={() => toast({ title: 'Post approved ✅' })}><CheckCircle className="w-4 h-4" /> Approve</Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => toast({ title: 'Post removed 🗑️' })}><XCircle className="w-4 h-4" /> Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BINS TAB */}
        {tab === 'bins' && (
          <div className="space-y-4">
            <h3 className="font-inter font-bold text-foreground flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Smart Bin Fleet</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mockBins.map(bin => (
                <div key={bin.id} className="glass-card rounded-[16px] p-6 hover-lift">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-inter font-bold text-foreground">{bin.area_name}</h4>
                    {bin.is_online ? <Badge className="bg-green-100 text-green-700 border-green-300 gap-1"><Wifi className="w-3 h-3" /> Online</Badge> : <Badge className="bg-red-100 text-red-700 border-red-300 gap-1"><WifiOff className="w-3 h-3" /> Offline</Badge>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fill Level</span><span className="font-bold text-foreground">{bin.fill_level}%</span></div>
                    <div className="h-2 bg-muted rounded-full"><div className={`h-full rounded-full ${bin.fill_level > 80 ? 'bg-red-500' : bin.fill_level > 50 ? 'bg-yellow-400' : 'bg-primary'}`} style={{ width: `${bin.fill_level}%` }} /></div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last seen: {new Date(bin.last_seen).toLocaleTimeString()}</span>
                      <span>{bin.total_interactions} interactions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
