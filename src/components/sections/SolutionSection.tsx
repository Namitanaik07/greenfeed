import { useState } from 'react';
import { Camera, Users, Award, Zap, Share2, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/modals/AuthModal';

const SolutionSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab="signup"
      />
      <section className="py-24 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            Introducing{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GreenFeed
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            A social media platform where people post about the eco initiatives they take when they observe 
            environmental problems happening around them. Turn every environmental challenge into an opportunity for positive action.
          </p>
        </div>

        {/* Main Solution Visual */}
        <div className="relative mb-20">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left: See Problem */}
            <div className="slide-in-left">
              <div className="glass-card p-8 rounded-2xl text-center group hover-lift">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TreePine className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-4">Spot Environmental Issues</h3>
                <p className="text-foreground/70">
                  Notice pollution, waste, deforestation, or any environmental problem in your area
                </p>
              </div>
            </div>

            {/* Center: Take Action */}
            <div className="fade-in">
              <div className="glass-card p-8 rounded-2xl text-center group hover-lift border-primary/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform glow-primary">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-primary">Take Eco-Action</h3>
                <p className="text-foreground/70">
                  Clean up the area, plant trees, organize awareness campaigns, or implement sustainable solutions
                </p>
              </div>
            </div>

            {/* Right: Share & Earn */}
            <div className="slide-in-right">
              <div className="glass-card p-8 rounded-2xl text-center group hover-lift">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-4">Share & Get Rewarded</h3>
                <p className="text-foreground/70">
                  Post your action, inspire others, earn points, and get real rewards for making a difference
                </p>
              </div>
            </div>
          </div>

          {/* Connecting Arrows */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
            <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-primary border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1/2"></div>
          </div>
          <div className="hidden lg:block absolute top-1/2 right-1/4 transform -translate-y-1/2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
            <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-primary border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Camera, title: "Photo/Video Posts", desc: "Document your eco-actions with visual proof" },
            { icon: Users, title: "Community Impact", desc: "Connect with like-minded environmental warriors" },
            { icon: Award, title: "Real Rewards", desc: "Earn points redeemable for shopping coupons & eco-trips" },
            { icon: Zap, title: "Instant Recognition", desc: "Get likes, comments, and appreciation for your efforts" }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl text-center group hover-lift fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-card flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-orbitron font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-foreground/70">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center fade-in">
          <div className="inline-block glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              Ready to make saving the planet <span className="text-glow text-primary">go viral?</span>
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md">
              Join thousands of eco-warriors already making a difference through GreenFeed
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-primary text-white font-semibold px-8 py-4 rounded-xl glow-primary hover:scale-105 transition-all duration-300"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Start Your Eco Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default SolutionSection;