import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MapPin, Clock, Film, ChevronLeft, ChevronRight } from 'lucide-react';
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

/** Instagram-style media carousel / grid */
const MediaGallery = ({ urls, types }: { urls: string[]; types: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!urls || urls.length === 0) return null;

  const isMultiple = urls.length > 1;

  const renderMedia = (url: string, mediaType: string, idx: number, isLightbox = false) => {
    if (mediaType === 'video') {
      return (
        <div className="relative w-full h-full">
          <video
            ref={idx === current ? videoRef : undefined}
            src={url}
            className={`w-full ${isLightbox ? 'max-h-[80vh]' : 'max-h-[500px]'} object-contain bg-black/5 rounded-none`}
            controls
            playsInline
            preload="metadata"
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 pointer-events-none">
            <Film className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-medium">VIDEO</span>
          </div>
        </div>
      );
    }
    return (
      <img
        src={url}
        alt={`Post media ${idx + 1}`}
        className={`w-full ${isLightbox ? 'max-h-[80vh] object-contain' : 'max-h-[500px] object-cover'} cursor-pointer`}
        onClick={() => !isLightbox && setLightbox(true)}
        loading="lazy"
      />
    );
  };

  return (
    <>
      {/* Carousel / Single */}
      <div className="relative overflow-hidden bg-muted/10">
        {/* Current media */}
        <div className="w-full">
          {renderMedia(urls[current], types[current] || 'image', current)}
        </div>

        {/* Carousel Navigation Arrows */}
        {isMultiple && (
          <>
            {current > 0 && (
              <button
                onClick={() => setCurrent(current - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {current < urls.length - 1 && (
              <button
                onClick={() => setCurrent(current + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </>
        )}

        {/* Dots indicator */}
        {isMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {urls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`rounded-full transition-all ${
                  idx === current 
                    ? 'w-2 h-2 bg-primary shadow-md' 
                    : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter badge */}
        {isMultiple && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs font-medium">
            {current + 1}/{urls.length}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {renderMedia(urls[current], types[current] || 'image', current, true)}
            {isMultiple && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {current > 0 && (
                  <button
                    onClick={() => setCurrent(current - 1)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}
                <span className="text-white text-sm font-medium px-4">{current + 1} / {urls.length}</span>
                {current < urls.length - 1 && (
                  <button
                    onClick={() => setCurrent(current + 1)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const PostCard = ({ post, onLike, onHashtagClick }: PostCardProps) => {
  const navigate = useNavigate();
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

  const hasMedia = post.media_urls && post.media_urls.length > 0;

  return (
    <div className="glass-card rounded-[16px] overflow-hidden transition-all hover:shadow-lg">
      {/* Author header */}
      <div className="p-5 pb-0">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(`/user/${post.user_id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {post.author_name[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm hover:underline">{post.author_name}</p>
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

      {/* Content text */}
      {post.content && (
        <div className="px-5 py-3">
          <p className="text-foreground leading-relaxed text-sm">
            {renderContentWithHashtags(post.content, onHashtagClick)}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {hasMedia && (
        <MediaGallery
          urls={post.media_urls}
          types={post.media_types || post.media_urls.map(() => 'image')}
        />
      )}

      {/* Action bar */}
      <div className="px-5 py-3 flex items-center gap-1 border-t border-[#CFF5D6]/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
          className={`gap-1.5 text-xs rounded-xl transition-all ${post.liked_by_me ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 transition-transform ${post.liked_by_me ? 'fill-red-500 scale-110' : ''}`} />
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
