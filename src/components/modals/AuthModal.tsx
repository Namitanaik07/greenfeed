import { useState } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [loginForm,  setLoginForm]  = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [isLoading,  setIsLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setIsLoading(false);
    if (error) {
      toast({ title: '❌ Login failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🌱 Welcome back!', description: 'Logged in successfully.' });
      onClose();
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(signupForm.email, signupForm.password, signupForm.name);
    setIsLoading(false);
    if (error) {
      toast({ title: '❌ Signup failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🎉 Welcome to GreenFeed!', description: 'Account created! You can now log in.' });
      onClose();
      navigate('/dashboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join GreenFeed
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="login"  className="data-[state=active]:bg-primary data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                <Input type="email" placeholder="you@example.com" required
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="glass-card border-primary/30 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password</Label>
                <Input type="password" placeholder="••••••••" required
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="glass-card border-primary/30 focus:border-primary" />
              </div>
              <Button type="submit" disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl">
                {isLoading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</span>
                  : <><User className="w-4 h-4 mr-2" />Login to GreenFeed</>}
              </Button>
            </form>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
                <Input placeholder="Your Name" required
                  value={signupForm.name}
                  onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="glass-card border-primary/30 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                <Input type="email" placeholder="you@example.com" required
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="glass-card border-primary/30 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password</Label>
                <Input type="password" placeholder="min 6 characters" required
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="glass-card border-primary/30 focus:border-primary" />
              </div>
              <Button type="submit" disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl">
                {isLoading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
                  : <><CheckCircle className="w-4 h-4 mr-2" />Start My Eco Journey</>}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;