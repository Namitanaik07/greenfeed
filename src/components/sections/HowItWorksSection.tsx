import { useState } from 'react';
import { Eye, Zap, Camera, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/modals/AuthModal';

const HowItWorksSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const steps = [
    {
      number: "01",
      icon: Eye,
      title: "Spot Environmental Issues",
      description: "Notice pollution, waste, deforestation, or any environmental problem in your community.",
      details: ["Use location services to identify nearby issues", "Browse community-reported challenges", "Get notifications about urgent local problems"],
      color: "from-red-500 to-orange-500"
    },
    {
      number: "02", 
      icon: Zap,
      title: "Take Eco-Action",
      description: "Clean up, plant trees, organize campaigns, or implement sustainable solutions to address the problem.",
      details: ["Choose from suggested action plans", "Create your own innovative solution", "Invite friends to join your effort"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "03",
      icon: Camera,
      title: "Post on GreenFeed",
      description: "Document your action with photos/videos and share your environmental impact with the community.",
      details: ["Upload before/after photos", "Add location and impact details", "Use eco-friendly hashtags for visibility"],
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      icon: Award,
      title: "Earn Points & Rewards",
      description: "Get verified points based on your action's impact and redeem them for shopping coupons and eco-trips.",
      details: ["Automatic point calculation", "Community verification system", "Instant reward redemption"],
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "05",
      icon: Heart,
      title: "Inspire Others",
      description: "Your post motivates others to take similar actions, creating a viral chain of environmental positivity.",
      details: ["Share to other social platforms", "Challenge friends to eco-actions", "Build local environmental communities"],
      color: "from-accent to-accent-solar"
    }
  ];

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab="signup"
      />
    <section id="how-it-works" className="py-24 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            How{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              It Works
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Five simple steps to turn environmental challenges into rewarding actions and inspire a movement
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`mb-16 ${index === steps.length - 1 ? 'mb-0' : ''}`}
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Step Content */}
                <div className={`${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}>
                  <div className="space-y-6">
                    {/* Step Header */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-orbitron font-bold text-xl shadow-lg`}>
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-2xl font-orbitron font-bold">{step.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-foreground/60">
                          <step.icon className="w-4 h-4" />
                          <span>Step {step.number}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3">
                      <h4 className="font-orbitron font-bold text-primary">What you can do:</h4>
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gradient-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-foreground/80">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Visual */}
                <div className={`${index % 2 === 0 ? 'slide-in-right' : 'slide-in-left'} ${index % 2 === 1 ? 'lg:order-first' : ''}`}>
                  <div className="relative group">
                    <div className={`absolute -inset-6 bg-gradient-to-br ${step.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    
                    <div className="relative glass-card p-8 rounded-2xl">
                      <div className="aspect-square bg-gradient-to-br from-background to-background-secondary rounded-xl p-8 border border-primary/20 flex flex-col items-center justify-center text-center">
                        <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl`}>
                          <step.icon className="w-12 h-12 text-white" />
                        </div>
                        
                        <h4 className="font-orbitron font-bold text-lg mb-2">{step.title}</h4>
                        <p className="text-sm text-foreground/60 max-w-xs">{step.description}</p>
                        
                        {/* Step Indicator */}
                        <div className="mt-6 flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                i <= index ? 'bg-primary' : 'bg-primary/20'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-12">
                  <div className="flex items-center space-x-2 text-primary/60">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    <ArrowRight className="w-6 h-6" />
                    <div className="w-8 h-0.5 bg-gradient-to-l from-primary to-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Impact Summary */}
        <div className="mt-20 fade-in">
          <div className="glass-card-accent p-8 rounded-2xl text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold mb-6">
              The Ripple Effect
            </h3>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Every action you take creates a ripple effect. When you post your eco-action on GreenFeed, 
              you inspire others to take similar actions in their communities. This creates a 
              <strong> viral chain of environmental positivity</strong> that can lead to massive positive change.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-orbitron font-black text-accent-solar mb-2">1 Action</div>
                <div className="text-sm text-foreground/60">Inspires 3-5 others</div>
              </div>
              <div>
                <div className="text-3xl font-orbitron font-black text-primary mb-2">100 Posts</div>
                <div className="text-sm text-foreground/60">Reach 10,000+ people</div>
              </div>
              <div>
                <div className="text-3xl font-orbitron font-black text-secondary mb-2">∞ Impact</div>
                <div className="text-sm text-foreground/60">Endless possibilities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Start */}
        <div className="text-center mt-16 fade-in">
          <h3 className="text-2xl font-orbitron font-bold mb-4">
            Ready to start your <span className="text-glow text-primary">eco-journey?</span>
          </h3>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto">
            Join thousands of environmental warriors already making a difference through GreenFeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-primary text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Start Your Eco Journey
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border border-primary rounded-xl text-primary font-semibold px-8 py-4"
              onClick={() => {
                const section = document.getElementById('how-it-works');
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HowItWorksSection;