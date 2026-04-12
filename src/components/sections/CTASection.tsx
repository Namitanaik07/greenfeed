import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Bell, Globe, Sparkles } from 'lucide-react';
import EarlyAccessModal from '@/components/modals/EarlyAccessModal';
import { toast } from '@/hooks/use-toast';

const CTASection = () => {
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);

  const handleNotifyMe = () => {
    toast({
      title: "🔔 Notifications Enabled!",
      description: "We'll notify you as soon as GreenFeed launches.",
    });
  };

  return (
    <>
      <EarlyAccessModal 
        isOpen={isEarlyAccessModalOpen} 
        onClose={() => setIsEarlyAccessModalOpen(false)} 
      />
    <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
        </div>
        <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-24 h-24 rounded-full bg-secondary/10 blur-2xl"></div>
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <div className="w-40 h-40 rounded-full bg-accent/10 blur-2xl"></div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main CTA */}
          <div className="fade-in mb-16">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-card text-lg font-semibold mb-8">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-foreground/90">Join the Eco-Revolution</span>
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-orbitron font-black leading-tight mb-8">
              Be the{' '}
              <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                change.
              </span>{' '}
              Make saving Earth{' '}
              <span className="text-glow-accent bg-gradient-to-r from-accent to-accent-solar bg-clip-text text-transparent">
                the trend.
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-12">
              Every small action creates ripples of change. Join thousands of eco-warriors 
              already transforming their communities and earning rewards for saving the planet.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 slide-in-left">
            <Button 
              size="lg" 
              className="bg-gradient-primary text-white font-bold px-12 py-6 rounded-2xl text-xl glow-primary hover:scale-110 transition-all duration-300 group shadow-2xl"
              onClick={() => setIsEarlyAccessModalOpen(true)}
            >
              <Download className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Get Early Access
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-secondary text-secondary bg-transparent backdrop-blur-sm px-12 py-6 rounded-2xl text-xl hover-glow group font-bold shadow-2xl"
              onClick={handleNotifyMe}
            >
              <Bell className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Notify Me
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16 slide-in-right">
            {[
              { value: "50K+", label: "Pre-registered Users", icon: "👥" },
              { value: "₹10L+", label: "Rewards Ready", icon: "💰" },
              { value: "100+", label: "Partner Brands", icon: "🤝" },
              { value: "2025", label: "Launch Year", icon: "🚀" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="glass-card p-6 rounded-xl hover-lift mb-4">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-orbitron font-black text-accent-solar mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Early Access Features */}
          <div className="fade-in">
            <div className="glass-card-accent p-12 rounded-3xl">
              <h3 className="text-3xl font-orbitron font-bold mb-8 text-glow-accent">
                🎯 Early Access Benefits
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {[
                  {
                    title: "Exclusive Beta Access",
                    desc: "Be among the first to test all features",
                    icon: "🚀"
                  },
                  {
                    title: "Founder's Badge",
                    desc: "Special recognition as an original member",
                    icon: "🏆"
                  },
                  {
                    title: "2x Bonus Points",
                    desc: "Double rewards for the first 6 months",
                    icon: "⚡"
                  },
                  {
                    title: "Direct Developer Access",
                    desc: "Shape the app with your feedback",
                    icon: "💬"
                  },
                  {
                    title: "Premium Rewards",
                    desc: "Access to exclusive eco-trips and experiences",
                    icon: "🎁"
                  },
                  {
                    title: "Lifetime Membership",
                    desc: "No subscription fees, ever",
                    icon: "♾️"
                  }
                ].map((benefit, index) => (
                  <div 
                    key={index} 
                    className="text-center p-6 rounded-xl bg-gradient-card hover:bg-gradient-primary/10 transition-colors"
                  >
                    <div className="text-3xl mb-3">{benefit.icon}</div>
                    <h4 className="font-orbitron font-bold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-foreground/70">{benefit.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-lg text-foreground/80 mb-6">
                  Limited to first <strong>10,000 users</strong> only. Don't miss out!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-accent text-white font-bold px-10 py-4 rounded-xl glow-accent hover:scale-105 transition-all duration-300"
                    onClick={() => setIsEarlyAccessModalOpen(true)}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Join Waitlist Now
                  </Button>
                  
                  <div className="text-sm text-foreground/60">
                    📱 Available on iOS & Android
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="mt-16 fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-orbitron font-bold mb-4">
                The planet needs us. <span className="text-glow text-primary">Now.</span>
              </h3>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Every day we wait is another day of environmental damage. 
                Join GreenFeed and be part of the solution that makes saving Earth as viral as your favorite meme.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Effect */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
    </>
  );
};

export default CTASection;