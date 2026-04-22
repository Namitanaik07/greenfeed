import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: '❌ Passwords do not match', description: 'Please make sure both passwords are the same.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: '❌ Password too short', description: 'Password must be at least 6 characters long.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(password);
    setIsLoading(false);

    if (error) {
      toast({ title: '❌ Failed to update password', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🎉 Password Updated', description: 'Your password has been successfully changed!' });
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-foreground"><Lock className="w-4 h-4" /> New Password</Label>
        <Input 
          type="password" 
          placeholder="••••••••" 
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-background/50 border-primary/30 focus:border-primary text-foreground" 
        />
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-foreground"><Lock className="w-4 h-4" /> Confirm New Password</Label>
        <Input 
          type="password" 
          placeholder="••••••••" 
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="bg-background/50 border-primary/30 focus:border-primary text-foreground" 
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        {isLoading
          ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</span>
          : <><CheckCircle className="w-4 h-4 mr-2" />Update Password</>}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
