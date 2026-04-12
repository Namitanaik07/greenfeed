import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Trophy, Zap, ExternalLink, ShoppingBag, Plane, Ticket } from 'lucide-react';
import { mockUser } from '@/data/mockTasks';

const rewardTiers = [
  {
    tier: 'Basic',
    range: '0–500 pts',
    color: 'from-muted to-muted',
    borderColor: 'border-muted-foreground/30',
    rewards: ['5% off eco-products', 'Digital badge', 'Community recognition'],
  },
  {
    tier: 'Silver',
    range: '500–1500 pts',
    color: 'from-secondary/30 to-primary/30',
    borderColor: 'border-secondary/50',
    rewards: ['Discount coupons', 'Exclusive merch', 'Priority tasks'],
    active: true,
  },
  {
    tier: 'Gold',
    range: '1500+ pts',
    color: 'from-accent-solar/30 to-accent/30',
    borderColor: 'border-accent-solar/50',
    rewards: ['Eco trips', 'Premium rewards', 'Partner vouchers'],
  },
];

const shopLinks = [
  { name: 'Amazon', url: 'https://www.amazon.in', icon: ShoppingBag, color: 'text-accent-solar' },
  { name: 'Flipkart', url: 'https://www.flipkart.com', icon: ShoppingBag, color: 'text-secondary' },
  { name: 'Myntra', url: 'https://www.myntra.com', icon: ShoppingBag, color: 'text-accent' },
  { name: 'Swiggy', url: 'https://www.swiggy.com', icon: Ticket, color: 'text-accent-solar' },
  { name: 'Zomato', url: 'https://www.zomato.com', icon: Ticket, color: 'text-destructive' },
  { name: 'MakeMyTrip', url: 'https://www.makemytrip.com', icon: Plane, color: 'text-primary' },
];

const RewardsSection = () => {
  const user = mockUser;

  const levelProgress = user.level === 'Beginner' ? 33 : user.level === 'Intermediate' ? 66 : 100;

  return (
    <section id="rewards" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <Gift className="w-4 h-4 text-accent-solar" />
            <span className="text-foreground/80">Your Rewards</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-orbitron font-bold mb-4">
            <span className="text-glow-accent bg-gradient-to-r from-accent-solar to-accent bg-clip-text text-transparent">
              Share
            </span>{' '}
            & Get Rewards
          </h2>
        </div>

        {/* User Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-8 fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-orbitron font-black text-primary">{user.totalPoints}</div>
                <div className="text-sm text-foreground/50">Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-orbitron font-black text-secondary">{user.tasksCompleted}</div>
                <div className="text-sm text-foreground/50">Tasks Done</div>
              </div>
              <div>
                <div className="text-3xl font-orbitron font-black text-accent-solar">{user.streak}🔥</div>
                <div className="text-sm text-foreground/50">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-orbitron font-black text-accent">{user.impactScore}</div>
                <div className="text-sm text-foreground/50">Impact Score</div>
              </div>
            </div>

            {/* Level */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-orbitron font-bold text-foreground text-sm">{user.level}</span>
                <span className="text-xs text-foreground/50">{user.level === 'Intermediate' ? '250 pts to Eco Hero' : ''}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {user.badges.map((badge) => (
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
              className={`glass-card rounded-2xl p-6 hover-lift fade-in relative ${tier.active ? 'ring-2 ring-primary' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {tier.active && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground text-xs font-orbitron">Current</Badge>
                </div>
              )}
              <div className={`h-2 rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
              <h3 className="text-xl font-orbitron font-bold text-foreground mb-1">{tier.tier}</h3>
              <p className="text-xs text-foreground/50 mb-4 font-mono">{tier.range}</p>
              <ul className="space-y-2">
                {tier.rewards.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-sm text-foreground/70">
                    <Zap className="w-3 h-3 text-accent-solar flex-shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rewards Shop */}
        <div className="max-w-4xl mx-auto fade-in">
          <h3 className="text-2xl font-orbitron font-bold text-center text-foreground mb-8 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-accent-solar" /> Redeem Your Points
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
                  <div className="text-xs text-foreground/50">Redeem points</div>
                </div>
                <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
