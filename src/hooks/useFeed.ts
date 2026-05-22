import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FeedPost {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  media_types: string[];    // 'image' | 'video' per url
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
    media_urls: [], media_types: [], hashtags: ['BeachCleanup', 'PlasticFree', 'GreenFeed'], geo_lat: 13.0499, geo_lng: 80.2824,
    like_count: 24, is_hidden: false, created_at: new Date(Date.now() - 3600000).toISOString(),
    author_name: 'Priya Sharma', author_avatar: null, liked_by_me: false, comment_count: 3
  },
  {
    id: 'm2', user_id: 'u2', content: 'Planted 20 native saplings in our community garden today! 🌱 The neighborhood kids helped dig holes and water the plants. Teaching the next generation about sustainability. #TreePlanting #CommunityAction',
    media_urls: [], media_types: [], hashtags: ['TreePlanting', 'CommunityAction'], geo_lat: 12.9716, geo_lng: 77.5946,
    like_count: 42, is_hidden: false, created_at: new Date(Date.now() - 7200000).toISOString(),
    author_name: 'Rahul Verma', author_avatar: null, liked_by_me: true, comment_count: 7
  },
  {
    id: 'm3', user_id: 'u3', content: 'Found illegal dumping near our school. Reported it on GreenFeed and the task got claimed within 2 hours! Amazing community response 💪 #IllegalDumping #CommunityPower',
    media_urls: [], media_types: [], hashtags: ['IllegalDumping', 'CommunityPower'], geo_lat: 28.6139, geo_lng: 77.2090,
    like_count: 18, is_hidden: false, created_at: new Date(Date.now() - 18000000).toISOString(),
    author_name: 'Ananya Patel', author_avatar: null, liked_by_me: false, comment_count: 2
  },
  {
    id: 'm4', user_id: 'u4', content: 'Week 3 of my zero-waste challenge! 🌍 Reduced my household waste by 60%. Tips: compost kitchen scraps, carry reusable bags, say no to single-use plastic. #ZeroWaste #EcoLife #Sustainability',
    media_urls: [], media_types: [], hashtags: ['ZeroWaste', 'EcoLife', 'Sustainability'], geo_lat: null, geo_lng: null,
    like_count: 56, is_hidden: false, created_at: new Date(Date.now() - 43200000).toISOString(),
    author_name: 'Meera Reddy', author_avatar: null, liked_by_me: false, comment_count: 12
  },
  {
    id: 'm5', user_id: 'u5', content: 'Our smart bin at the college campus just crossed 100kg of properly sorted waste! 🎉 The IoT sensors are making waste management so much smarter. #SmartBin #IoT #GreenFeed',
    media_urls: [], media_types: [], hashtags: ['SmartBin', 'IoT', 'GreenFeed'], geo_lat: 12.8698, geo_lng: 74.8431,
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

/** Upload a single media file to Supabase Storage and return public URL + type */
export async function uploadFeedMedia(file: File, userId: string): Promise<{ url: string; type: 'image' | 'video' }> {
  const isVideo = file.type.startsWith('video/');
  const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
  const filePath = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('feed-media')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('feed-media').getPublicUrl(filePath);
  return { url: urlData.publicUrl, type: isVideo ? 'video' : 'image' };
}

export function useFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);
  const usingMock = useRef(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await (supabase
        .from('feed_posts') as any)
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped: FeedPost[] = data.map((d: any) => ({
          ...d,
          media_urls: d.media_urls || [],
          media_types: d.media_types || [],
          hashtags: d.hashtags || [],
          liked_by_me: false,  // would need a join or separate query for this
        }));
        setPosts(mapped);
        usingMock.current = false;
      } else {
        setPosts(mockPosts);
        usingMock.current = true;
      }
    } catch {
      setPosts(mockPosts);
      usingMock.current = true;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ─── Realtime subscription ─────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('feed_posts_realtime')
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'feed_posts' },
        (payload: any) => {
          if (usingMock.current) {
            // Switch from mock to real once we see a real insert
            usingMock.current = false;
            setPosts([{
              ...payload.new,
              media_urls: payload.new.media_urls || [],
              media_types: payload.new.media_types || [],
              hashtags: payload.new.hashtags || [],
              liked_by_me: false,
            }]);
          } else {
            setPosts(prev => {
              // Avoid duplicates
              if (prev.some(p => p.id === payload.new.id)) return prev;
              return [{
                ...payload.new,
                media_urls: payload.new.media_urls || [],
                media_types: payload.new.media_types || [],
                hashtags: payload.new.hashtags || [],
                liked_by_me: false,
              }, ...prev];
            });
          }
        }
      )
      .on(
        'postgres_changes' as any,
        { event: 'UPDATE', schema: 'public', table: 'feed_posts' },
        (payload: any) => {
          setPosts(prev => prev.map(p => 
            p.id === payload.new.id 
              ? { ...p, ...payload.new, media_urls: payload.new.media_urls || p.media_urls, media_types: payload.new.media_types || p.media_types, hashtags: payload.new.hashtags || p.hashtags }
              : p
          ));
        }
      )
      .on(
        'postgres_changes' as any,
        { event: 'DELETE', schema: 'public', table: 'feed_posts' },
        (payload: any) => {
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /** Create a post with optional media files */
  const createPost = async (
    content: string,
    hashtags: string[],
    geoLat?: number,
    geoLng?: number,
    mediaFiles?: File[]
  ) => {
    if (!user) return;

    const authorName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You';

    // Upload media files first
    let mediaUrls: string[] = [];
    let mediaTypes: string[] = [];

    if (mediaFiles && mediaFiles.length > 0) {
      try {
        const uploads = await Promise.all(
          mediaFiles.map(f => uploadFeedMedia(f, user.id))
        );
        mediaUrls = uploads.map(u => u.url);
        mediaTypes = uploads.map(u => u.type);
      } catch (err) {
        console.error('Media upload failed, posting without media:', err);
        // Continue posting without media
      }
    }

    // Optimistic local insert
    const optimisticId = `local-${Date.now()}`;
    const newPost: FeedPost = {
      id: optimisticId,
      user_id: user.id,
      content,
      media_urls: mediaUrls.length > 0
        ? mediaUrls
        : mediaFiles 
          ? mediaFiles.map(f => URL.createObjectURL(f))
          : [],
      media_types: mediaTypes.length > 0
        ? mediaTypes
        : mediaFiles
          ? mediaFiles.map(f => f.type.startsWith('video/') ? 'video' : 'image')
          : [],
      hashtags,
      geo_lat: geoLat ?? null,
      geo_lng: geoLng ?? null,
      like_count: 0,
      is_hidden: false,
      created_at: new Date().toISOString(),
      author_name: authorName,
      author_avatar: null,
      liked_by_me: false,
      comment_count: 0,
    };

    // If still in mock mode, clear mock posts
    if (usingMock.current) {
      setPosts([newPost]);
      usingMock.current = false;
    } else {
      setPosts(prev => [newPost, ...prev]);
    }

    // Persist to Supabase
    try {
      const { data, error } = await (supabase.from('feed_posts') as any).insert({
        user_id: user.id,
        content,
        media_urls: mediaUrls,
        media_types: mediaTypes,
        hashtags,
        geo_lat: geoLat,
        geo_lng: geoLng,
        author_name: authorName,
      }).select().single();

      if (error) throw error;

      // Replace optimistic post with real one
      if (data) {
        setPosts(prev => prev.map(p => p.id === optimisticId ? { ...data, media_urls: data.media_urls || mediaUrls, media_types: data.media_types || mediaTypes, hashtags: data.hashtags || hashtags, liked_by_me: false } : p));
      }
    } catch (err) {
      console.error('Failed to persist post:', err);
      // Optimistic post stays in UI (mock mode)
    }
  };

  const toggleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked_by_me: !p.liked_by_me, like_count: p.liked_by_me ? p.like_count - 1 : p.like_count + 1 };
      }
      return p;
    }));

    // Persist like toggle
    if (user) {
      try {
        const post = posts.find(p => p.id === postId);
        if (post?.liked_by_me) {
          // Unlike
          await (supabase.from('feed_likes') as any).delete().eq('post_id', postId).eq('user_id', user.id);
          await (supabase.from('feed_posts') as any).update({ like_count: Math.max(0, (post.like_count || 1) - 1) }).eq('id', postId);
        } else {
          // Like
          await (supabase.from('feed_likes') as any).insert({ post_id: postId, user_id: user.id });
          await (supabase.from('feed_posts') as any).update({ like_count: (post?.like_count || 0) + 1 }).eq('id', postId);
        }
      } catch { /* mock mode */ }
    }
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
        const { data, error } = await (supabase
          .from('feed_comments') as any)
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

  // Realtime comments
  useEffect(() => {
    const channel = supabase
      .channel(`comments_${postId}`)
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'feed_comments', filter: `post_id=eq.${postId}` },
        (payload: any) => {
          setComments(prev => {
            if (prev.some(c => c.id === payload.new.id)) return prev;
            return [...prev, payload.new as FeedComment];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user) return;
    const authorName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You';
    const newComment: FeedComment = {
      id: `lc-${Date.now()}`,
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      author_name: authorName,
    };
    setComments(prev => [...prev, newComment]);
    try {
      await (supabase.from('feed_comments') as any).insert({ post_id: postId, user_id: user.id, content, author_name: authorName });
      // Update comment_count on the post
      await (supabase.from('feed_posts') as any).rpc('increment_comment_count', { row_id: postId }).catch(() => {
        // fallback: manual update
        (supabase.from('feed_posts') as any).update({ comment_count: comments.length + 1 }).eq('id', postId).catch(() => {});
      });
    } catch { /* mock */ }
  };

  return { comments, loading, addComment };
}

export function useUserPosts(userId: string | undefined) {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('feed_posts') as any)
        .select('*')
        .eq('user_id', userId)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped: FeedPost[] = data.map((d: any) => ({
          ...d,
          media_urls: d.media_urls || [],
          media_types: d.media_types || [],
          hashtags: d.hashtags || [],
          liked_by_me: false,
        }));
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked_by_me: !p.liked_by_me, like_count: p.liked_by_me ? p.like_count - 1 : p.like_count + 1 };
      }
      return p;
    }));

    if (currentUser) {
      try {
        const post = posts.find(p => p.id === postId);
        if (post?.liked_by_me) {
          await (supabase.from('feed_likes') as any).delete().eq('post_id', postId).eq('user_id', currentUser.id);
          await (supabase.from('feed_posts') as any).update({ like_count: Math.max(0, (post.like_count || 1) - 1) }).eq('id', postId);
        } else {
          await (supabase.from('feed_likes') as any).insert({ post_id: postId, user_id: currentUser.id });
          await (supabase.from('feed_posts') as any).update({ like_count: (post?.like_count || 0) + 1 }).eq('id', postId);
        }
      } catch { }
    }
  };

  return { posts, loading, toggleLike, refresh: fetchPosts };
}
