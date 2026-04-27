import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import NewHeroSection from '@/components/sections/NewHeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import HardwarePhase1Section from '@/components/sections/HardwarePhase1Section';
import HardwarePhase2Section from '@/components/sections/HardwarePhase2Section';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

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

  if (loading) return null;

  return (
    <div className="overflow-x-hidden">
      <Toaster />
      <NavBar />
      <NewHeroSection />
      <FeaturesSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <HardwarePhase1Section />
      <HardwarePhase2Section />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
