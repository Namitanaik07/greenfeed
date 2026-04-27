import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Globe, Heart } from 'lucide-react';
import heroAppMockup from '@/assets/hero-app-mockup.jpg';
import AuthModal from '@/components/modals/AuthModal';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const scrollToSection = useScrollToSection();

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab="signup"
      />
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 rounded-full bg-primary/20 blur-xl"></div>
        </div>
        <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 rounded-full bg-secondary/20 blur-xl"></div>
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <div className="w-24 h-24 rounded-full bg-accent/20 blur-xl"></div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">The Future of Environmental Action</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-orbitron font-black leading-tight">
                Turn{' '}
                <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  eco-actions
                </span>{' '}
                into the next{' '}
                <span className="text-glow-accent bg-gradient-to-r from-accent to-accent-solar bg-clip-text text-transparent">
                  viral trend
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-foreground/70 max-w-2xl leading-relaxed">
                GreenFeed is a social media platform where people post their eco-friendly actions, 
                inspire others, and get rewarded for saving the planet.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-white font-semibold px-8 py-4 rounded-xl glow-primary hover:scale-105 transition-all duration-300 group"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Globe className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Join the Movement
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/50 text-primary bg-transparent backdrop-blur-sm px-8 py-4 rounded-xl hover-glow group"
                onClick={() => scrollToSection('features')}
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-orbitron font-bold text-primary">1M+</div>
                <div className="text-sm text-foreground/60">Eco Actions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-orbitron font-bold text-secondary">50K+</div>
                <div className="text-sm text-foreground/60">Green Warriors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-orbitron font-bold text-accent">₹10L+</div>
                <div className="text-sm text-foreground/60">Rewards Given</div>
              </div>
            </div>
          </div>

          {/* Right Content - App Mockup */}
          <div className="flex justify-center lg:justify-end slide-in-right">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-card p-8 rounded-3xl glass-card">
                <img 
                  src={heroAppMockup} 
                  alt="GreenFeed App Mockup" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Elements Around Phone */}
                <div className="absolute -top-4 -left-4 animate-bounce">
                  <div className="bg-primary/20 p-3 rounded-full backdrop-blur-sm">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 animate-bounce" style={{ animationDelay: '1s' }}>
                  <div className="bg-secondary/20 p-3 rounded-full backdrop-blur-sm">
                    <Heart className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;
