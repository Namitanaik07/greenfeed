import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Upload, Tag, TreePine, Recycle, Droplets, Zap, Car, Leaf, Heart, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PostActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostActionModal = ({ isOpen, onClose }: PostActionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    impact: '',
    image: null as File | null,
    tags: [] as string[],
    visibility: 'public'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const actionCategories = [
    { id: 'trees', name: 'Tree Planting', icon: TreePine, points: '50-200', color: 'from-green-500 to-emerald-600' },
    { id: 'recycling', name: 'Recycling & Waste', icon: Recycle, points: '10-100', color: 'from-blue-500 to-cyan-600' },
    { id: 'water', name: 'Water Conservation', icon: Droplets, points: '20-150', color: 'from-cyan-500 to-blue-600' },
    { id: 'energy', name: 'Energy Saving', icon: Zap, points: '30-200', color: 'from-yellow-500 to-orange-600' },
    { id: 'transport', name: 'Sustainable Transport', icon: Car, points: '15-80', color: 'from-purple-500 to-indigo-600' },
    { id: 'plastic', name: 'Plastic Reduction', icon: Leaf, points: '10-50', color: 'from-pink-500 to-rose-600' }
  ];

  const impactLevels = [
    { id: 'low', name: 'Low Impact', desc: 'Personal daily action', points: '1-10' },
    { id: 'medium', name: 'Medium Impact', desc: 'Community influence', points: '11-50' },
    { id: 'high', name: 'High Impact', desc: 'Long-term benefits', points: '51-200' },
    { id: 'exceptional', name: 'Exceptional', desc: 'Large-scale initiative', points: '200+' }
  ];

  const popularTags = ['EcoWarrior', 'ClimateAction', 'GreenIndia', 'PlasticFree', 'SaveWater', 'CleanEnergy'];

  const handleImageUpload = (file: File) => {
    setFormData({ ...formData, image: file });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      
      // Calculate estimated points
      const selectedCategory = actionCategories.find(c => c.id === formData.category);
      const selectedImpact = impactLevels.find(i => i.id === formData.impact);
      const estimatedPoints = selectedImpact?.id === 'low' ? '5-10' : 
                            selectedImpact?.id === 'medium' ? '25-50' :
                            selectedImpact?.id === 'high' ? '75-150' : '200+';
      
      toast({
        title: "🎉 Eco-Action Posted!",
        description: `Your action is live! Estimated reward: ${estimatedPoints} points`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-center">
            <span className="text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Share Your Eco-Action
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/70">
            Document your environmental impact and inspire others while earning rewards
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden camera input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />

          {/* Geo-Tagged Photo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Geo-Tagged Photo Evidence *
            </Label>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                <MapPin className="w-4 h-4" />
                Location tracking required for proof validation
              </div>
            </div>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : formData.image 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-primary/30 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.image ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-green-600">Geo-tagged photo: {formData.image.name}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <MapPin className="w-4 h-4" />
                    Location captured ✓
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFormData({ ...formData, image: null })}
                  >
                    Retake Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="w-12 h-12 mx-auto text-primary/50" />
                  <div>
                    <p className="font-semibold">Take a geo-tagged photo of your action</p>
                    <p className="text-sm text-foreground/60">Camera will capture location automatically</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo with Location
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Action Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Planted 50 trees in my neighborhood park"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your environmental action, the problem you solved, and the impact created..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-card border-primary/30 focus:border-primary min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Action Category *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {actionCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.category === category.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-primary/20 hover:border-primary/40 glass-card'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="font-semibold text-sm">{category.name}</div>
                    <div className="text-xs text-foreground/60">{category.points} pts</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impact Level */}
          <div className="space-y-2">
            <Label>Impact Level *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, impact: value })}>
              <SelectTrigger className="glass-card border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select the scale of your impact" />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                {impactLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-semibold">{level.name}</div>
                        <div className="text-xs text-foreground/60">{level.desc}</div>
                      </div>
                      <div className="text-xs font-bold text-accent-solar ml-4">{level.points}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location *
            </Label>
            <Input
              id="location"
              placeholder="City, State or specific location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="glass-card border-primary/30 focus:border-primary"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (Select relevant ones)
            </Label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-primary text-white shadow-lg'
                      : 'glass-card border border-primary/30 hover:border-primary/60'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Post Visibility</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, visibility: value })} defaultValue="public">
              <SelectTrigger className="glass-card border-primary/30 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Public - Everyone can see</span>
                  </div>
                </SelectItem>
                <SelectItem value="followers">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Followers Only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl glow-primary text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting Your Action...
              </div>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Share My Eco-Action
              </>
            )}
          </Button>

          <div className="text-center text-xs text-foreground/60">
            Your action will be verified and points awarded within 24 hours
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostActionModal;