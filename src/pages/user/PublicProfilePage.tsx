import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserPosts } from '@/hooks/useFeed';
import NavBar from '@/components/NavBar';
import PostCard from '@/components/feed/PostCard';
import { Leaf, User as UserIcon } from 'lucide-react';

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { posts, loading: loadingPosts, toggleLike } = useUserPosts(userId);

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .eq('id', userId)
          .single();
          
        if (!error && data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch public profile', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [userId]);

  if (loadingProfile || loadingPosts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Leaf className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-16">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">User not found</h1>
          <p className="text-muted-foreground mt-2">The profile you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const name = profile.full_name || profile.username || 'Eco Warrior';

  return (
    <div className="min-h-screen pt-16 bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        
        {/* Profile Header (Public view) */}
        <div className="glass-card rounded-[16px] p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {name[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-inter font-bold text-foreground">{name}</h1>
            <p className="text-muted-foreground text-sm mt-1">Community Member</p>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="space-y-6">
          <h2 className="font-inter font-bold text-2xl text-foreground mb-4">
            {name}'s Eco-Actions
          </h2>
          {posts.length === 0 ? (
            <div className="glass-card rounded-[16px] p-12 text-center">
              <Leaf className="w-12 h-12 text-primary/40 mx-auto mb-4" />
              <p className="text-foreground font-semibold">No posts yet</p>
              <p className="text-muted-foreground text-sm mt-1">This user hasn't shared any eco-actions publicly.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={toggleLike}
                  onHashtagClick={(tag) => navigate(`/feed?tag=${tag}`)}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
