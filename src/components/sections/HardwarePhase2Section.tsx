import { Cpu, Wifi, Activity, TreePine, Recycle, Droplets, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HardwarePhase2Section = () => {
  const devices = [
    {
      name: "Smart Recycling Bins",
      description: "AI-powered bins that automatically detect waste types and award points for proper disposal",
      features: ["Weight sensors", "Material recognition", "Real-time updates", "Contamination alerts"],
      icon: Recycle,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Tree Counter IoT",
      description: "Smart sensors that monitor tree planting and growth, updating your impact live in the app",
      features: ["Growth tracking", "Survival monitoring", "Carbon calculation", "GPS verification"],
      icon: TreePine,
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "EcoTracker Band",
      description: "Wearable device that logs eco-actions like walking vs driving, water saving, and energy conservation",
      features: ["Activity recognition", "Environmental monitoring", "Habit tracking", "Social challenges"],
      icon: Activity,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-foreground/80">Phase 2: The Future Vision</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            <span className="text-glow-accent bg-gradient-to-r from-accent to-accent-solar bg-clip-text text-transparent">
              Hardware Vision
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
            The future of saving the planet is smart, connected, and rewarding. 
            Imagine IoT devices that seamlessly bridge the physical and digital worlds of environmental action.
          </p>
        </div>

        {/* Futuristic Intro */}
        <div className="mb-20 fade-in">
          <div className="glass-card-accent p-12 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center glow-accent">
                    <Cpu className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="text-3xl font-orbitron font-bold mb-6 text-glow-accent">
                Welcome to the Smart Eco-Revolution
              </h3>
              
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Phase 2 introduces revolutionary IoT devices that automatically detect, verify, and reward 
                environmental actions without any manual input. The future where every positive action 
                for the planet is instantly recognized and rewarded.
              </p>
            </div>
          </div>
        </div>

        {/* Smart Devices */}
        <div className="space-y-16">
          {devices.map((device, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Device Info */}
              <div className={`${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${device.color} flex items-center justify-center shadow-lg`}>
                      <device.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold">{device.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-foreground/60">
                        <Wifi className="w-4 h-4" />
                        <span>IoT Connected</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    {device.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-orbitron font-bold text-primary">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {device.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Visualization */}
              <div className={`${index % 2 === 0 ? 'slide-in-right' : 'slide-in-left'} ${index % 2 === 1 ? 'lg:order-first' : ''}`}>
                <div className="relative group">
                  <div className={`absolute -inset-6 bg-gradient-to-br ${device.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                  
                  <div className="relative glass-card p-8 rounded-2xl">
                    {/* Device Mockup */}
                    <div className="aspect-video bg-gradient-to-br from-background to-background-secondary rounded-xl p-6 border border-primary/20">
                      <div className="flex items-center justify-center h-full">
                        <div className="relative">
                          <div className={`w-32 h-32 bg-gradient-to-br ${device.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                            <device.icon className="w-16 h-16 text-white" />
                          </div>
                          
                          {/* Connection Lines */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-2">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i}
                                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                                  style={{ animationDelay: `${i * 0.5}s` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Data Points */}
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                            <div className="bg-primary/20 px-3 py-1 rounded-full text-xs animate-pulse">
                              Live Data
                            </div>
                          </div>
                          
                          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                            <div className="bg-secondary/20 px-3 py-1 rounded-full text-xs animate-pulse" style={{ animationDelay: '1s' }}>
                              AI Processing
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex justify-between items-center mt-6 text-sm">
                      <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Online</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Wifi className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Cpu className="w-4 h-4" />
                        <span>AI Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Future Benefits */}
        <div className="mt-20 fade-in">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-orbitron font-bold mb-4">
              The <span className="text-glow text-primary">Smart Future</span> of Environmental Action
            </h3>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Imagine a world where every positive environmental action is automatically detected, 
              verified, and rewarded in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Automatic Detection",
                desc: "No manual input needed. Devices recognize eco-actions automatically.",
                icon: "🔍"
              },
              {
                title: "Real-time Rewards",
                desc: "Instant point allocation and social recognition for verified actions.",
                icon: "⚡"
              },
              {
                title: "Global Impact Tracking",
                desc: "See your collective environmental impact measured in real numbers.",
                icon: "🌍"
              }
            ].map((benefit, index) => (
              <div key={index} className="glass-card p-8 rounded-xl text-center group hover-lift">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="font-orbitron font-bold text-lg mb-3">{benefit.title}</h4>
                <p className="text-foreground/70 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 fade-in">
          <div className="glass-card-accent p-8 rounded-2xl inline-block">
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              Ready for the Smart Eco-Future?
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md">
              Phase 2 will revolutionize how we track and reward environmental action. 
              Join us in building this connected future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  const section = document.getElementById('early-access');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl glow-primary transition-all duration-300"
              >
                Get Early Access
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  const section = document.getElementById('rewards-shop');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-accent/50 hover:border-accent hover:bg-accent/10 font-bold py-4 px-8 rounded-2xl transition-all duration-300"
              >
                View Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HardwarePhase2Section;