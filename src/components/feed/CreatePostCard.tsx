import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Hash, Send, Loader2, ImagePlus, X, Film, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreatePostCardProps {
  onPost: (content: string, hashtags: string[], geoLat?: number, geoLng?: number, mediaFiles?: File[]) => Promise<void>;
  userName: string;
}

const MAX_MEDIA = 4;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const CreatePostCard = ({ onPost, userName }: CreatePostCardProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const addMediaFiles = useCallback((files: FileList | File[]) => {
    const newFiles: File[] = [];
    const newPreviews: { url: string; type: 'image' | 'video' }[] = [];

    Array.from(files).forEach(file => {
      if (mediaFiles.length + newFiles.length >= MAX_MEDIA) {
        toast({ title: `Maximum ${MAX_MEDIA} media files allowed`, variant: 'destructive' });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: 'File too large', description: `${file.name} exceeds 50MB limit.`, variant: 'destructive' });
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({ title: 'Invalid file type', description: 'Only images and videos are allowed.', variant: 'destructive' });
        return;
      }
      newFiles.push(file);
      newPreviews.push({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
      });
    });

    setMediaFiles(prev => [...prev, ...newFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  }, [mediaFiles.length]);

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index].url);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) addMediaFiles(e.dataTransfer.files);
  };

  const handlePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({ title: 'Write something or add media!', variant: 'destructive' });
      return;
    }
    if (content.length > 500) {
      toast({ title: 'Post too long', description: 'Maximum 500 characters.', variant: 'destructive' });
      return;
    }
    setIsPosting(true);
    const hashtags = extractHashtags(content);
    try {
      await onPost(content, hashtags, geoLocation?.lat, geoLocation?.lng, mediaFiles.length > 0 ? mediaFiles : undefined);
      setContent('');
      setGeoLocation(null);
      setShowGeo(false);
      // Cleanup object URLs
      mediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
      setMediaFiles([]);
      setMediaPreviews([]);
      toast({ title: '🌱 Post published!', description: 'Your eco-action is live on the feed.' });
    } catch {
      toast({ title: 'Failed to post', variant: 'destructive' });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      className={`glass-card rounded-[16px] p-6 space-y-4 transition-all ${dragActive ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
          {userName[0]?.toUpperCase() ?? 'U'}
        </div>
        <span className="font-semibold text-foreground">{userName}</span>
      </div>

      {/* Text Area */}
      <Textarea
        placeholder="Share your eco-action, inspire others... Use #hashtags!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-muted/30 border-[#CFF5D6] text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
        maxLength={500}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addMediaFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Hidden camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addMediaFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Media Previews */}
      {mediaPreviews.length > 0 && (
        <div className={`grid gap-2 ${
          mediaPreviews.length === 1 ? 'grid-cols-1' : 
          mediaPreviews.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {mediaPreviews.map((preview, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl overflow-hidden border border-[#CFF5D6] bg-muted/20 ${
                mediaPreviews.length === 1 ? 'max-h-[400px]' :
                mediaPreviews.length === 3 && idx === 0 ? 'row-span-2' : ''
              }`}
            >
              {preview.type === 'video' ? (
                <div className="relative">
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover max-h-[300px] rounded-xl"
                    muted
                    playsInline
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Film className="w-3 h-3 text-white" />
                    <span className="text-white text-[10px] font-medium">VIDEO</span>
                  </div>
                </div>
              ) : (
                <img
                  src={preview.url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover max-h-[300px] rounded-xl"
                />
              )}
              {/* Remove button */}
              <button
                onClick={() => removeMedia(idx)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drag hint */}
      {dragActive && (
        <div className="flex items-center justify-center py-6 border-2 border-dashed border-primary rounded-xl bg-primary/5 animate-pulse">
          <div className="flex items-center gap-2 text-primary font-medium">
            <ImagePlus className="w-6 h-6" />
            <span>Drop photos or videos here</span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Photo/Video Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={mediaFiles.length >= MAX_MEDIA}
            className="text-xs border-[#CFF5D6] text-muted-foreground hover:text-primary hover:border-primary/50 gap-1.5"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Photo/Video
            {mediaFiles.length > 0 && (
              <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {mediaFiles.length}
              </span>
            )}
          </Button>

          {/* Camera Button (mobile-friendly) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            disabled={mediaFiles.length >= MAX_MEDIA}
            className="text-xs border-[#CFF5D6] text-muted-foreground hover:text-primary hover:border-primary/50 gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            Camera
          </Button>

          {/* Location */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeoTag}
            className={`text-xs ${geoLocation ? 'border-primary text-primary bg-primary/10' : 'border-[#CFF5D6] text-muted-foreground'}`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {geoLocation ? 'Location added' : 'Location'}
          </Button>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="w-3.5 h-3.5" />
            <span>{extractHashtags(content).length} tags</span>
          </div>
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
        </div>

        <Button
          onClick={handlePost}
          disabled={isPosting || (!content.trim() && mediaFiles.length === 0)}
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
