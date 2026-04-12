import { QrCode, Smartphone, MapPin, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import qrScanPrototype from '@/assets/qr-scan-prototype.jpg';

const HardwarePhase1Section = () => {
  const locations = [
    { name: "Smart Recycling Bins", desc: "Scan & earn points for proper waste disposal" },
    { name: "Eco-Friendly Stores", desc: "Get rewards for shopping sustainable products" },
    { name: "Tree Planting Events", desc: "Join community initiatives & earn instantly" },
    { name: "Solar Panel Installations", desc: "Support renewable energy projects" }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-foreground/80">Phase 1: Starting Simple</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hardware Prototype
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Simple but powerful QR code system connecting the physical world to digital rewards. 
            Scan codes at eco-friendly locations and instantly earn GreenFeed points.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Process */}
          <div className="slide-in-left">
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-orbitron font-bold mb-4 text-glow">
                  Start small, act local, earn big rewards
                </h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Our Phase 1 prototype makes earning eco-rewards as simple as scanning a QR code. 
                  No complex setup, just instant gratification for environmental action.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {[
                  { 
                    step: "01", 
                    title: "Find QR Locations", 
                    desc: "Discover eco-friendly spots with GreenFeed QR codes",
                    icon: MapPin 
                  },
                  { 
                    step: "02", 
                    title: "Scan with Your Phone", 
                    desc: "Open the GreenFeed app and scan the QR code",
                    icon: QrCode 
                  },
                  { 
                    step: "03", 
                    title: "Instant Rewards", 
                    desc: "Earn points immediately and track your impact",
                    icon: Zap 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-orbitron font-bold group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <item.icon className="w-5 h-5 text-primary" />
                        <h4 className="font-orbitron font-bold text-lg">{item.title}</h4>
                      </div>
                      <p className="text-foreground/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="slide-in-right">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative glass-card p-8 rounded-3xl">
                <img 
                  src={qrScanPrototype} 
                  alt="QR Code Scanning Prototype" 
                  className="w-full rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 animate-bounce">
                  <div className="bg-primary/90 px-4 py-2 rounded-full text-white font-bold shadow-lg">
                    +50 Points!
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 animate-bounce" style={{ animationDelay: '1s' }}>
                  <div className="bg-secondary/90 px-3 py-2 rounded-full text-white text-sm shadow-lg">
                    Scan Complete ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Locations */}
        <div className="mb-16 fade-in">
          <h3 className="text-2xl font-orbitron font-bold text-center mb-12">
            Where You'll Find GreenFeed QR Codes
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-xl text-center group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-card flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-orbitron font-bold mb-2">{location.name}</h4>
                <p className="text-sm text-foreground/70">{location.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 fade-in">
          <div className="glass-card p-8 rounded-2xl inline-block max-w-4xl">
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-glow">
              Start small, act local, earn big rewards
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Ready to start earning points for your eco-actions? Try our QR scanner prototype.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  const section = document.getElementById('user-dashboard');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-bold py-4 px-8 rounded-2xl glow-primary transition-all duration-300"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Try QR Scanner
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  const section = document.getElementById('hardware-phase2');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-primary/50 hover:border-primary hover:bg-primary/10 font-bold py-4 px-8 rounded-2xl transition-all duration-300"
              >
                <Cpu className="w-5 h-5 mr-2" />
                Future Vision
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HardwarePhase1Section;