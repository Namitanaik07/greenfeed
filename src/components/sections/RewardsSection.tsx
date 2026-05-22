import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Star, Trophy, Zap, ExternalLink, ShoppingBag, Plane, Ticket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const rewardTiers = [
  {
    tier: 'Bronze',
    range: '0–500 pts',
    color: 'from-orange-200 to-orange-100',
    borderColor: 'border-orange-300',
    rewards: ['5% off eco-products', 'Digital badge', 'Community recognition'],
  },
  {
    tier: 'Silver',
    range: '500–1500 pts',
    color: 'from-gray-200 to-gray-100',
    borderColor: 'border-gray-400',
    rewards: ['Discount coupons', 'Exclusive merch', 'Priority tasks'],
  },
  {
    tier: 'Gold',
    range: '1500–4000 pts',
    color: 'from-yellow-200 to-yellow-100',
    borderColor: 'border-yellow-400',
    rewards: ['Eco trips', 'Premium rewards', 'Partner vouchers'],
  },
];

const shopLinks = [
  { name: 'Amazon', url: 'https://www.amazon.in', icon: ShoppingBag, color: 'text-yellow-600' },
  { name: 'Flipkart', url: 'https://www.flipkart.com', icon: ShoppingBag, color: 'text-secondary' },
  { name: 'Myntra', url: 'https://www.myntra.com', icon: ShoppingBag, color: 'text-pink-500' },
  { name: 'Swiggy', url: 'https://www.swiggy.com', icon: Ticket, color: 'text-orange-500' },
  { name: 'Zomato', url: 'https://www.zomato.com', icon: Ticket, color: 'text-red-500' },
  { name: 'MakeMyTrip', url: 'https://www.makemytrip.com', icon: Plane, color: 'text-primary' },
];

function getActiveTier(points: number): number {
  if (points >= 1500) return 2;
  if (points >= 500) return 1;
  return 0;
}

const RewardsSection = () => {
  const { profile } = useAuth();

  // Use real profile data with sensible defaults
  const userPoints = profile?.total_points ?? 0;
  const userTasks = profile?.tasks_completed ?? 0;
  const userStreak = profile?.streak_days ?? 0;
  const userImpact = profile?.eco_score ?? 0;
  const userLevel = profile?.level ?? 'Beginner';
  const userBadges = ['First Action', 'Week Warrior', 'River Saver', 'Tree Planter', '10 Tasks'];

  const activeTierIdx = getActiveTier(userPoints);
  const levelProgress = userPoints >= 1500 ? 100 : userPoints >= 500 ? 66 : 33;
  const ptsToNext = activeTierIdx < 2 ? rewardTiers[activeTierIdx + 1].range.split('–')[0]?.replace(/\D/g, '') : null;

  return (
    <section id="rewards" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <Gift className="w-4 h-4 text-yellow-500" />
            <span className="text-foreground/80">Your Rewards</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-inter font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
              Share
            </span>{' '}
            & Get Rewards
          </h2>
        </div>

        {/* User Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card rounded-[16px] p-8 fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-inter font-black text-primary">{userPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-inter font-black text-secondary">{userTasks}</div>
                <div className="text-sm text-muted-foreground">Tasks Done</div>
              </div>
              <div>
                <div className="text-3xl font-inter font-black text-orange-500">{userStreak}🔥</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-inter font-black text-secondary">{userImpact}</div>
                <div className="text-sm text-muted-foreground">Eco-Score</div>
              </div>
            </div>

            {/* Level */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter font-bold text-foreground text-sm">{userLevel}</span>
                <span className="text-xs text-muted-foreground">
                  {ptsToNext ? `${ptsToNext} pts to next tier` : 'Max tier reached!'}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {userBadges.map((badge) => (
                <Badge key={badge} className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <Star className="w-3 h-3 mr-1" /> {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {rewardTiers.map((tier, i) => (
            <div
              key={tier.tier}
              className={`glass-card rounded-[16px] p-6 hover-lift fade-in relative ${i === activeTierIdx ? 'ring-2 ring-primary' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {i === activeTierIdx && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white text-xs font-inter">Current</Badge>
                </div>
              )}
              <div className={`h-2 rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
              <h3 className="text-xl font-inter font-bold text-foreground mb-1">{tier.tier}</h3>
              <p className="text-xs text-muted-foreground mb-4 font-mono">{tier.range}</p>
              <ul className="space-y-2">
                {tier.rewards.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rewards Shop */}
        <div className="max-w-4xl mx-auto fade-in">
          <h3 className="text-2xl font-inter font-bold text-center text-foreground mb-8 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Redeem Your Points
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shopLinks.map((shop) => (
              <a
                key={shop.name}
                href={shop.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 rounded-xl hover-lift flex items-center gap-4 group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-muted/50">
                  <shop.icon className={`w-6 h-6 ${shop.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{shop.name}</div>
                  <div className="text-xs text-muted-foreground">Redeem points</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
