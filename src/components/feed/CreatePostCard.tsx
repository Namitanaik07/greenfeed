import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Hash, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreatePostCardProps {
  onPost: (content: string, hashtags: string[], geoLat?: number, geoLng?: number) => Promise<void>;
  userName: string;
}

const CreatePostCard = ({ onPost, userName }: CreatePostCardProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);

  const extractHashtags = (text: string) => {
    const matches = text.match(/#(\w+)/g);
    return matches ? matches.map(h => h.slice(1)) : [];
  };

  const handleGeoTag = () => {
    if (geoLocation) { setGeoLocation(null); setShowGeo(false); return; }
    setShowGeo(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast({ title: '📍 Location added', description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
        },
        () => {
          setGeoLocation({ lat: 12.9716, lng: 77.5946 });
          toast({ title: '📍 Approximate location used' });
        }
      );
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      toast({ title: 'Write something first!', variant: 'destructive' });
      return;
    }
    if (content.length > 500) {
      toast({ title: 'Post too long', description: 'Maximum 500 characters.', variant: 'destructive' });
      return;
    }
    setIsPosting(true);
    const hashtags = extractHashtags(content);
    await onPost(content, hashtags, geoLocation?.lat, geoLocation?.lng);
    setContent('');
    setGeoLocation(null);
    setShowGeo(false);
    setIsPosting(false);
    toast({ title: '🌱 Post published!', description: 'Your eco-action is live on the feed.' });
  };

  return (
    <div className="glass-card rounded-[16px] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
          {userName[0]?.toUpperCase() ?? 'U'}
        </div>
        <span className="font-semibold text-foreground">{userName}</span>
      </div>

      <Textarea
        placeholder="Share your eco-action, inspire others... Use #hashtags!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-muted/30 border-[#CFF5D6] text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
        maxLength={500}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeoTag}
            className={`text-xs ${geoLocation ? 'border-primary text-primary bg-primary/10' : 'border-[#CFF5D6] text-muted-foreground'}`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {geoLocation ? 'Location added' : 'Add location'}
          </Button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="w-3.5 h-3.5" />
            <span>{extractHashtags(content).length} tags</span>
          </div>
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
        </div>

        <Button
          onClick={handlePost}
          disabled={isPosting || !content.trim()}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-xl"
          size="sm"
        >
          {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-4 h-4 mr-1" />}
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePostCard;
