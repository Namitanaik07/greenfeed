import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Gift, ExternalLink, Star, Zap } from 'lucide-react';

const RewardsShopSection = () => {
  const rewardPartners = [
    {
      name: 'Amazon',
      logo: '🛒',
      url: 'https://amazon.in',
      description: 'Get shopping vouchers & eco-friendly products',
      minPoints: 100,
      color: 'from-orange-500 to-yellow-600'
    },
    {
      name: 'Flipkart',
      logo: '🏪',
      url: 'https://flipkart.com',
      description: 'Electronics, books & sustainable lifestyle products',
      minPoints: 150,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Myntra',
      logo: '👕',
      url: 'https://myntra.com',
      description: 'Sustainable fashion & eco-conscious brands',
      minPoints: 200,
      color: 'from-pink-500 to-purple-600'
    },
    {
      name: 'Nykaa',
      logo: '💄',
      url: 'https://nykaa.com',
      description: 'Natural & organic beauty products',
      minPoints: 120,
      color: 'from-rose-500 to-pink-600'
    },
    {
      name: 'BigBasket',
      logo: '🥬',
      url: 'https://bigbasket.com',
      description: 'Organic groceries & eco-friendly household items',
      minPoints: 80,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'BookMyShow',
      logo: '🎬',
      url: 'https://bookmyshow.com',
      description: 'Movie tickets & eco-documentary screenings',
      minPoints: 250,
      color: 'from-red-500 to-orange-600'
    }
  ];

  const specialRewards = [
    {
      title: 'Eco-Adventure Trip',
      description: 'Weekend getaway to eco-resorts & nature reserves',
      points: 5000,
      icon: '🏔️',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Tree Adoption Certificate',
      description: 'Adopt a tree with your name & get updates',
      points: 1000,
      icon: '🌳',
      color: 'from-green-500 to-lime-600'
    },
    {
      title: 'Solar Power Bank',
      description: 'Eco-friendly portable charging solution',
      points: 2500,
      icon: '🔋',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <section id="rewards-shop" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 border border-primary/20 rounded-full mb-6">
            <Gift className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-primary font-semibold">Rewards Marketplace</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
            <span className="text-glow bg-gradient-to-r from-primary via-secondary to-accent-solar bg-clip-text text-transparent">
              Redeem Your Impact
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Turn your environmental actions into real rewards from India's top brands
          </p>
        </div>

        {/* Shopping Partners */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Shopping Partners
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardPartners.map((partner, index) => (
              <Card key={partner.name} className="glass-card border-primary/30 p-6 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {partner.logo}
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-2">{partner.name}</h4>
                    <p className="text-sm text-foreground/70 mb-4">{partner.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-accent-solar" />
                      <span className="text-sm font-semibold">Min {partner.minPoints} points</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => window.open(partner.url, '_blank')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold py-2 rounded-xl transition-all duration-300 group-hover:glow-primary"
                  >
                    Shop Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Eco Rewards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-accent-solar" />
            Exclusive Eco Rewards
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialRewards.map((reward, index) => (
              <Card key={reward.title} className="glass-card border-primary/30 p-6 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {reward.icon}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-2">{reward.title}</h4>
                    <p className="text-sm text-foreground/70 mb-4">{reward.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-accent-solar" />
                      <span className="text-lg font-bold text-primary">{reward.points} points</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-primary/50 hover:border-primary hover:bg-primary/10 font-semibold py-2 rounded-xl transition-all duration-300"
                  >
                    Coming Soon
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How Redemption Works */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-6">How Redemption Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">1</div>
              <p className="font-semibold">Earn Points</p>
              <p className="text-sm text-foreground/70">Complete eco-actions</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">2</div>
              <p className="font-semibold">Choose Reward</p>
              <p className="text-sm text-foreground/70">Browse available options</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-accent-solar rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">3</div>
              <p className="font-semibold">Verify Points</p>
              <p className="text-sm text-foreground/70">Automatic verification</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">4</div>
              <p className="font-semibold">Get Reward</p>
              <p className="text-sm text-foreground/70">Instant coupon delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsShopSection;