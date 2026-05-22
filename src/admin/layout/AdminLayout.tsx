import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, LayoutDashboard, Users, Rss, AlertTriangle, 
  CheckSquare, Gift, BarChart3, LogOut, Menu, X, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  initialFeed, initialRewards, initialHeatmap, initialLeaderboard, initialAppUsers, initialActions
} from '@/data/adminMockData';

const navItems = [
  { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/hardware-sync', label: 'Hardware Sync', icon: Cpu },
  { path: '/admin/users', label: 'User Management', icon: Users },
  { path: '/admin/feed', label: 'Feed Moderation', icon: Rss },
  { path: '/admin/issues', label: 'Spot Issues', icon: AlertTriangle },
  { path: '/admin/verify', label: 'Verification Queue', icon: CheckSquare },
  { path: '/admin/rewards', label: 'Rewards Store', icon: Gift },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Remaining mock state (for modules not yet migrated to Supabase)
  const [usersList, setUsersList] = useState(initialAppUsers);
  const [feed, setFeed] = useState(initialFeed);
  const [rewards, setRewards] = useState(initialRewards);
  const [heatmap, setHeatmap] = useState(initialHeatmap);
  const [leaders, setLeaders] = useState(initialLeaderboard);
  const [actions, setActions] = useState(initialActions);

  // Check auth
  const isAdminUser = profile?.role === 'admin' || user?.email?.toLowerCase() === 'admin@gmail.com';

  useEffect(() => {
    if (!loading && !isAdminUser) {
      navigate('/');
      toast({ title: '🚫 Access Denied', description: 'Admin privileges required.', variant: 'destructive' });
    }
  }, [loading, isAdminUser, navigate]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast({ title: '👋 Admin logged out' });
    navigate('/');
  };

  const NavLinks = () => (
    <div className="flex flex-col gap-2 mt-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              isActive 
                ? 'bg-primary text-white shadow-md' 
                : 'text-foreground/70 hover:bg-[#E8FBEA] hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );

  if (loading || !isAdminUser) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter text-foreground">
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative top-0 left-0 h-full w-64 glass-card border-r border-primary/20 shadow-sm z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:flex'
        }`}
      >
        <div className="p-6 border-b border-primary/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-orbitron font-bold text-lg text-foreground">GreenFeed</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-foreground/50 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-primary/20">
          <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-500/10 hover:text-red-600" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout Admin
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 glass-card border-b border-primary/20 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-foreground/70 hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-orbitron font-bold text-lg hidden sm:block">Admin Control Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700 border-green-300 hidden sm:flex">System Secured</Badge>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{
              usersList, setUsersList,
              feed, setFeed,
              rewards, setRewards,
              heatmap, setHeatmap,
              leaders, setLeaders,
              actions, setActions
            }} />
          </div>
        </div>
        
      </main>
    </div>
  );
};

