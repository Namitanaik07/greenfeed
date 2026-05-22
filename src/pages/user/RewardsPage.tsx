import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NavBar from '@/components/NavBar';
import RewardsSection from '@/components/sections/RewardsSection';
import PointMatrixSection from '@/components/sections/PointMatrixSection';
import { Leaf } from 'lucide-react';

const RewardsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Leaf className="w-10 h-10 text-primary animate-pulse" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen pt-16">
      <NavBar />
      <RewardsSection />
      <PointMatrixSection />
    </div>
  );
};

export default RewardsPage;
