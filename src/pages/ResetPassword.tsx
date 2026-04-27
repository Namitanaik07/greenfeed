import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user arrived here with a valid recovery token in the URL hash
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ 
          title: '❌ Invalid or expired link', 
          description: 'Your password reset link is invalid or has expired. Please request a new one.', 
          variant: 'destructive' 
        });
        navigate('/');
      } else {
        setIsVerifying(false);
      }
    };
    
    // Slight delay to allow Supabase client to parse the URL hash and set the session
    setTimeout(checkSession, 500);
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-16">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-primary">
            <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Verifying link...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 rounded-2xl border border-primary/20 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-orbitron font-bold mb-2 text-foreground">Set New Password</h1>
            <p className="text-sm text-foreground/60">Please enter your new password below.</p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
