import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Camera, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ['Plastic Waste', 'Overflowing Bins', 'Illegal Dumping', 'Water Pollution', 'Air Pollution', 'E-Waste', 'Construction Waste', 'Blocked Drainage'];

const ReportIncidentModal = ({ isOpen, onClose }: ReportIncidentModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast({ title: '📍 Location captured' });
        },
        () => {
          setGeoLocation({ lat: 12.9716, lng: 77.5946 });
          toast({ title: '📍 Using approximate location' });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: '✅ Incident reported!', description: 'Your report will appear on the heatmap within 30 seconds.' });
      setTitle('');
      setDescription('');
      setGeoLocation(null);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-[#CFF5D6] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Report Environmental Issue
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Issue title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border-[#CFF5D6] focus:border-primary"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-[#CFF5D6] rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:border-primary focus:outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Textarea
            placeholder="Describe the issue in detail *"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border-[#CFF5D6] focus:border-primary min-h-[100px]"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetLocation}
              className={`text-xs flex-1 ${geoLocation ? 'border-primary text-primary bg-primary/5' : 'border-[#CFF5D6] text-muted-foreground'}`}
            >
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {geoLocation ? `${geoLocation.lat.toFixed(4)}, ${geoLocation.lng.toFixed(4)}` : 'Add Location'}
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-[#CFF5D6] text-muted-foreground">
              <Camera className="w-3.5 h-3.5 mr-1" /> Add Photo
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Submit Report</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIncidentModal;
