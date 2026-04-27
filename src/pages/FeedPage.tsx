import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFeed } from '@/hooks/useFeed';
import NavBar from '@/components/NavBar';
import CreatePostCard from '@/components/feed/CreatePostCard';
import PostCard from '@/components/feed/PostCard';
import { Leaf, Hash, X, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const trendingTags = ['BeachCleanup', 'PlasticFree', 'TreePlanting', 'ZeroWaste', 'SmartBin', 'GreenFeed', 'EcoLife', 'CommunityAction'];

const FeedPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { posts, loading, createPost, toggleLike, hashtagFilter, setHashtagFilter } = useFeed();

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const userName = profile?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'User';

  return (
    <div className="min-h-screen pt-16">
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-inter font-bold text-foreground">Community Feed</h1>
                <p className="text-sm text-muted-foreground mt-1">Share your eco-actions and inspire change</p>
              </div>
              {hashtagFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHashtagFilter(null)}
                  className="border-[#CFF5D6] text-primary gap-1.5"
                >
                  <Hash className="w-3.5 h-3.5" />
                  {hashtagFilter}
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Create Post */}
            <CreatePostCard onPost={createPost} userName={userName} />

            {/* Posts */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="glass-card rounded-[16px] p-12 text-center">
                <Leaf className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <p className="text-foreground font-semibold">No posts yet</p>
                <p className="text-muted-foreground text-sm mt-1">Be the first to share an eco-action!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={toggleLike}
                    onHashtagClick={(tag) => setHashtagFilter(tag)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Trending Tags */}
            <div className="glass-card rounded-[16px] p-5">
              <h3 className="font-inter font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setHashtagFilter(hashtagFilter === tag ? null : tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      hashtagFilter === tag
                        ? 'bg-primary text-white'
                        : 'bg-[#E8FBEA] text-primary hover:bg-primary/20'
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="glass-card rounded-[16px] p-5">
              <h3 className="font-inter font-bold text-foreground mb-4">Community Impact</h3>
              <div className="space-y-3">
                {[
                  { label: 'Active Members', value: '2,847', color: 'text-primary' },
                  { label: 'Posts This Week', value: '342', color: 'text-secondary' },
                  { label: 'Tasks Completed', value: '1,205', color: 'text-primary' },
                  { label: 'Waste Collected', value: '4.2 tons', color: 'text-secondary' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className={`font-inter font-bold text-sm ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="glass-card-accent rounded-[16px] p-5">
              <h3 className="font-inter font-bold text-foreground mb-3 text-sm">Community Guidelines</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>🌱 Share genuine environmental actions</li>
                <li>📸 Use #hashtags for better discovery</li>
                <li>🤝 Be respectful and supportive</li>
                <li>📍 Add location for local impact tracking</li>
                <li>🚫 No spam or misleading content</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
