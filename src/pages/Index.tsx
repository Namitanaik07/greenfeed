import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import NewHeroSection from '@/components/sections/NewHeroSection';
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

  if (loading) return null; // Avoid flashing the landing page while checking auth

  return (
    <div className="bg-background overflow-x-hidden">
      <Toaster />
      <NavBar />
      <NewHeroSection />
      <Footer />
    </div>
  );
};

export default Index;
