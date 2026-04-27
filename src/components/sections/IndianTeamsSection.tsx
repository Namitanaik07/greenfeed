import { MapPin, Users, AlertTriangle, Target, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IndianTeamsSection = () => {
  const regions = [
    {
      name: "Northern Plains",
      cities: ["Delhi", "Gurgaon", "Noida", "Chandigarh"],
      issues: ["Air pollution", "Stubble burning", "Water scarcity", "Urban waste"],
      team: "12 Environmental Scouts",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Western Coast",
      cities: ["Mumbai", "Pune", "Ahmedabad", "Surat"],
      issues: ["Coastal erosion", "Industrial waste", "Plastic pollution", "Mangrove loss"],
      team: "15 Coastal Guardians",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Southern Tech Hub",
      cities: ["Bangalore", "Chennai", "Hyderabad", "Kochi"],
      issues: ["Lake pollution", "E-waste", "Deforestation", "Traffic emissions"],
      team: "18 Tech Eco-Rangers",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Eastern Industrial Belt",
      cities: ["Kolkata", "Bhubaneswar", "Guwahati", "Ranchi"],
      issues: ["River pollution", "Mining damage", "Industrial emissions", "Cyclone recovery"],
      team: "10 Industrial Watchdogs",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <Compass className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">Discovering India's Environmental Challenges</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            Regional{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discovery Teams
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
            Our environmental scouts across India identify regional challenges and opportunities, 
            helping users discover impactful actions they can take in their local communities.
          </p>
        </div>

        {/* Discovery Phase Notice */}
        <div className="mb-16 fade-in">
          <div className="glass-card-accent p-8 rounded-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center glow-accent">
                <Compass className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              🚀 We're in Discovery Phase!
            </h3>
            <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              As a new platform, we're actively building our network of environmental scouts 
              who will help identify and verify the most pressing environmental issues in each region. 
              <strong> Join us in mapping India's environmental landscape!</strong>
            </p>
          </div>
        </div>

        {/* Regional Teams */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {regions.map((region, index) => (
            <div 
              key={index}
              className={`glass-card p-8 rounded-2xl hover-lift group relative overflow-hidden ${
                index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-bold">{region.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-foreground/60">
                      <Users className="w-4 h-4" />
                      <span>{region.team}</span>
                    </div>
                  </div>
                </div>

                {/* Cities */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-foreground/90">Coverage Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {region.cities.map((city, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gradient-card rounded-full text-sm border border-primary/20"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Issues */}
                <div>
                  <h4 className="font-semibold mb-3 text-foreground/90 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-accent-solar" />
                    <span>Key Environmental Challenges:</span>
                  </h4>
                  <div className="space-y-2">
                    {region.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent-solar rounded-full"></div>
                        <span className="text-sm text-foreground/70">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary border border-primary/30">
                    Recruiting
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How Teams Work */}
        <div className="mb-16 fade-in">
          <h3 className="text-2xl font-orbitron font-bold text-center mb-12">
            How Our Discovery Teams Work
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Identify Issues",
                desc: "Scout teams identify pressing environmental problems in their regions through field research and community feedback.",
                icon: Target
              },
              {
                step: "02", 
                title: "Create Action Opportunities",
                desc: "Transform problems into actionable challenges that GreenFeed users can tackle for points and rewards.",
                icon: Users
              },
              {
                step: "03",
                title: "Verify Impact",
                desc: "Validate user actions and measure real environmental impact in their local communities.",
                icon: AlertTriangle
              }
            ].map((step, index) => (
              <div key={index} className="glass-card p-6 rounded-xl text-center group hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white font-orbitron font-bold text-lg group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="font-orbitron font-bold mb-3">{step.title}</h4>
                <p className="text-sm text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Team */}
        <div className="text-center fade-in">
          <div className="glass-card p-12 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-orbitron font-bold mb-6">
              Become an Environmental Scout
            </h3>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Help us discover and map environmental challenges in your region. 
              As a scout, you'll be the first to know about local issues and earn bonus rewards 
              for verified field research.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <h4 className="font-semibold mb-3">Scout Responsibilities:</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Research local environmental issues</li>
                  <li>• Create actionable challenges for users</li>
                  <li>• Verify community actions</li>
                  <li>• Build local partnerships</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold mb-3">Scout Benefits:</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• 2x reward points for all actions</li>
                  <li>• Exclusive scout badge & recognition</li>
                  <li>• Early access to new features</li>
                  <li>• Monthly scout meetups</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const section = document.getElementById('user-dashboard');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl glow-primary transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const section = document.getElementById('post-share');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-primary/50 hover:border-primary hover:bg-primary/10 font-bold py-4 px-8 rounded-2xl transition-all duration-300"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Report Issues
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndianTeamsSection;
