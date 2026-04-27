import { useState } from 'react';
import { Coins, Gift, Trophy, Star, TreePine, Recycle, Droplets, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressModal from '@/components/modals/ProgressModal';

const RewardsSystemSection = () => {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const categories = [
    { icon: TreePine, name: "Tree Planting", points: "50-200", color: "from-green-500 to-emerald-600" },
    { icon: Recycle, name: "Recycling & Waste", points: "10-100", color: "from-blue-500 to-cyan-600" },
    { icon: Droplets, name: "Water Conservation", points: "20-150", color: "from-cyan-500 to-blue-600" },
    { icon: Zap, name: "Energy Saving", points: "30-200", color: "from-yellow-500 to-orange-600" }
  ];

  const rewardTiers = [
    {
      points: "100",
      reward: "Shopping Coupon",
      description: "₹50-200 discount on eco-friendly products",
      icon: Gift,
      color: "from-primary to-primary-glow"
    },
    {
      points: "500",
      reward: "Eco-Merch Bundle",
      description: "Sustainable products & branded merchandise",
      icon: Star,
      color: "from-secondary to-secondary-glow"
    },
    {
      points: "1000",
      reward: "Eco-Trip Experience",
      description: "Sponsored nature trips & conservation tours",
      icon: Trophy,
      color: "from-accent to-accent-solar"
    }
  ];

  const badges = [
    { name: "Tree Guardian 🌳", requirement: "Plant 50+ trees" },
    { name: "Ocean Saver 🌊", requirement: "Clean 10+ water bodies" },
    { name: "Plastic-Free Hero 🚯", requirement: "100+ plastic alternatives" },
    { name: "Energy Saver 🔌", requirement: "50+ energy conservation acts" }
  ];

  return (
    <>
      <ProgressModal 
        isOpen={isProgressModalOpen} 
        onClose={() => setIsProgressModalOpen(false)} 
      />
      <section id="rewards" className="py-24 px-4 ">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            <span className="text-glow bg-gradient-to-r from-accent-solar to-accent bg-clip-text text-transparent">
              Reward Scale
            </span>{' '}
            System
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
            Earn points based on the impact and scale of your environmental actions. Every action counts, 
            and every point brings you closer to amazing rewards.
          </p>
        </div>

        {/* Action Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-orbitron font-bold text-center mb-12 fade-in">
            Environmental Action Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-xl text-center group hover-lift slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-orbitron font-bold mb-2">{category.name}</h4>
                <div className="text-2xl font-bold text-accent-solar mb-1">{category.points}</div>
                <div className="text-sm text-foreground/60">points range</div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Scale */}
        <div className="mb-16 fade-in">
          <h3 className="text-2xl font-orbitron font-bold text-center mb-12">
            Impact Scale & Point Allocation
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { level: "Low Impact", points: "1-10", desc: "Daily eco-actions", color: "from-green-400 to-green-500" },
              { level: "Medium Impact", points: "11-50", desc: "Community influence", color: "from-blue-400 to-blue-500" },
              { level: "High Impact", points: "51-200", desc: "Long-term benefits", color: "from-purple-400 to-purple-500" },
              { level: "Exceptional", points: "200+", desc: "Large-scale initiatives", color: "from-orange-400 to-red-500" }
            ].map((scale, index) => (
              <div key={index} className="glass-card p-6 rounded-xl text-center group hover-lift">
                <div className={`h-2 w-full bg-gradient-to-r ${scale.color} rounded-full mb-4 group-hover:scale-105 transition-transform`}></div>
                <h4 className="font-orbitron font-bold text-lg mb-2">{scale.level}</h4>
                <div className="text-3xl font-black text-foreground mb-2">{scale.points}</div>
                <div className="text-sm text-foreground/60">{scale.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="mb-16">
          <h3 className="text-2xl font-orbitron font-bold text-center mb-12 fade-in">
            Reward Conversion Tiers
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {rewardTiers.map((tier, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-2xl text-center group hover-lift slide-in-right"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <tier.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Coins className="w-6 h-6 text-accent-solar" />
                  <span className="text-3xl font-orbitron font-black text-foreground">{tier.points}</span>
                  <span className="text-foreground/60">points</span>
                </div>
                
                <h4 className="text-xl font-orbitron font-bold mb-3">{tier.reward}</h4>
                <p className="text-foreground/70">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Features */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Badges */}
          <div className="slide-in-left">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-orbitron font-bold mb-6 text-center">
                Achievement Badges
              </h3>
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-card hover:bg-gradient-primary/10 transition-colors">
                    <div className="text-2xl">{badge.name.split(' ')[1]}</div>
                    <div>
                      <div className="font-semibold">{badge.name.split(' ')[0]} {badge.name.split(' ')[2] || ''}</div>
                      <div className="text-sm text-foreground/60">{badge.requirement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="slide-in-right">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-orbitron font-bold mb-6 text-center">
                Monthly Leaderboard
              </h3>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "EcoWarrior_Raj", points: 2340, badge: "🏆" },
                  { rank: 2, name: "GreenQueen_Priya", points: 2180, badge: "🥈" },
                  { rank: 3, name: "TreePlanter_Arjun", points: 1950, badge: "🥉" },
                  { rank: 4, name: "CleanIndia_Meera", points: 1820, badge: "🌟" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card hover:bg-gradient-secondary/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{user.badge}</div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-foreground/60">Rank #{user.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent-solar">{user.points}</div>
                      <div className="text-sm text-foreground/60">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center fade-in">
          <div className="glass-card-accent p-8 rounded-2xl inline-block">
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              Start earning rewards for your eco-actions today!
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md">
              Every small action adds up. Join thousands of users already earning rewards for saving the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-accent text-white font-semibold px-8 py-4 rounded-xl glow-accent hover:scale-105 transition-all duration-300"
                onClick={() => setIsProgressModalOpen(true)}
              >
                View My Progress
              </Button>
              
              <Button 
                size="lg"
                onClick={() => {
                  const section = document.getElementById('rewards-shop');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-xl glow-primary transition-all duration-300"
              >
                Shop Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default RewardsSystemSection;
