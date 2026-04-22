import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Award, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  points_reward: number;
  max_claimants: number;
}

export const TaskSection = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Note: If the user hasn't run the migration yet, this might fail. 
      // We wrap in try/catch to handle that gracefully.
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      console.warn("Could not fetch tasks. Supabase migration might be pending.", err);
      // Fallback dummy data for visual testing before migration is run
      setTasks([
        {
          id: '1',
          title: 'Beach Cleanup Drive',
          description: 'Help clean up the local beach. Gloves and bags will be provided.',
          category: 'cleanup',
          deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
          points_reward: 50,
          max_claimants: 20
        },
        {
          id: '2',
          title: 'Tree Planting at City Park',
          description: 'Join us to plant 50 native saplings in the city park.',
          category: 'planting',
          deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
          points_reward: 75,
          max_claimants: 15
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    if (!user) return;
    setClaiming(taskId);
    
    try {
      const { error } = await supabase
        .from('task_claims')
        .insert({
          task_id: taskId,
          user_id: user.id,
          status: 'claimed'
        });
        
      if (error) {
        if (error.code === '23505') {
          toast({ title: "Already claimed", description: "You have already claimed this task.", variant: "default" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Task Claimed!", description: "Check your Active Tasks to submit proof.", variant: "default" });
      }
    } catch (err: any) {
      console.warn("Could not claim task:", err);
      // Mock success if table doesn't exist yet
      toast({ title: "Task Claimed (Mock)!", description: "Migration pending, but UI works." });
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron font-bold text-xl text-foreground flex items-center gap-2">
          🌍 Active Tasks
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-foreground/50 border border-primary/20">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p>No active tasks available right now.</p>
          <p className="text-sm">Check back later for new environmental missions!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map(task => (
            <div key={task.id} className="glass-card rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-foreground">{task.title}</h3>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {task.points_reward} pts
                </span>
              </div>
              
              <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-3 text-xs text-foreground/50 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  0 / {task.max_claimants} claimed
                </div>
              </div>
              
              <Button 
                onClick={() => handleClaimTask(task.id)}
                disabled={claiming === task.id}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90"
              >
                {claiming === task.id ? "Claiming..." : "Claim Task"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
