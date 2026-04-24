import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeedPost, useComments } from '@/hooks/useFeed';

interface PostCardProps {
  post: FeedPost;
  onLike: (postId: string) => void;
  onHashtagClick: (tag: string) => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function renderContentWithHashtags(content: string, onClick: (tag: string) => void) {
  const parts = content.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) {
      return (
        <button
          key={i}
          onClick={() => onClick(part.slice(1))}
          className="text-primary hover:underline font-medium"
        >
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const PostCard = ({ post, onLike, onHashtagClick }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { comments, addComment } = useComments(post.id);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment(commentText);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'GreenFeed Post', text: post.content, url: window.location.href });
    } else {
      navigator.clipboard.writeText(post.content);
    }
  };

  return (
    <div className="glass-card rounded-[16px] overflow-hidden transition-all">
      {/* Author header */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {post.author_name[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">{post.author_name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(post.created_at)}</span>
              {post.geo_lat && (
                <>
                  <span>·</span>
                  <MapPin className="w-3 h-3" />
                  <span>{post.geo_lat.toFixed(2)}, {post.geo_lng?.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-foreground leading-relaxed text-sm">
          {renderContentWithHashtags(post.content, onHashtagClick)}
        </p>
      </div>

      {/* Action bar */}
      <div className="px-5 pb-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
          className={`gap-1.5 text-xs rounded-xl ${post.liked_by_me ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${post.liked_by_me ? 'fill-red-500' : ''}`} />
          {post.like_count}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-1.5 text-xs text-muted-foreground hover:text-primary rounded-xl"
        >
          <MessageCircle className="w-4 h-4" />
          {post.comment_count || comments.length}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="gap-1.5 text-xs text-muted-foreground hover:text-secondary rounded-xl"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-[#CFF5D6] px-5 py-4 space-y-3 bg-[#E8FBEA]/20">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {c.author_name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-semibold text-foreground">{c.author_name}</span>{' '}
                  <span className="text-muted-foreground">{c.content}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(c.created_at)}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="text-xs bg-white border-[#CFF5D6] h-8"
            />
            <Button size="sm" onClick={handleAddComment} className="bg-primary text-white h-8 px-3 text-xs rounded-lg">
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
