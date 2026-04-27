import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, BarChart3, ShieldCheck, ChevronDown } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const NewHeroSection = () => {
  const scrollToSection = useScrollToSection();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background is now handled by the global body gradient, we can add some subtle floating orbs if desired, or remove them to keep it clean */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft highlight orb top left */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FFF9D6]/40 blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-float" />
        {/* Soft highlight orb bottom right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#BFE9FF]/30 blur-[120px] translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto relative z-10 text-center max-w-5xl py-20">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-accent text-primary font-medium text-sm animate-scale-in">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Academic IoT Initiative</span>
          </div>

          {/* Formal Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-inter font-extrabold tracking-tight text-foreground leading-tight animate-slide-up">
            Intelligent Waste Management <br className="hidden sm:block" />
            <span className="text-primary">for Sustainable Cities</span>
          </h1>

          {/* Formal Description */}
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            GreenFeed is an advanced socio-technical platform bridging community engagement with IoT technology. We optimize waste disposal protocols, verify civic action through automated heuristics, and incentivize eco-friendly practices.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-xl glow-primary transition-all text-base hover-lift"
              onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }))}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white border-[#CFF5D6] text-foreground hover:bg-[#FFF9D6] font-semibold px-8 py-6 rounded-xl transition-all text-base hover-lift"
              onClick={() => scrollToSection('how-it-works')}
            >
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              View Architecture
            </Button>
          </div>

          {/* Formal Features Mini */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { title: 'Civic Reporting', desc: 'Geo-tagged infrastructure monitoring and issue tracking.', icon: Leaf },
              { title: 'IoT Integration', desc: 'Smart bins equipped with automated classification algorithms.', icon: BarChart3 },
              { title: 'Verified Impact', desc: 'Data-driven validation of community environmental actions.', icon: ShieldCheck },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="glass-card p-6 text-left" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-[#E8FBEA] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-inter font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-slate-400" />
      </div>
    </section>
  );
};

export default NewHeroSection;
