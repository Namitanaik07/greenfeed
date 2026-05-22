import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Zap,
  Lock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Droplets,
  Wind,
  Construction,
  CloudRain,
  Leaf,
  Loader2,
  Map as MapIcon,
  Flame,
  Plus,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useTasks } from '@/hooks/useTasks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const categoryIcons: Record<string, React.ElementType> = {
  'Garbage Cleanup': Trash2,
  'Water Pollution': Droplets,
  'Waste Management': AlertTriangle,
  'Air Pollution': Wind,
  'Illegal Dumping': Construction,
  'Drainage': CloudRain,
  'Tree Planting': Leaf,
  'General': AlertTriangle,
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-primary/20 text-primary border-primary/30',
  Medium: 'bg-accent-solar/20 text-accent-solar border-accent-solar/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const SpotIssuesSection = () => {
  const { tasks, loading, claimTask } = useTasks();
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollToSection = useScrollToSection();
  const navigate = useNavigate();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Form states for posting a task
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState('Easy');
  const [locationNameInput, setLocationNameInput] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGettingGPS, setIsGettingGPS] = useState(false);

  // Show open and in_progress tasks so users can see what others are working on
  const displayTasks = tasks.filter(t => t.status === 'open' || t.status === 'in_progress');

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    const elements = document.querySelectorAll('#spot-issues .fade-in, #spot-issues .slide-in-left, #spot-issues .slide-in-right');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, tasks]);

  const handleClaim = async (taskId: string) => {
    setClaimingId(taskId);
    try {
      await claimTask(taskId);
      toast({
        title: '🎯 Task Claimed!',
        description: 'This task is now assigned to you. Head to "Take Action" to submit proof.',
      });
      setTimeout(() => scrollToSection('take-action'), 1500);
    } catch (err: any) {
      toast({
        title: '❌ Failed to claim task',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setClaimingId(null);
    }
  };

  const handleGetGPS = () => {
    setIsGettingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setIsGettingGPS(false);
          toast({
            title: '📍 GPS Location Captured',
            description: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          });

          // Try to reverse geocode using OpenStreetMap
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            if (data?.display_name) {
              const shortAddress = data.display_name.split(',').slice(0, 3).join(',');
              setLocationNameInput(shortAddress);
            }
          } catch (e) {
            console.error('Failed to reverse geocode', e);
          }
        },
        (error) => {
          setIsGettingGPS(false);
          toast({
            title: '❌ Location Access Failed',
            description: 'Could not fetch GPS location. Please type manually.',
            variant: 'destructive',
          });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsGettingGPS(false);
      toast({
        title: '❌ Unsupported Browser',
        description: 'GPS is not supported by your browser.',
        variant: 'destructive',
      });
    }
  };

  const handlePostTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: '🔒 Sign In Required',
        description: 'You must be signed in to post a task.',
        variant: 'destructive',
      });
      return;
    }
    if (!title.trim() || !locationNameInput.trim()) {
      toast({
        title: '⚠️ Fields Required',
        description: 'Please provide a title and location name.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingTask(true);

    // Calculate reward points based on difficulty
    const pointsMap: Record<string, number> = {
      Easy: 50,
      Medium: 100,
      Hard: 150
    };
    const rewardPoints = pointsMap[difficulty] || 50;

    try {
      const taskData = {
        title,
        description: description || '',
        location_name: locationNameInput,
        category,
        difficulty,
        reward_points: rewardPoints,
        status: 'open',
        created_by: user.id,
        latitude,
        longitude
      };

      const { error } = await supabase.from('eco_tasks').insert([taskData]);
      if (error) throw error;

      toast({
        title: '✅ Task Posted Successfully!',
        description: `"${title}" has been published and can now be claimed by other users.`,
      });

      // Reset form & close dialog
      setTitle('');
      setDescription('');
      setCategory('General');
      setDifficulty('Easy');
      setLocationNameInput('');
      setLatitude(null);
      setLongitude(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast({
        title: '❌ Failed to post task',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingTask(false);
    }
  };

  if (loading) {
    return (
      <section id="spot-issues" className="py-24 px-4">
        <div className="container mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="spot-issues" className="py-24 px-4 ">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <AlertTriangle className="w-4 h-4 text-accent-solar" />
            <span className="text-foreground/80">Environmental Issues Near You</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-orbitron font-bold mb-4">
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Spot
            </span>{' '}
            Environmental Issues
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-6">
            Browse real-world environmental problems in your area. Claim a task and make a difference.
          </p>

          {user && (
            <div className="flex justify-center">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold rounded-xl gap-2 px-6 py-5 shadow-lg glow-primary font-orbitron text-sm transition-all"
              >
                <Plus className="w-5 h-5 animate-pulse" />
                Report & Post an Issue
              </Button>
            </div>
          )}
        </div>

        {displayTasks.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl max-w-md mx-auto">
            <AlertTriangle className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-foreground/60 font-medium">No tasks available right now.</p>
            <p className="text-sm text-foreground/40 mt-2">Check back soon or post a new environmental task above!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTasks.map((task, index) => {
              const Icon = categoryIcons[task.category] || AlertTriangle;
              const isClaimingThis = claimingId === task.id;
              const isClaimed = task.status !== 'open';
              const isCreator = user && task.created_by === user.id;

              return (
                <div
                  key={task.id}
                  className="glass-card rounded-2xl overflow-hidden hover-lift fade-in relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="p-6 pb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-primary">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge className={`${difficultyColors[task.difficulty] || difficultyColors.Easy} border text-xs font-orbitron`}>
                          {task.difficulty}
                        </Badge>
                        {isCreator && (
                          <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-semibold rounded-md">
                            Posted by You
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-orbitron font-bold text-foreground mb-2 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/50">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="truncate">{task.location_name || 'Unknown location'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent-solar" />
                        <span className="font-orbitron font-bold text-accent-solar">{task.reward_points} pts</span>
                      </div>

                      <Button
                        size="sm"
                        disabled={isClaimingThis || isClaimed || isCreator}
                        className={`font-semibold rounded-lg text-xs ${
                          isClaimed || isCreator 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed border border-muted-foreground/10' 
                            : 'bg-gradient-primary text-primary-foreground glow-primary'
                        }`}
                        onClick={() => handleClaim(task.id)}
                      >
                        {isClaimingThis ? (
                          <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Claiming...</>
                        ) : isCreator ? (
                          'Created by You'
                        ) : isClaimed ? (
                          <><Lock className="w-3.5 h-3.5 mr-1" /> Claimed</>
                        ) : (
                          'Claim Task'
                        )}
                      </Button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Heatmap Redirect Banner ── */}
        <div className="mt-12 fade-in">
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-primary/20 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-500/10 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-inter font-bold text-foreground mb-1">
                  Can't find tasks nearby?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore the <span className="text-red-500 font-semibold">Environmental Heatmap</span> to discover task hotspots across all regions. Red zones need the most help!
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl gap-2 px-6 shadow-md flex-shrink-0"
                onClick={() => navigate('/heatmap')}
              >
                <MapIcon className="w-4 h-4" />
                View Heatmap
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report / Post Task Modal ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background/95 border border-primary/20 text-foreground rounded-2xl max-w-lg backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Report & Post a Task
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Help the community by spotting an environmental issue. Once posted, other users can claim and resolve it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePostTask} className="space-y-4 py-2">
            <div className="space-y-1">
              <label htmlFor="task-title" className="text-xs font-semibold text-foreground/80">Title *</label>
              <Input
                id="task-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Plastic bottles cleanup at Central Park"
                className="bg-muted/30 border-primary/20 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="task-category" className="text-xs font-semibold text-foreground/80">Category</label>
                <select
                  id="task-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-foreground"
                >
                  {Object.keys(categoryIcons).map(cat => (
                    <option key={cat} value={cat} className="bg-background text-foreground">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="task-difficulty" className="text-xs font-semibold text-foreground/80">Difficulty</label>
                <select
                  id="task-difficulty"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-foreground"
                >
                  <option value="Easy" className="bg-background text-foreground">Easy (50 pts)</option>
                  <option value="Medium" className="bg-background text-foreground">Medium (100 pts)</option>
                  <option value="Hard" className="bg-background text-foreground">Hard (150 pts)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="task-location" className="text-xs font-semibold text-foreground/80">Location Name *</label>
              <div className="flex gap-2">
                <Input
                  id="task-location"
                  value={locationNameInput}
                  onChange={e => setLocationNameInput(e.target.value)}
                  placeholder="e.g., Central Park Sector 4, Bangalore"
                  className="bg-muted/30 border-primary/20 text-sm flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGetGPS}
                  disabled={isGettingGPS}
                  className="border-primary/20 hover:bg-primary/10 h-10 w-10 flex-shrink-0"
                  title="Capture current location"
                >
                  {isGettingGPS ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4 text-primary" />
                  )}
                </Button>
              </div>
              {latitude && longitude && (
                <p className="text-[10px] text-green-500 font-medium mt-1">
                  📍 GPS Attached: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="task-description" className="text-xs font-semibold text-foreground/80">Description</label>
              <Textarea
                id="task-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in detail, e.g. amount of garbage, specific landmarks..."
                className="bg-muted/30 border-primary/20 text-sm min-h-[80px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingTask}
                className="bg-gradient-primary text-primary-foreground font-semibold px-6 hover:opacity-95"
              >
                {isSubmittingTask ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
                ) : (
                  'Publish Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpotIssuesSection;
