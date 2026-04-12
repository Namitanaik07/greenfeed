import { Camera, Gamepad2, Gift, Users, Share, Trophy } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Camera,
      title: "Post & Share",
      description: "Upload your eco-actions as reels, photos, and stories. Show the world your environmental impact with visual proof.",
      color: "from-primary to-primary-glow"
    },
    {
      icon: Gamepad2,
      title: "Gamification",
      description: "Earn points, unlock badges, climb eco-leaderboards, and compete with friends to save the planet.",
      color: "from-secondary to-secondary-glow"
    },
    {
      icon: Gift,
      title: "Real Rewards",
      description: "Redeem points for shopping coupons, eco-trips, product discounts from Amazon, Flipkart, and partner brands.",
      color: "from-accent to-accent-solar"
    },
    {
      icon: Users,
      title: "Community Challenges",
      description: "Join campaigns, participate in group challenges, and collaborate on large-scale environmental projects.",
      color: "from-primary to-secondary"
    },
    {
      icon: Share,
      title: "Cross-Platform Sharing",
      description: "Share your GreenFeed posts directly to Instagram, WhatsApp, and other social platforms to maximize impact.",
      color: "from-secondary to-accent"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock special titles, earn recognition badges, and become a certified environmental influencer.",
      color: "from-accent to-primary"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            Powerful{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Everything you need to turn environmental action into an engaging, rewarding experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`glass-card p-8 rounded-2xl hover-lift group relative overflow-hidden ${
                index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-orbitron font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Integration Showcase */}
        <div className="mt-20 fade-in">
          <div className="glass-card p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-orbitron font-bold mb-6">
              Seamlessly Integrated with Your Favorite Platforms
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg"></div>
                <span className="font-semibold">Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"></div>
                <span className="font-semibold">WhatsApp</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg"></div>
                <span className="font-semibold">Amazon</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-lg"></div>
                <span className="font-semibold">Flipkart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;