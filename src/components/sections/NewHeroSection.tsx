import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Eye, Zap, Gift, ChevronDown } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const NewHeroSection = () => {
  const scrollToSection = useScrollToSection();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-secondary/10 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div className="container mx-auto relative z-10 text-center max-w-5xl">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card text-sm animate-scale-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">Smart Waste Management Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-orbitron font-black leading-tight animate-slide-up">
            Turn{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Actions
            </span>{' '}
            into Impact
            <br />
            <span className="text-glow-accent bg-gradient-to-r from-accent to-accent-solar bg-clip-text text-transparent">
              Earn Rewards
            </span>{' '}
            for Saving the Environment
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Spot environmental problems around you, take real action to fix them, 
            upload geo-tagged proof, get verified, and earn exciting rewards.
          </p>

          {/* 3 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground font-semibold px-8 py-6 rounded-xl glow-primary group text-base"
              onClick={() => scrollToSection('spot-issues')}
            >
              <Eye className="w-5 h-5 mr-2" />
              Spot Environmental Issues
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              className="bg-gradient-to-r from-secondary to-primary text-primary-foreground font-semibold px-8 py-6 rounded-xl glow-secondary group text-base"
              onClick={() => scrollToSection('take-action')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Take Eco Action
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-accent/50 text-accent font-semibold px-8 py-6 rounded-xl hover-glow group text-base"
              onClick={() => scrollToSection('rewards')}
            >
              <Gift className="w-5 h-5 mr-2" />
              Share & Get Rewards
            </Button>
          </div>

          {/* How it works mini */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { step: '01', title: 'Upload Proof', desc: 'Take a geo-tagged photo of your eco action', icon: '📸' },
              { step: '02', title: 'Get Verified', desc: 'AI + location verification validates your work', icon: '✅' },
              { step: '03', title: 'Earn Rewards', desc: 'Get points, badges, and real-world rewards', icon: '🎁' },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 rounded-2xl hover-lift text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-orbitron text-primary mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-orbitron font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Get Started CTA */}
          <div className="pt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground font-bold px-12 py-6 rounded-2xl glow-primary text-lg neon-border"
              onClick={() => scrollToSection('spot-issues')}
            >
              Get Started
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary/60" />
      </div>
    </section>
  );
};

export default NewHeroSection;
