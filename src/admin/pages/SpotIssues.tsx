import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EcoTask {
  id: string;
  title: string;
  description: string;
  location_name: string;
  category: string;
  difficulty: string;
  reward_points: number;
  status: string;
  created_at: string;
  claimed_by?: string;
  created_by?: string | null;
}

export const SpotIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<EcoTask[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<EcoTask>>({
    category: 'General',
    difficulty: 'Easy',
    reward_points: 50,
    status: 'open'
  });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('eco_tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({ title: 'Error fetching tasks', description: error.message, variant: 'destructive' });
    } else {
      setIssues(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    const subscription = supabase
      .channel('admin_eco_tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eco_tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const resetForm = () => { 
    setForm({ category: 'General', difficulty: 'Easy', reward_points: 50, status: 'open' }); 
    setEditId(null); 
    setAdding(false); 
  };

  const startEdit = (item: EcoTask) => {
    setEditId(item.id);
    setAdding(false);
    setForm({ ...item });
  };

  const startAdd = () => { resetForm(); setAdding(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const { error } = await supabase.from('eco_tasks').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting task', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🗑️ Task deleted' });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.location_name) {
      toast({ title: 'Missing fields', description: 'Title and location are required.', variant: 'destructive' });
      return;
    }

    const taskData: Record<string, any> = {
      title: form.title,
      description: form.description || '',
      location_name: form.location_name,
      category: form.category || 'General',
      difficulty: form.difficulty || 'Easy',
      reward_points: form.reward_points || 50,
      status: form.status || 'open'
    };
    
    if (editId) {
      const { error } = await supabase.from('eco_tasks').update(taskData).eq('id', editId);
      if (error) {
        toast({ title: 'Error updating task', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: '✏️ Task updated' });
    } else {
      taskData.created_by = user?.id || null;
      const { error } = await supabase.from('eco_tasks').insert([taskData]);
      if (error) {
        toast({ title: 'Error creating task', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: '✅ Task created' });
    }
    
    resetForm();
  };

  const difficultyColor = (diff: string) => {
    if (diff === 'Hard') return 'bg-red-100 text-red-700 border-red-300';
    if (diff === 'Medium') return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  const statusColor = (s: string) => {
    if (s === 'open') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (s === 'in_progress') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (s === 'submitted') return 'bg-purple-100 text-purple-700 border-purple-300';
    if (s === 'verified') return 'bg-green-100 text-green-700 border-green-300';
    if (s === 'rejected') return 'bg-red-100 text-red-700 border-red-300';
    return 'bg-gray-100 text-gray-600 border-gray-300';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold font-inter">Task Creation & Issues</h2>
          <p className="text-muted-foreground text-sm">Add and manage environmental tasks for users.</p>
        </div>
      </div>

      {(adding || editId) && (
        <div className="glass-card rounded-[16px] p-6 border border-primary/20 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-inter font-bold flex items-center gap-2">
              {editId ? <><Pencil className="w-4 h-4 text-primary" /> Edit Task</> : <><Plus className="w-4 h-4 text-primary" /> Create New Task</>}
            </h3>
            <Button size="sm" variant="ghost" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="border-primary/20" placeholder="e.g. Beach Cleanup" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Input value={form.location_name || ''} onChange={e => setForm({ ...form, location_name: e.target.value })} className="border-primary/20" placeholder="e.g. Marina Beach" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="border-primary/20 min-h-[80px]" placeholder="Detailed description of the task..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select 
                value={form.category || 'General'} 
                onChange={e => setForm({ ...form, category: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-primary/20 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="General">General</option>
                <option value="Garbage Cleanup">Garbage Cleanup</option>
                <option value="Water Pollution">Water Pollution</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Air Pollution">Air Pollution</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
                <option value="Tree Planting">Tree Planting</option>
                <option value="Drainage">Drainage</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
              <select 
                value={form.difficulty || 'Easy'} 
                onChange={e => setForm({ ...form, difficulty: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-primary/20 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Reward Points</label>
              <Input type="number" value={form.reward_points || 0} onChange={e => setForm({ ...form, reward_points: parseInt(e.target.value) || 0 })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select 
                value={form.status || 'open'} 
                onChange={e => setForm({ ...form, status: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-primary/20 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4 bg-primary text-white gap-2"><Save className="w-4 h-4" /> {editId ? 'Update Task' : 'Publish Task'}</Button>
        </div>
      )}

      {!adding && !editId && (
        <div className="flex justify-between items-center glass-card p-4 rounded-2xl border border-primary/20 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground ml-2">Total Tasks: {issues.length}</p>
          <Button size="sm" onClick={startAdd} className="bg-primary text-white gap-2 rounded-xl"><Plus className="w-4 h-4" /> Create New Task</Button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
        <div className="hidden md:grid px-6 py-4 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px' }}>
          <span className="text-xs font-bold text-muted-foreground uppercase">Task Details</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Location</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Difficulty & Pts</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
          <span className="text-xs font-bold text-muted-foreground uppercase text-right">Actions</span>
        </div>
        
        {loading ? (
          <div className="px-6 py-10 text-center text-muted-foreground">Loading tasks...</div>
        ) : (
          <div className="divide-y divide-primary/20/50">
            {issues.map(item => (
              <div key={item.id} className="grid items-center px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors" style={{ gridTemplateColumns: '1fr', md: { gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px' } }}>
                <div className="pr-4 mb-2 md:mb-0">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.category}</p>
                </div>
                <span className="text-sm font-medium mb-2 md:mb-0 block">{item.location_name}</span>
                <div className="mb-2 md:mb-0">
                  <Badge variant="outline" className={`${difficultyColor(item.difficulty)} text-[10px] mr-2`}>{item.difficulty}</Badge>
                  <span className="text-xs font-semibold text-primary">{item.reward_points} pts</span>
                </div>
                <div className="mb-2 md:mb-0"><Badge variant="outline" className={`${statusColor(item.status)} text-[10px]`}>{item.status.replace('_', ' ')}</Badge></div>
                <div className="flex gap-1 justify-end mt-2 md:mt-0">
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 w-8 p-0 rounded-full" onClick={() => startEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {issues.length === 0 && (
              <div className="px-6 py-16 text-center">
                <AlertTriangle className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No tasks found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

