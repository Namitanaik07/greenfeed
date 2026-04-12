import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Lock, CheckCircle, AlertTriangle, Trash2, Droplets, Wind, Construction, CloudRain } from 'lucide-react';
import { environmentalTasks, type EnvironmentalTask } from '@/data/mockTasks';
import { useToast } from '@/hooks/use-toast';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const categoryIcons: Record<string, React.ElementType> = {
  'Garbage Cleanup': Trash2,
  'Water Pollution': Droplets,
  'Waste Management': AlertTriangle,
  'Air Pollution': Wind,
  'Illegal Dumping': Construction,
  'Drainage': CloudRain,
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-primary/20 text-primary border-primary/30',
  Medium: 'bg-accent-solar/20 text-accent-solar border-accent-solar/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const SpotIssuesSection = () => {
  const [tasks, setTasks] = useState<EnvironmentalTask[]>(environmentalTasks);
  const { toast } = useToast();
  const scrollToSection = useScrollToSection();

  const handleClaim = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: 'in_progress' as const, claimedBy: 'current_user' } : t
      )
    );
    toast({
      title: '🎯 Task Claimed!',
      description: 'This task is now assigned to you. Head to "Take Action" to submit proof.',
    });
    setTimeout(() => scrollToSection('take-action'), 1500);
  };

  return (
    <section id="spot-issues" className="py-24 px-4 bg-background-secondary">
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
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Browse real-world environmental problems in your area. Claim a task and make a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => {
            const Icon = categoryIcons[task.category] || AlertTriangle;
            const isClaimed = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`glass-card rounded-2xl overflow-hidden hover-lift fade-in relative ${isClaimed ? 'opacity-70' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isClaimed && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                    <div className="flex items-center gap-2 text-primary font-orbitron font-bold">
                      <Lock className="w-5 h-5" />
                      In Progress
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="p-6 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-primary">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <Badge className={`${difficultyColors[task.difficulty]} border text-xs font-orbitron`}>
                      {task.difficulty}
                    </Badge>
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
                    <span className="truncate">{task.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent-solar" />
                      <span className="font-orbitron font-bold text-accent-solar">{task.rewardPoints} pts</span>
                    </div>

                    <Button
                      size="sm"
                      disabled={isClaimed}
                      className="bg-gradient-primary text-primary-foreground font-semibold rounded-lg glow-primary text-xs"
                      onClick={() => handleClaim(task.id)}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" /> Claimed
                        </>
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
      </div>
    </section>
  );
};

export default SpotIssuesSection;
