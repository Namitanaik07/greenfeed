import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Leaf, Plus, Trash2, Pencil, X, Save, ImagePlus, Film, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { uploadFeedMedia, type FeedPost } from '@/hooks/useFeed';

interface AdminFeedPost {
  id: string;
  content: string;
  author_name: string;
  hashtags: string[];
  media_urls: string[];
  media_types: string[];
  like_count: number;
  comment_count: number;
  is_hidden: boolean;
  created_at: string;
  user_id: string;
}

export const FeedModeration = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<AdminFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formHashtags, setFormHashtags] = useState('');
  const [formFiles, setFormFiles] = useState<File[]>([]);
  const [formPreviews, setFormPreviews] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from('feed_posts') as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setPosts(data || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('admin_feed_realtime')
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table: 'feed_posts' },
        () => { fetchPosts(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const resetForm = () => {
    setFormContent(''); setFormAuthor(''); setFormHashtags('');
    formPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setFormFiles([]); setFormPreviews([]);
    setEditId(null); setAdding(false);
  };

  const startEdit = (post: AdminFeedPost) => {
    setEditId(post.id);
    setAdding(false);
    setFormContent(post.content);
    setFormAuthor(post.author_name);
    setFormHashtags((post.hashtags || []).map(h => `#${h}`).join(' '));
    setFormFiles([]);
    setFormPreviews((post.media_urls || []).map((url, i) => ({
      url,
      type: (post.media_types?.[i] || 'image') as 'image' | 'video'
    })));
  };

  const startAdd = () => { resetForm(); setAdding(true); };

  const addMediaFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = [];
    const newPreviews: { url: string; type: 'image' | 'video' }[] = [];
    Array.from(files).forEach(file => {
      if (formFiles.length + newFiles.length >= 4) return;
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
      newFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), type: file.type.startsWith('video/') ? 'video' : 'image' });
    });
    setFormFiles(prev => [...prev, ...newFiles]);
    setFormPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (idx: number) => {
    if (formFiles[idx]) URL.revokeObjectURL(formPreviews[idx].url);
    setFormFiles(prev => prev.filter((_, i) => i !== idx));
    setFormPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDelete = async (id: string) => {
    try {
      await (supabase.from('feed_posts') as any).delete().eq('id', id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast({ title: '🗑️ Post deleted from global feed' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleToggleHide = async (post: AdminFeedPost) => {
    try {
      await (supabase.from('feed_posts') as any).update({ is_hidden: !post.is_hidden }).eq('id', post.id);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_hidden: !p.is_hidden } : p));
      toast({ title: post.is_hidden ? '👁️ Post visible again' : '🙈 Post hidden from feed' });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Parse hashtags
      const hashtags = formHashtags.match(/#(\w+)/g)?.map(h => h.slice(1)) || [];

      // Upload new media files
      let mediaUrls: string[] = [];
      let mediaTypes: string[] = [];

      if (formFiles.length > 0) {
        const uploads = await Promise.all(formFiles.map(f => uploadFeedMedia(f, user.id)));
        mediaUrls = uploads.map(u => u.url);
        mediaTypes = uploads.map(u => u.type);
      }

      // Keep existing media that wasn't removed (for edits)
      if (editId) {
        const existingPreviews = formPreviews.filter((_, i) => i >= formFiles.length || !formFiles[i]);
        // Actually: existing previews are those without corresponding formFiles
        const existingMediaUrls = formPreviews
          .slice(0, formPreviews.length - formFiles.length)
          .map(p => p.url);
        const existingMediaTypes = formPreviews
          .slice(0, formPreviews.length - formFiles.length)
          .map(p => p.type);
        
        mediaUrls = [...existingMediaUrls, ...mediaUrls];
        mediaTypes = [...existingMediaTypes, ...mediaTypes];
      }

      if (editId) {
        await (supabase.from('feed_posts') as any)
          .update({
            content: formContent,
            author_name: formAuthor || 'System Admin',
            hashtags,
            media_urls: mediaUrls,
            media_types: mediaTypes,
          })
          .eq('id', editId);
        toast({ title: '✏️ Post updated' });
      } else {
        await (supabase.from('feed_posts') as any)
          .insert({
            user_id: user.id,
            content: formContent,
            author_name: formAuthor || 'System Admin',
            hashtags,
            media_urls: mediaUrls,
            media_types: mediaTypes,
          });
        toast({ title: '✅ Official post published with media!' });
      }

      resetForm();
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to save post', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold font-inter">Feed Moderation</h2>
          <p className="text-muted-foreground text-sm">Create posts with photos/videos, moderate user content in real-time.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(adding || editId) && (
        <div className="glass-card rounded-[16px] p-6 border border-primary/20 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-inter font-bold flex items-center gap-2">
              {editId ? <><Pencil className="w-4 h-4 text-primary" /> Edit Post</> : <><Plus className="w-4 h-4 text-primary" /> Create Official Post</>}
            </h3>
            <Button size="sm" variant="ghost" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Author Name</label>
                <Input value={formAuthor} onChange={e => setFormAuthor(e.target.value)} placeholder="System Admin" className="border-primary/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Hashtags</label>
                <Input value={formHashtags} onChange={e => setFormHashtags(e.target.value)} placeholder="#GreenFeed #EcoAction" className="border-primary/20" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Content</label>
              <Textarea
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                placeholder="Write your post content here..."
                className="border-primary/20 min-h-[80px]"
              />
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5" /> Photos & Videos
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => { addMediaFiles(e.target.files); e.target.value = ''; }}
              />

              {/* Previews */}
              {formPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formPreviews.map((preview, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-primary/20 aspect-square">
                      {preview.type === 'video' ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                          <video src={preview.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Film className="w-6 h-6 text-white/80" />
                          </div>
                        </div>
                      ) : (
                        <img src={preview.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => removePreview(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={formPreviews.length >= 4}
                className="gap-1.5 text-xs border-dashed border-primary/30 hover:border-primary/60"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                {formPreviews.length > 0 ? `Add More (${formPreviews.length}/4)` : 'Add Photos/Videos'}
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving || (!formContent.trim() && formFiles.length === 0)} className="mt-4 bg-primary text-white gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      )}

      {/* Action bar */}
      {!adding && !editId && (
        <div className="flex justify-between items-center glass-card p-4 rounded-2xl border border-primary/20 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground ml-2">Total Posts: {posts.length}</p>
          <Button size="sm" onClick={startAdd} className="bg-primary text-white gap-2 rounded-xl"><Plus className="w-4 h-4" /> Create Post</Button>
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
          <div className="hidden md:grid px-6 py-4 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 120px' }}>
            <span className="text-xs font-bold text-muted-foreground uppercase">Post Content</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Media</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Author</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Engagement</span>
            <span className="text-xs font-bold text-muted-foreground uppercase text-right">Actions</span>
          </div>
          <div className="divide-y divide-primary/20/50">
            {posts.map(post => (
              <div
                key={post.id}
                className={`grid items-center px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors ${post.is_hidden ? 'opacity-50' : ''}`}
                style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 120px' }}
              >
                {/* Content */}
                <div className="pr-4">
                  <p className="text-sm text-foreground line-clamp-2">{post.content || '(no text)'}</p>
                  {post.hashtags?.length > 0 && (
                    <p className="text-xs text-primary mt-1">{post.hashtags.map(h => `#${h}`).join(' ')}</p>
                  )}
                  {post.is_hidden && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-500 mt-1 font-medium">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>

                {/* Media thumbnails */}
                <div className="flex gap-1">
                  {(post.media_urls || []).slice(0, 3).map((url, i) => (
                    <div key={i} className="w-10 h-10 rounded-md overflow-hidden border border-primary/20 flex-shrink-0">
                      {(post.media_types?.[i] || 'image') === 'video' ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <Film className="w-4 h-4 text-white/70" />
                        </div>
                      ) : (
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                  {(post.media_urls || []).length === 0 && (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  {(post.media_urls || []).length > 3 && (
                    <span className="text-xs text-muted-foreground self-center">+{post.media_urls.length - 3}</span>
                  )}
                </div>

                {/* Author */}
                <span className="text-sm font-medium">{post.author_name}</span>

                {/* Engagement */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{post.like_count || 0} ❤️</span>
                  <span className="text-xs text-muted-foreground">{post.comment_count || 0} 💬</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 h-8 w-8 p-0 rounded-full"
                    onClick={() => handleToggleHide(post)}
                    title={post.is_hidden ? 'Show post' : 'Hide post'}
                  >
                    {post.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 w-8 p-0 rounded-full"
                    onClick={() => startEdit(post)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Leaf className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No posts in the global feed yet.</p>
                <p className="text-muted-foreground text-sm mt-1">Create the first official post with photos or videos!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

