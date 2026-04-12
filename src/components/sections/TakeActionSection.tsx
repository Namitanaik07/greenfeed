import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, Upload, CheckCircle, Clock, FileImage, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const TakeActionSection = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const scrollToSection = useScrollToSection();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: '❌ Invalid File', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);

    // Auto-get location
    getLocation();
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsGettingLocation(false);
          toast({ title: '📍 Location Captured', description: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}` });
        },
        () => {
          setIsGettingLocation(false);
          // Fallback mock location
          setGeoLocation({ lat: 12.9716, lng: 77.5946 });
          toast({ title: '📍 Location Set', description: 'Using approximate location.' });
        }
      );
    } else {
      setGeoLocation({ lat: 12.9716, lng: 77.5946 });
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!uploadedImage) {
      toast({ title: '📸 Photo Required', description: 'Please upload a geo-tagged photo as proof.', variant: 'destructive' });
      return;
    }
    if (!description.trim()) {
      toast({ title: '✏️ Description Required', description: 'Please describe the action you took.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({ title: '✅ Proof Submitted!', description: 'Your action is being verified. Check the verification section.' });
      setTimeout(() => scrollToSection('verification'), 1500);
    }, 2000);
  };

  const myTasks = [
    { id: '1', title: 'Garbage Accumulation Near Central Park', status: 'in_progress', points: 50 },
    { id: '4', title: 'Waste Burning in Residential Area', status: 'in_progress', points: 120 },
  ];

  return (
    <section id="take-action" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <Camera className="w-4 h-4 text-secondary" />
            <span className="text-foreground/80">Complete Your Mission</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-orbitron font-bold mb-4">
            <span className="text-glow-secondary bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Take
            </span>{' '}
            Eco Action
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Upload geo-tagged proof of your environmental action to get verified and earn rewards.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* My Tasks */}
          <div className="space-y-4 fade-in">
            <h3 className="text-xl font-orbitron font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" /> My Tasks
            </h3>
            {myTasks.map((task) => (
              <div key={task.id} className="glass-card p-5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{task.title}</h4>
                  <Badge className="mt-2 bg-secondary/20 text-secondary border-secondary/30 text-xs">
                    In Progress
                  </Badge>
                </div>
                <span className="font-orbitron font-bold text-accent-solar text-sm">{task.points} pts</span>
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <div className="glass-card p-8 rounded-2xl space-y-6 fade-in">
            <h3 className="text-xl font-orbitron font-bold text-foreground">Submit Proof</h3>

            {/* Photo Upload */}
            <div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={uploadedImage} alt="Proof" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    onClick={() => { setUploadedImage(null); setGeoLocation(null); }}
                    className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                  {geoLocation && (
                    <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs text-primary">
                      <MapPin className="w-3 h-3" />
                      {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Take or Upload Photo</p>
                    <p className="text-xs text-foreground/50">Geo-tagged image required as proof</p>
                  </div>
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={getLocation}
                disabled={isGettingLocation}
                className="border-secondary/50 text-secondary"
              >
                {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <MapPin className="w-4 h-4 mr-1" />}
                {geoLocation ? 'Update Location' : 'Attach Location'}
              </Button>
              {geoLocation && (
                <span className="text-xs text-foreground/50">
                  📍 {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                </span>
              )}
            </div>

            {/* Description */}
            <Textarea
              placeholder="Describe the action you took... (e.g., Cleaned up garbage, planted trees, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 border-primary/20 text-foreground placeholder:text-foreground/30 min-h-[100px]"
            />

            {/* Submit */}
            <Button
              className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 rounded-xl glow-primary text-base"
              onClick={handleSubmit}
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
              ) : submitted ? (
                <><CheckCircle className="w-5 h-5 mr-2" /> Submitted Successfully</>
              ) : (
                <><Upload className="w-5 h-5 mr-2" /> Submit Proof</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TakeActionSection;
