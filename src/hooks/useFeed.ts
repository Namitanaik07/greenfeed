import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FeedPost {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  hashtags: string[];
  geo_lat: number | null;
  geo_lng: number | null;
  like_count: number;
  is_hidden: boolean;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
  liked_by_me: boolean;
  comment_count: number;
}

export interface FeedComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
}

// Mock data fallback
const mockPosts: FeedPost[] = [
  {
    id: 'm1', user_id: 'u1', content: 'Just completed a massive beach cleanup at Marina Beach! 🏖️ Collected over 15kg of plastic waste. Every piece matters! #BeachCleanup #PlasticFree #GreenFeed',
    media_urls: [], hashtags: ['BeachCleanup', 'PlasticFree', 'GreenFeed'], geo_lat: 13.0499, geo_lng: 80.2824,
    like_count: 24, is_hidden: false, created_at: new Date(Date.now() - 3600000).toISOString(),
    author_name: 'Priya Sharma', author_avatar: null, liked_by_me: false, comment_count: 3
  },
  {
    id: 'm2', user_id: 'u2', content: 'Planted 20 native saplings in our community garden today! 🌱 The neighborhood kids helped dig holes and water the plants. Teaching the next generation about sustainability. #TreePlanting #CommunityAction',
    media_urls: [], hashtags: ['TreePlanting', 'CommunityAction'], geo_lat: 12.9716, geo_lng: 77.5946,
    like_count: 42, is_hidden: false, created_at: new Date(Date.now() - 7200000).toISOString(),
    author_name: 'Rahul Verma', author_avatar: null, liked_by_me: true, comment_count: 7
  },
  {
    id: 'm3', user_id: 'u3', content: 'Found illegal dumping near our school. Reported it on GreenFeed and the task got claimed within 2 hours! Amazing community response 💪 #IllegalDumping #CommunityPower',
    media_urls: [], hashtags: ['IllegalDumping', 'CommunityPower'], geo_lat: 28.6139, geo_lng: 77.2090,
    like_count: 18, is_hidden: false, created_at: new Date(Date.now() - 18000000).toISOString(),
    author_name: 'Ananya Patel', author_avatar: null, liked_by_me: false, comment_count: 2
  },
  {
    id: 'm4', user_id: 'u4', content: 'Week 3 of my zero-waste challenge! 🌍 Reduced my household waste by 60%. Tips: compost kitchen scraps, carry reusable bags, say no to single-use plastic. #ZeroWaste #EcoLife #Sustainability',
    media_urls: [], hashtags: ['ZeroWaste', 'EcoLife', 'Sustainability'], geo_lat: null, geo_lng: null,
    like_count: 56, is_hidden: false, created_at: new Date(Date.now() - 43200000).toISOString(),
    author_name: 'Meera Reddy', author_avatar: null, liked_by_me: false, comment_count: 12
  },
  {
    id: 'm5', user_id: 'u5', content: 'Our smart bin at the college campus just crossed 100kg of properly sorted waste! 🎉 The IoT sensors are making waste management so much smarter. #SmartBin #IoT #GreenFeed',
    media_urls: [], hashtags: ['SmartBin', 'IoT', 'GreenFeed'], geo_lat: 12.8698, geo_lng: 74.8431,
    like_count: 31, is_hidden: false, created_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: 'Shanvith S Shetty', author_avatar: null, liked_by_me: true, comment_count: 5
  },
];

const mockComments: Record<string, FeedComment[]> = {
  'm1': [
    { id: 'c1', post_id: 'm1', user_id: 'u2', content: 'Amazing work! We should organize a monthly drive 🙌', created_at: new Date(Date.now() - 3000000).toISOString(), author_name: 'Rahul Verma' },
    { id: 'c2', post_id: 'm1', user_id: 'u3', content: 'Which part of the beach was this? I want to help next time!', created_at: new Date(Date.now() - 2400000).toISOString(), author_name: 'Ananya Patel' },
  ],
  'm2': [
    { id: 'c3', post_id: 'm2', user_id: 'u1', content: 'This is so inspiring! Which species did you plant?', created_at: new Date(Date.now() - 6000000).toISOString(), author_name: 'Priya Sharma' },
  ],
};

export function useFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      if (data && data.length > 0) {
        setPosts(data as unknown as FeedPost[]);
      } else {
        setPosts(mockPosts);
      }
    } catch {
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async (content: string, hashtags: string[], geoLat?: number, geoLng?: number) => {
    if (!user) return;
    const newPost: FeedPost = {
      id: `local-${Date.now()}`,
      user_id: user.id,
      content,
      media_urls: [],
      hashtags,
      geo_lat: geoLat ?? null,
      geo_lng: geoLng ?? null,
      like_count: 0,
      is_hidden: false,
      created_at: new Date().toISOString(),
      author_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You',
      author_avatar: null,
      liked_by_me: false,
      comment_count: 0,
    };
    setPosts(prev => [newPost, ...prev]);

    try {
      await supabase.from('posts').insert({
        user_id: user.id,
        content,
        hashtags,
        geo_lat: geoLat,
        geo_lng: geoLng,
      });
    } catch { /* mock mode */ }
  };

  const toggleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked_by_me: !p.liked_by_me, like_count: p.liked_by_me ? p.like_count - 1 : p.like_count + 1 };
      }
      return p;
    }));
  };

  const filteredPosts = hashtagFilter
    ? posts.filter(p => p.hashtags.some(h => h.toLowerCase() === hashtagFilter.toLowerCase()))
    : posts;

  return { posts: filteredPosts, loading, createPost, toggleLike, hashtagFilter, setHashtagFilter, refresh: fetchPosts };
}

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setComments(data as unknown as FeedComment[]);
        } else {
          setComments(mockComments[postId] || []);
        }
      } catch {
        setComments(mockComments[postId] || []);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user) return;
    const newComment: FeedComment = {
      id: `lc-${Date.now()}`,
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      author_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You',
    };
    setComments(prev => [...prev, newComment]);
    try {
      await supabase.from('comments').insert({ post_id: postId, user_id: user.id, content });
    } catch { /* mock */ }
  };

  return { comments, loading, addComment };
}
