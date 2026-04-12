import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Calendar, TrendingUp, Star, Gift, Flame, TreePine, Droplets, Recycle, Zap } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgressModal = ({ isOpen, onClose }: ProgressModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const userProgress = {
    totalPoints: 2340,
    currentTier: 'Green Guardian',
    nextTier: 'Eco Champion',
    pointsToNext: 660,
    streak: 15,
    totalActions: 47,
    monthlyGoal: 500,
    currentMonthPoints: 380
  };

  const actionStats = [
    { category: 'Tree Planting', icon: TreePine, count: 12, points: 840, color: 'from-green-500 to-emerald-600' },
    { category: 'Water Conservation', icon: Droplets, count: 8, points: 560, color: 'from-cyan-500 to-blue-600' },
    { category: 'Recycling', icon: Recycle, count: 15, points: 450, color: 'from-blue-500 to-cyan-600' },
    { category: 'Energy Saving', icon: Zap, count: 12, points: 490, color: 'from-yellow-500 to-orange-600' }
  ];

  const monthlyProgress = [
    { month: 'Jan', points: 320 },
    { month: 'Feb', points: 480 },
    { month: 'Mar', points: 380 }
  ];

  const achievements = [
    { name: 'First Action', desc: 'Posted your first eco-action', unlocked: true, icon: '🎯' },
    { name: 'Tree Lover', desc: 'Planted 10+ trees', unlocked: true, icon: '🌳' },
    { name: 'Water Guardian', desc: 'Saved 1000L+ water', unlocked: true, icon: '💧' },
    { name: 'Streak Master', desc: '15 day posting streak', unlocked: true, icon: '🔥' },
    { name: 'Community Leader', desc: '100+ followers', unlocked: false, icon: '👑' },
    { name: 'Eco Champion', desc: 'Reach 3000 points', unlocked: false, icon: '🏆' }
  ];

  const rewards = [
    { points: 100, reward: '₹50 Amazon Voucher', claimed: true },
    { points: 500, reward: 'Eco-friendly Kit', claimed: true },
    { points: 1000, reward: '₹500 Flipkart Voucher', claimed: false },
    { points: 2000, reward: 'Nature Photography Workshop', claimed: false },
    { points: 3000, reward: 'Weekend Eco-Trip', claimed: false }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-center">
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Eco Progress
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/70">
            Track your environmental impact and rewards journey
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Current Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent-solar" />
                  Current Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Points</span>
                    <span className="font-bold text-accent-solar text-xl">{userProgress.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current Tier</span>
                    <span className="px-3 py-1 bg-gradient-primary rounded-full text-white font-semibold">
                      {userProgress.currentTier}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Progress to {userProgress.nextTier}</span>
                      <span className="text-sm text-foreground/60">{userProgress.pointsToNext} points to go</span>
                    </div>
                    <Progress 
                      value={((3000 - userProgress.pointsToNext) / 3000) * 100} 
                      className="h-3 bg-background-secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Monthly Goal
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>March Progress</span>
                    <span className="text-sm text-foreground/60">
                      {userProgress.currentMonthPoints}/{userProgress.monthlyGoal}
                    </span>
                  </div>
                  <Progress 
                    value={(userProgress.currentMonthPoints / userProgress.monthlyGoal) * 100} 
                    className="h-3 bg-background-secondary"
                  />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">76%</div>
                    <div className="text-sm text-foreground/60">Goal Completion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center rounded-xl">
                <Flame className="w-8 h-8 mx-auto mb-2 text-accent-solar" />
                <div className="text-2xl font-bold">{userProgress.streak}</div>
                <div className="text-sm text-foreground/60">Day Streak</div>
              </div>
              <div className="glass-card p-4 text-center rounded-xl">
                <TreePine className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{userProgress.totalActions}</div>
                <div className="text-sm text-foreground/60">Eco Actions</div>
              </div>
              <div className="glass-card p-4 text-center rounded-xl">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-foreground/60">Avg Rating</div>
              </div>
              <div className="glass-card p-4 text-center rounded-xl">
                <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">₹850</div>
                <div className="text-sm text-foreground/60">Rewards Earned</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            {/* Action Breakdown */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Action Category Breakdown
              </h3>
              <div className="space-y-4">
                {actionStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{stat.category}</div>
                          <div className="text-sm text-foreground/60">{stat.count} actions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent-solar">{stat.points}</div>
                        <div className="text-sm text-foreground/60">points</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-orbitron font-bold mb-6">Monthly Progress Trend</h3>
              <div className="flex items-end gap-4 h-32">
                {monthlyProgress.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-primary rounded-t-lg transition-all duration-500"
                      style={{ height: `${(month.points / 500) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-sm font-semibold">{month.month}</div>
                    <div className="text-xs text-foreground/60">{month.points}pts</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-solar" />
                Achievements & Badges
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-foreground/20 bg-gradient-card opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-foreground/60">{achievement.desc}</p>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-500">
                          <Trophy className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6 mt-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Rewards & Redemptions
              </h3>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      userProgress.totalPoints >= reward.points
                        ? reward.claimed
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-accent-solar bg-accent-solar/10'
                        : 'border-foreground/20 bg-gradient-card opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{reward.reward}</h4>
                        <p className="text-sm text-foreground/60">{reward.points} points required</p>
                      </div>
                      <div>
                        {reward.claimed ? (
                          <Button variant="outline" size="sm" disabled>
                            ✓ Claimed
                          </Button>
                        ) : userProgress.totalPoints >= reward.points ? (
                          <Button size="sm" className="bg-gradient-primary text-white">
                            Redeem Now
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            {reward.points - userProgress.totalPoints} more points
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-4">
          <Button onClick={onClose} variant="outline" className="px-8">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;