import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Leaf, LogOut, LayoutDashboard } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/modals/AuthModal';
import { toast } from '@/hooks/use-toast';

const links = [
  { label: 'Spot Issues',  id: 'spot-issues' },
  { label: 'Take Action',  id: 'take-action' },
  { label: 'Rewards',      id: 'rewards' },
  { label: 'Heatmap',      id: 'heatmap', route: '/heatmap' },
] as const;

const NavBar = () => {
  const [open,      setOpen]      = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [authTab,   setAuthTab]   = useState('login');
  const scrollToSection = useScrollToSection();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleNav = (id: string, route?: string) => {
    if (route) { navigate(route); }
    else if (location.pathname !== '/') { navigate('/'); setTimeout(() => scrollToSection(id), 300); }
    else { scrollToSection(id); }
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({ title: '👋 Logged out', description: 'See you soon!' });
  };

  const openAuth = (tab: string) => { setAuthTab(tab); setAuthOpen(true); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-primary/10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-primary" />
            <span className="font-orbitron font-bold text-lg text-foreground">GreenFeed</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <button key={l.id}
                onClick={() => handleNav(l.id, 'route' in l ? l.route : undefined)}
                className="text-sm text-foreground/60 hover:text-primary transition-colors font-medium">
                {l.label}
              </button>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="font-medium">{profile?.full_name?.split(' ')[0] ?? 'Profile'}</span>
                </button>
                <Button size="sm" variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                </Button>
                <Button size="sm" variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline"
                  className="border-primary/30 text-primary"
                  onClick={() => openAuth('login')}>
                  Login
                </Button>
                <Button size="sm"
                  className="bg-gradient-primary text-white font-semibold rounded-lg"
                  onClick={() => openAuth('signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-primary/10 px-4 pb-4 space-y-2">
            {links.map(l => (
              <button key={l.id}
                onClick={() => handleNav(l.id, 'route' in l ? l.route : undefined)}
                className="block w-full text-left py-3 px-4 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg text-sm">
                {l.label}
              </button>
            ))}
            {user ? (
              <>
                <Button className="w-full" variant="outline" onClick={() => { navigate('/dashboard'); setOpen(false); }}>
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button className="w-full border-red-500/30 text-red-400" variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" variant="outline" onClick={() => { openAuth('login'); setOpen(false); }}>Login</Button>
                <Button className="w-full bg-gradient-primary text-white" onClick={() => { openAuth('signup'); setOpen(false); }}>Sign Up</Button>
              </>
            )}
          </div>
        )}
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
};

export default NavBar;