import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MapPin, Smartphone, Star, Gift, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EarlyAccessModal = ({ isOpen, onClose }: EarlyAccessModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    interests: [] as string[],
    referralSource: '',
    notifications: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
    'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 
    'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const interestOptions = [
    'Tree Planting', 'Waste Management', 'Water Conservation', 'Energy Saving',
    'Plastic Reduction', 'Community Campaigns', 'Wildlife Protection', 'Sustainable Transport'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    } else {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "🎉 You're on the list!",
        description: "Welcome to GreenFeed Early Access. We'll notify you when we launch!",
      });
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 3000);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-card border-primary/30 max-w-md text-center">
          <div className="space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-orbitron font-bold mb-2">
                <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome Aboard! 🚀
                </span>
              </h3>
              <p className="text-foreground/70">
                You're now part of our exclusive early access community. 
                Get ready to revolutionize environmental action!
              </p>
            </div>
            
            <div className="glass-card-accent p-6 rounded-xl">
              <h4 className="font-orbitron font-bold mb-4 flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Your Early Access Benefits
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-solar" />
                  <span>Founder's Badge & Special Recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-solar" />
                  <span>2x Bonus Points for First 6 Months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-solar" />
                  <span>Exclusive Access to Premium Rewards</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-foreground/60">
              We'll send you updates and launch notifications at <strong>{formData.email}</strong>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-center">
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get Early Access
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/70">
            Join the first 10,000 eco-warriors and unlock exclusive founder benefits
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City *
              </Label>
              <Input
                id="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="glass-card border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="glass-card border-primary/30">
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Environmental Interests (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Source */}
          <div className="space-y-2">
            <Label htmlFor="referral">How did you hear about GreenFeed?</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, referralSource: value })}>
              <SelectTrigger className="glass-card border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="friend">Friend/Family</SelectItem>
                <SelectItem value="search">Google Search</SelectItem>
                <SelectItem value="news">News Article</SelectItem>
                <SelectItem value="event">Environmental Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2 glass-card p-4 rounded-lg">
            <Checkbox
              id="notifications"
              checked={formData.notifications}
              onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked as boolean })}
            />
            <Label htmlFor="notifications" className="text-sm">
              Send me updates about GreenFeed launch, features, and exclusive rewards
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl glow-primary text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Securing Your Spot...
              </div>
            ) : (
              <>
                <Star className="w-5 h-5 mr-2" />
                Secure My Early Access
              </>
            )}
          </Button>

          <div className="text-center text-xs text-foreground/60 space-y-1">
            <p>Limited to first 10,000 users only</p>
            <p>By joining, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EarlyAccessModal;