import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import NewHeroSection from '@/components/sections/NewHeroSection';
import SpotIssuesSection from '@/components/sections/SpotIssuesSection';
import TakeActionSection from '@/components/sections/TakeActionSection';
import VerificationSection from '@/components/sections/VerificationSection';
import RewardsSection from '@/components/sections/RewardsSection';
import ProfileSection from '@/components/sections/ProfileSection';
import Footer from '@/components/sections/Footer';

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background particles-bg overflow-x-hidden">
      <Toaster />
      <NavBar />
      <NewHeroSection />
      <SpotIssuesSection />
      <TakeActionSection />
      <VerificationSection />
      <RewardsSection />
      <ProfileSection />
      <Footer />
    </div>
  );
};

export default Index;
