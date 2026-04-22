import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, BarChart3, ShieldCheck, ChevronDown } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const NewHeroSection = () => {
  const scrollToSection = useScrollToSection();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-slate-50 overflow-hidden">
      {/* Formal Greeny White Background elements */}
      <div className="absolute inset-0">
        {/* Soft green gradient blob top left */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-100/60 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        {/* Soft green gradient blob bottom right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50/80 blur-[120px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto relative z-10 text-center max-w-5xl py-20">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-sm font-medium shadow-sm animate-scale-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Academic IoT Initiative</span>
          </div>

          {/* Formal Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-inter font-extrabold tracking-tight text-slate-900 leading-tight animate-slide-up">
            Intelligent Waste Management <br className="hidden sm:block" />
            <span className="text-emerald-600">for Sustainable Cities</span>
          </h1>

          {/* Formal Description */}
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            GreenFeed is an advanced socio-technical platform bridging community engagement with IoT technology. We optimize waste disposal protocols, verify civic action through automated heuristics, and incentivize eco-friendly practices.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 rounded-xl shadow-md transition-all text-base"
              onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }))}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-8 py-6 rounded-xl transition-all text-base"
              onClick={() => scrollToSection('how-it-works')}
            >
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
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
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-inter font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
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
