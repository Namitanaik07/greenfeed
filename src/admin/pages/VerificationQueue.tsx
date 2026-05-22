import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CheckSquare, XCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SubmittedTask {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  reward_points: number;
  status: string;
  claimed_by: string | null;
  proof_url: string | null;
  submitted_at: string | null;
  location_name: string | null;
}

export const VerificationQueue = () => {
  const [tasks, setTasks] = useState<SubmittedTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SubmittedTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmitted = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('eco_tasks')
      .select('*')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false });

    if (!error && data) {
      setTasks(data as SubmittedTask[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmitted();

    const subscription = supabase
      .channel('admin_verification_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eco_tasks' }, () => {
        fetchSubmitted();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleVerify = async (id: string) => {
    setActionLoading(true);
    try {
      // 1. Update task status to verified
      const { error: taskError } = await supabase
        .from('eco_tasks')
        .update({ status: 'verified' })
        .eq('id', id);

      if (taskError) throw taskError;

      // 2. Find the task to get claimed_by and reward_points
      const task = tasks.find(t => t.id === id);
      if (task && task.claimed_by) {
        // 3. Create a point_transaction entry
        await supabase.from('point_transactions').insert([{
          user_id: task.claimed_by,
          points: task.reward_points,
          source: 'task',
          reference_id: task.id,
          description: `Verified: ${task.title}`,
        }]);

        // 4. Update user's total_points in profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_points')
          .eq('id', task.claimed_by)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ total_points: (profile.total_points || 0) + task.reward_points })
            .eq('id', task.claimed_by);
        }
      }

      toast({ title: '✅ Task verified and points awarded!' });
      setSelectedTask(null);
    } catch (err: any) {
      toast({ title: 'Error verifying task', description: err.message, variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('eco_tasks')
        .update({
          status: 'rejected',
          proof_url: null,
          submitted_at: null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: '❌ Submission rejected', variant: 'destructive' });
      setSelectedTask(null);
    } catch (err: any) {
      toast({ title: 'Error rejecting task', description: err.message, variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold font-inter">Verification Queue</h2>
          <p className="text-muted-foreground text-sm">Review user submissions and award points.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Queue List */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-primary/20 shadow-sm flex justify-between items-center">
            <span className="font-semibold text-sm">Pending Verifications</span>
            <Badge className="bg-orange-100 text-orange-700">{tasks.length}</Badge>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[600px] pr-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTask?.id === task.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-primary/20 glass-card hover:bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm line-clamp-1">{task.title}</h4>
                    <span className="text-xs font-bold text-primary shrink-0">{task.reward_points} pts</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-[10px] font-bold">
                      U
                    </div>
                    <span className="text-xs font-medium text-orange-700">{task.location_name || 'Unknown'}</span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="p-8 text-center border border-dashed border-primary/20 rounded-2xl glass-card glass-card/40">
                  <CheckSquare className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Queue is empty!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Review Details */}
        <div className="w-full lg:w-2/3">
          {selectedTask ? (
            <div className="glass-card rounded-2xl p-6 md:p-8 h-full flex flex-col border border-primary/20 bg-transparent shadow-md">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-primary/20">
                <div>
                  <h3 className="text-xl font-bold font-inter mb-2">{selectedTask.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="glass-card border-primary/20 text-muted-foreground capitalize">{selectedTask.category}</Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">Reward: {selectedTask.reward_points} Points</Badge>
                  </div>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-muted-foreground hover:text-foreground">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8 flex-1">
                {/* Task Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" /> Task Requirements
                  </h4>
                  <div className="p-4 glass-card rounded-xl border border-primary/20 text-sm text-muted-foreground leading-relaxed shadow-sm min-h-[150px]">
                    {selectedTask.description || 'No description provided.'}
                  </div>
                </div>

                {/* Proof of Work */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-orange-500" /> Submitted Proof
                  </h4>
                  <div className="p-1 glass-card rounded-xl border border-primary/20 shadow-sm relative overflow-hidden group min-h-[150px] flex items-center justify-center">
                    {selectedTask.proof_url ? (
                      <img
                        src={selectedTask.proof_url}
                        alt="Submitted proof"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground font-medium">No proof image available.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <span className="text-xs font-semibold text-orange-800">Location:</span>
                    <span className="text-xs font-medium text-orange-600">{selectedTask.location_name || 'Unknown'}</span>
                  </div>
                  {/* Geo-Verification Score (if available) */}
                  {(selectedTask as any).verification_score !== undefined && (
                    <div className={`p-3 rounded-lg border flex items-center justify-between ${
                      (selectedTask as any).verification_verdict === 'verified' ? 'bg-green-50 border-green-200' :
                      (selectedTask as any).verification_verdict === 'likely_valid' ? 'bg-yellow-50 border-yellow-200' :
                      (selectedTask as any).verification_verdict === 'suspicious' ? 'bg-orange-50 border-orange-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div>
                        <span className="text-xs font-semibold text-foreground">AI Geo-Verification</span>
                        <p className="text-[10px] text-muted-foreground capitalize">{((selectedTask as any).verification_verdict || '').replace('_', ' ')}</p>
                      </div>
                      <span className={`text-lg font-bold ${
                        (selectedTask as any).verification_score >= 80 ? 'text-green-600' :
                        (selectedTask as any).verification_score >= 60 ? 'text-yellow-600' :
                        (selectedTask as any).verification_score >= 40 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {(selectedTask as any).verification_score}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-primary/20">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white h-12 text-base shadow-sm"
                  onClick={() => handleVerify(selectedTask.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  Verify & Award Points
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-12 text-base shadow-sm"
                  onClick={() => handleReject(selectedTask.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                  Reject Submission
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card glass-card/40 rounded-2xl border border-dashed border-primary/20 text-center p-8">
              <CheckSquare className="w-16 h-16 text-primary/20 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a task to verify</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Click on a pending task from the queue to view the user's submitted proof side-by-side with the requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

