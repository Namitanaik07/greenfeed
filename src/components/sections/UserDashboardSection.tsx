import { useState } from 'react';
import { User, Camera, Trophy, Calendar, TrendingUp, MapPin, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostActionModal from '@/components/modals/PostActionModal';
import AuthModal from '@/components/modals/AuthModal';
import { toast } from '@/hooks/use-toast';

const UserDashboardSection = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSocialAction = (action: string) => {
    toast({
      title: `${action} feature coming soon! 🚀`,
      description: "This feature will be available in the full app launch.",
    });
  };
  const userStats = {
    name: "Eco Warrior Priya",
    level: "Green Guardian",
    points: 2340,
    streak: 15,
    posts: 47,
    followers: 1240,
    following: 890
  };

  const recentPosts = [
    {
      id: 1,
      image: "🌳",
      title: "Planted 20 saplings in Lalbagh",
      location: "Bangalore, Karnataka",
      points: 200,
      likes: 45,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      image: "♻️",
      title: "Organized plastic cleanup drive",
      location: "Marina Beach, Chennai",
      points: 150,
      likes: 67,
      timeAgo: "1 day ago"
    },
    {
      id: 3,
      image: "🌊",
      title: "Installed rainwater harvesting",
      location: "Koramangala, Bangalore",
      points: 180,
      likes: 32,
      timeAgo: "3 days ago"
    }
  ];

  const badges = [
    { name: "Tree Guardian", icon: "🌳", earned: true },
    { name: "Water Saver", icon: "💧", earned: true },
    { name: "Plastic Fighter", icon: "🚯", earned: true },
    { name: "Energy Hero", icon: "⚡", earned: false },
    { name: "Ocean Protector", icon: "🌊", earned: false },
    { name: "Climate Activist", icon: "🌍", earned: false }
  ];

  return (
    <>
      <PostActionModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab="login"
      />
      <section id="user-dashboard" className="py-24 px-4 ">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-6xl font-orbitron font-bold mb-6">
            Your{' '}
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Eco Profile
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Track your environmental impact, build streaks, share your journey, and connect with fellow eco-warriors
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 slide-in-left">
            <div className="glass-card p-8 rounded-2xl text-center hover-lift">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-4 border-background">
                  <Star className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-orbitron font-bold mb-2">{userStats.name}</h3>
              <div className="px-4 py-2 bg-gradient-primary rounded-full text-white font-semibold mb-6">
                {userStats.level}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-black text-accent-solar">{userStats.points}</div>
                  <div className="text-sm text-foreground/60">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-black text-primary flex items-center justify-center">
                    <Flame className="w-6 h-6 mr-1" />
                    {userStats.streak}
                  </div>
                  <div className="text-sm text-foreground/60">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-black text-secondary">{userStats.posts}</div>
                  <div className="text-sm text-foreground/60">Eco Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-black text-foreground">{userStats.followers}</div>
                  <div className="text-sm text-foreground/60">Followers</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-primary text-white font-semibold rounded-xl glow-primary"
                  onClick={() => setIsPostModalOpen(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Post New Action
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/50 text-primary bg-transparent backdrop-blur-sm rounded-xl hover-glow"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Posts */}
            <div className="slide-in-right">
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-orbitron font-bold">Recent Eco-Actions</h3>
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-card hover:bg-gradient-primary/10 transition-colors cursor-pointer">
                      <div className="text-4xl">{post.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{post.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-foreground/60">
                          <MapPin className="w-4 h-4" />
                          <span>{post.location}</span>
                          <span>•</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent-solar">+{post.points}</div>
                        <div className="text-sm text-foreground/60">{post.likes} likes</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-primary/30 text-primary rounded-xl"
                  onClick={() => handleSocialAction("View All Posts")}
                >
                  View All Posts
                </Button>
              </div>
            </div>

            {/* Badges & Achievements */}
            <div className="fade-in">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-accent-solar" />
                  Badges & Achievements
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  {badges.map((badge, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
                        badge.earned 
                          ? 'bg-gradient-primary text-white shadow-lg hover:scale-105' 
                          : 'bg-gradient-card border border-foreground/10 hover:border-primary/30'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className={`text-sm font-semibold ${badge.earned ? 'text-white' : 'text-foreground/60'}`}>
                        {badge.name}
                      </div>
                      {!badge.earned && (
                        <div className="text-xs text-foreground/40 mt-1">Locked</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="fade-in">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-orbitron font-bold mb-6 flex items-center">
                  <Flame className="w-6 h-6 mr-3 text-accent-solar" />
                  Daily Streak Challenge
                </h3>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-3xl font-orbitron font-black text-accent-solar">{userStats.streak} Days</div>
                    <div className="text-foreground/60">Current Streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">2x Bonus Active!</div>
                    <div className="text-sm text-foreground/60">For 15+ day streaks</div>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="flex space-x-2 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex-1 text-center">
                      <div className="text-xs text-foreground/60 mb-2">{day}</div>
                      <div className={`w-full h-8 rounded-lg flex items-center justify-center ${
                        index < 5 ? 'bg-gradient-primary text-white' : 'bg-gradient-card border border-foreground/10'
                      }`}>
                        {index < 5 ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-foreground/70 mb-4">
                    Post an eco-action today to maintain your streak and earn bonus points!
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-accent text-white font-semibold rounded-xl"
                    onClick={() => setIsPostModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Complete Today's Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Features */}
        <div className="mt-16 fade-in">
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-orbitron font-bold text-center mb-8">
              Connect with Fellow Eco-Warriors
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Follow Friends",
                  desc: "Connect with friends and see their eco-actions in your feed",
                  icon: "👥",
                  action: "Find Friends"
                },
                {
                  title: "Join Communities",
                  desc: "Participate in local environmental groups and challenges",
                  icon: "🌱",
                  action: "Browse Groups"
                },
                {
                  title: "Share Your Impact",
                  desc: "Cross-post your achievements to Instagram and other platforms",
                  icon: "📱",
                  action: "Share Now"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-gradient-card hover:bg-gradient-primary/10 transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="font-orbitron font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-foreground/70 mb-4">{feature.desc}</p>
                  <Button size="sm" variant="outline" className="text-primary border-primary/30" onClick={() => handleSocialAction(feature.action)}>
                    {feature.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default UserDashboardSection;
