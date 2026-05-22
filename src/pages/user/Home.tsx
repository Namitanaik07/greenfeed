import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NavBar from '@/components/NavBar';
import SpotIssuesSection from '@/components/sections/SpotIssuesSection';
import TakeActionSection from '@/components/sections/TakeActionSection';
import VerificationSection from '@/components/sections/VerificationSection';
import RewardsSection from '@/components/sections/RewardsSection';

import { Leaf } from 'lucide-react';

const Home = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/');
      } else if (profile?.role === 'admin' || user.email?.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-foreground/50">Loading your eco feed...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const firstName = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Eco Warrior';

  return (
    <div className="bg-background overflow-x-hidden pt-16">
      <NavBar />
      
      {/* Welcome Banner */}
      <section className="pt-12 pb-6 px-4">
        <div className="container mx-auto max-w-4xl text-center glass-card rounded-3xl p-8 md:p-12 border border-primary/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
          
          <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-foreground mb-4 relative z-10 leading-tight">
            Hello <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{firstName}</span>,<br/>{greeting}! ☀️
          </h1>
          <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
            Let's go and check how you can contribute today for GreenFeed and explore the several options below.
          </p>
        </div>
      </section>

      <SpotIssuesSection />
      <TakeActionSection />
      <VerificationSection />
      <RewardsSection />

    </div>
  );
};

export default Home;
