import { AlertTriangle, TrendingDown, Smartphone, Clock } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Climate Crisis Accelerating",
      description: "Global temperatures rising, extreme weather events increasing, and ecosystems collapsing at an unprecedented rate.",
      stat: "1.5°C",
      statLabel: "Temperature rise since 1850"
    },
    {
      icon: TrendingDown,
      title: "Lack of Motivation for Action",
      description: "People want to help but don't know where to start or feel their individual actions won't make a difference.",
      stat: "73%",
      statLabel: "Feel helpless about climate change"
    },
    {
      icon: Smartphone,
      title: "Social Media Rewards Entertainment",
      description: "Current platforms prioritize viral content over meaningful environmental action, missing opportunities for positive impact.",
      stat: "2.5B",
      statLabel: "Hours daily on social media"
    },
    {
      icon: Clock,
      title: "Time is Running Out",
      description: "We have less than a decade to make significant changes to avoid irreversible climate damage.",
      stat: "2030",
      statLabel: "Critical deadline for action"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            The <span className="text-glow-accent text-accent">Problem</span> We Face
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Our planet is in crisis, but current solutions aren't engaging enough to create the massive change we need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 rounded-2xl hover-lift group ${
                index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-xl bg-gradient-accent group-hover:scale-110 transition-transform">
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-orbitron font-bold mb-3 text-foreground">
                    {problem.title}
                  </h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {problem.description}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-orbitron font-black text-accent-solar">
                      {problem.stat}
                    </div>
                    <div className="text-sm text-foreground/60">
                      {problem.statLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Central Message */}
        <div className="text-center mt-16 fade-in">
          <div className="inline-block p-8 glass-card-accent rounded-2xl">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">
              We need a <span className="text-glow text-primary">revolutionary approach</span> to environmental action
            </h3>
            <p className="text-foreground/70 max-w-2xl">
              Something that makes saving the planet as engaging and rewarding as scrolling through social media.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;