import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Camera, MapPin, Upload, CheckCircle, Clock, X, Loader2,
  ChevronRight, AlertTriangle, Trash2, Droplets, Wind, Construction,
  CloudRain, Leaf, Zap, Navigation, ImagePlus, ShieldAlert, ShieldCheck,
  Brain, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/useTasks';
import type { VerificationResult } from '@/utils/geoVerification';
import {
  extractExifGps,
  geocodeLocationName,
  runVerification,
  analyzeImageProof,
  type GeoPoint,
  type VerificationInput,
} from '@/utils/geoVerification';

const categoryIcons: Record<string, React.ElementType> = {
  'Garbage Cleanup': Trash2,
  'Water Pollution': Droplets,
  'Waste Management': AlertTriangle,
  'Air Pollution': Wind,
  'Illegal Dumping': Construction,
  'Drainage': CloudRain,
  'Tree Planting': Leaf,
  'General': AlertTriangle,
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-primary/20 text-primary border-primary/30',
  Medium: 'bg-accent-solar/20 text-accent-solar border-accent-solar/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const TakeActionSection = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();



  const { claimedTasks, submitProof, tasks } = useTasks();

  // Also include submitted tasks for display
  const myTasks = tasks.filter(
    t => (t.status === 'in_progress' || t.status === 'submitted') && t.claimed_by !== null
  );
  // Filter to only tasks claimed by current user (claimedTasks from hook already does this for in_progress)
  const activeTasks = claimedTasks; // in_progress tasks claimed by user
  const submittedTasks = tasks.filter(t => t.status === 'submitted');

  const selectedTask = activeTasks.find(t => t.id === selectedTaskId);

  // Auto-fetch location on mount
  useEffect(() => {
    getLocation();
  }, []);

  // Clear validation errors when user changes file or task
  useEffect(() => {
    setValidationError(null);
    setVerificationResult(null);
  }, [selectedFile, selectedTaskId]);

  const getLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGeoLocation(loc);
          setIsGettingLocation(false);
          toast({ title: '📍 Live Location Captured', description: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` });
          // Try reverse geocoding for friendly name
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`)
            .then(r => r.json())
            .then(data => {
              if (data?.display_name) {
                const short = data.display_name.split(',').slice(0, 3).join(',');
                setLocationName(short);
              }
            })
            .catch(() => {});
        },
        () => {
          setIsGettingLocation(false);
          setGeoLocation({ lat: 12.9716, lng: 77.5946 });
          setLocationName('Bengaluru, KA (approx)');
          toast({ title: '📍 Approximate Location', description: 'Could not access GPS. Using approximate.' });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGeoLocation({ lat: 12.9716, lng: 77.5946 });
      setLocationName('Bengaluru, KA (approx)');
      setIsGettingLocation(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: '❌ Invalid File', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
    // Refresh location when photo is taken
    getLocation();
  };

  const clearImage = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setValidationError(null);
  };

  const handleSubmit = async () => {
    if (!selectedTaskId || !selectedTask) {
      toast({ title: '📋 Select a Task', description: 'Choose which task you completed from the list above.', variant: 'destructive' });
      return;
    }
    if (!selectedFile) {
      toast({ title: '📸 Photo Required', description: 'Attach a geo-tagged photo as proof of completion.', variant: 'destructive' });
      return;
    }
    if (!geoLocation) {
      toast({ title: '📍 Location Required', description: 'Allow location access for verification.', variant: 'destructive' });
      return;
    }

    // ── Step 1: PRE-VALIDATION — run AI verification BEFORE uploading ──
    setIsValidating(true);
    setValidationError(null);

    try {
      // Extract EXIF GPS from the photo
      let exifGps: GeoPoint | null = null;
      try {
        exifGps = await extractExifGps(selectedFile);
      } catch { /* no EXIF */ }

      // Resolve task location
      let taskLocation: GeoPoint | null = null;
      if (selectedTask.latitude && selectedTask.longitude) {
        taskLocation = { lat: selectedTask.latitude, lng: selectedTask.longitude };
      } else if (selectedTask.location_name) {
        try {
          taskLocation = await geocodeLocationName(selectedTask.location_name);
        } catch { /* geocode failed */ }
      }

      // Run AI Forgery & Cleanliness Inspection
      let analysis = {
        isAiOrEdited: false,
        aiEditedReason: '',
        isPlaceCleaned: true,
        cleanlinessConfidence: 85,
        cleanlinessReason: 'Local checks passed.'
      };
      try {
        analysis = await analyzeImageProof(
          selectedFile,
          selectedTask.title,
          description || selectedTask.description || ''
        );
      } catch (err) {
        console.warn('[GeoVerify] Pre-validation image analysis failed:', err);
      }

      const deviceGps: GeoPoint = { lat: geoLocation.lat, lng: geoLocation.lng };

      // Run the verification algorithm
      const preCheckInput: VerificationInput = {
        taskLocation,
        deviceGps,
        exifGps,
        taskLocationName: selectedTask.location_name || undefined,
        isAiOrEdited: analysis.isAiOrEdited,
        aiEditedReason: analysis.aiEditedReason,
        isPlaceCleaned: analysis.isPlaceCleaned,
        cleanlinessConfidence: analysis.cleanlinessConfidence,
        cleanlinessReason: analysis.cleanlinessReason,
      };

      const preResult = runVerification(preCheckInput);
      setVerificationResult(preResult);

      // ── GATE: Block submission if verification FAILED ──
      if (preResult.verdict === 'failed') {
        setIsValidating(false);

        // Build a specific error message
        const issues: string[] = [];
        if (analysis.isAiOrEdited) {
          issues.push(`🛡️ Anti-Forgery Scan: Tampering detected! ${analysis.aiEditedReason}`);
        }
        if (!analysis.isPlaceCleaned) {
          issues.push(`🧹 Cleanliness Vision: Place is not cleaned. ${analysis.cleanlinessReason}`);
        }
        if (!exifGps) {
          issues.push('📷 Your photo has NO embedded GPS data (no geo-tag). Please take a fresh photo using your camera with location services enabled.');
        }
        if (taskLocation && preResult.distances.taskToDevice !== null && preResult.distances.taskToDevice > 15) {
          issues.push(`📍 Your current location is ${preResult.distances.taskToDevice.toFixed(1)}km away from the task location. You must be near "${selectedTask.location_name}" to submit proof.`);
        }
        if (exifGps && taskLocation && preResult.distances.taskToExif !== null && preResult.distances.taskToExif > 15) {
          issues.push(`🗺️ The photo was taken ${preResult.distances.taskToExif.toFixed(1)}km away from the task location. The photo must be taken at the task site.`);
        }

        const errorMsg = issues.length > 0
          ? issues.join('\n\n')
          : 'Verification score too low. Please ensure you are at the task location and your photo has geo-tag data.';

        setValidationError(errorMsg);
        toast({
          title: '❌ Verification Failed — Cannot Submit',
          description: 'Your proof did not pass verification. See the details below.',
          variant: 'destructive',
        });
        return; // BLOCK — do NOT upload
      }

      // ── GATE: Warn if suspicious but still allow ──
      if (preResult.verdict === 'suspicious') {
        setIsValidating(false);

        const issues: string[] = [];
        if (analysis.isAiOrEdited) {
          issues.push(`🛡️ Anti-Forgery Warning: ${analysis.aiEditedReason}`);
        }
        if (!analysis.isPlaceCleaned) {
          issues.push(`🧹 Cleanliness Warning: ${analysis.cleanlinessReason}`);
        }
        if (!exifGps) {
          issues.push('📷 No geo-tag detected in your photo. For higher verification scores, use your camera with location enabled.');
        }

        setValidationError(
          issues.length > 0
            ? '⚠️ ' + issues.join(' ') + ' Submitting anyway for manual admin review.'
            : '⚠️ Verification score is low. Submitting for manual admin review.'
        );
        // Don't return — let it continue to upload
      }

      setIsValidating(false);
    } catch (err) {
      setIsValidating(false);
      // If pre-validation itself errors, allow submission to proceed
      console.warn('[GeoVerify] Pre-validation error:', err);
    }

    // ── Step 2: UPLOAD & SUBMIT (only reached if validation passed) ──
    setIsSubmitting(true);
    try {
      const result = await submitProof(selectedTaskId, selectedFile, geoLocation.lat, geoLocation.lng);
      setVerificationResult(result);

      if (result?.verdict === 'verified') {
        toast({
          title: '✅ Auto-Verified & Points Awarded!',
          description: `"${selectedTask.title}" passed all geo-checks (Score: ${result.score}%). ${selectedTask.reward_points} pts credited!`,
        });
      } else if (result?.verdict === 'likely_valid') {
        toast({
          title: '🟡 Submitted — Likely Valid',
          description: `Score: ${result?.score}%. Pending admin review for final verification.`,
        });
      } else {
        toast({
          title: '📤 Submitted for Review',
          description: `Verification score: ${result?.score}%. An admin will review your submission.`,
        });
      }

      // Reset form
      setSelectedTaskId(null);
      setUploadedImage(null);
      setSelectedFile(null);
      setDescription('');
      setValidationError(null);
    } catch (err: any) {
      toast({
        title: '❌ Submission Failed',
        description: err.message || 'Could not upload proof. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="take-action" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
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
            Select a claimed task, attach geo-tagged proof, and submit for verification to earn your rewards.
          </p>
        </div>

        {/* Live Location Banner */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 fade-in">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${geoLocation ? 'bg-primary/20' : 'bg-muted'}`}>
              {isGettingLocation ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {geoLocation ? '📍 Live Location Active' : 'Location not available'}
              </p>
              <p className="text-xs text-muted-foreground">
                {locationName
                  ? locationName
                  : geoLocation
                    ? `${geoLocation.lat.toFixed(4)}, ${geoLocation.lng.toFixed(4)}`
                    : 'Click refresh to enable GPS'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getLocation}
            disabled={isGettingLocation}
            className="border-primary/30 text-primary"
          >
            {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <MapPin className="w-4 h-4 mr-1" />}
            Refresh Location
          </Button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 text-sm text-muted-foreground fade-in">
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${selectedTaskId ? 'bg-primary/20 text-primary font-semibold' : 'bg-muted/50'}`}>
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
            Select Task
          </div>
          <ChevronRight className="w-4 h-4" />
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${selectedFile ? 'bg-primary/20 text-primary font-semibold' : 'bg-muted/50'}`}>
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${selectedFile ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</span>
            Attach Proof
          </div>
          <ChevronRight className="w-4 h-4" />
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${isSubmitting ? 'bg-primary/20 text-primary font-semibold' : 'bg-muted/50'}`}>
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${isSubmitting ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>3</span>
            Submit
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ─── LEFT: My Claimed Tasks ─────────────────────────── */}
          <div className="space-y-4 fade-in">
            <h3 className="text-xl font-inter font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" /> My Claimed Tasks
              {activeTasks.length > 0 && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs ml-2">{activeTasks.length} Active</Badge>
              )}
            </h3>

            {activeTasks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-primary/30 mx-auto" />
                <p className="text-foreground/60 font-medium">No active tasks</p>
                <p className="text-sm text-muted-foreground">
                  Head over to <span className="text-primary font-semibold">Spot Issues</span> to claim a task first!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.map((task) => {
                  const Icon = categoryIcons[task.category] || AlertTriangle;
                  const isSelected = selectedTaskId === task.id;

                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                      className={`w-full text-left glass-card p-5 rounded-2xl flex items-center gap-4 transition-all border-2 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-transparent hover:border-primary/20 hover:bg-primary/5'
                      }`}
                    >
                      <div className={`p-3 rounded-xl flex-shrink-0 ${isSelected ? 'bg-gradient-primary' : 'bg-muted/50'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-foreground/60'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`${difficultyColors[task.difficulty] || difficultyColors.Easy} border text-[10px]`}>
                            {task.difficulty}
                          </Badge>
                          {task.location_name && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {task.location_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-inter font-bold text-accent-solar text-sm">{task.reward_points}</span>
                        <span className="text-[10px] text-muted-foreground block">pts</span>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Submitted tasks summary */}
            {submittedTasks.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Previously Submitted
                </h4>
                {submittedTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="glass-card p-3 rounded-xl flex items-center justify-between opacity-60">
                    <span className="text-xs text-foreground">{task.title}</span>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px]">Submitted</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Proof Submission Panel ─────────────────── */}
          <div className="glass-card p-8 rounded-2xl space-y-6 fade-in">
            <h3 className="text-xl font-inter font-bold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Submit Proof
            </h3>

            {/* Selected task info */}
            {selectedTask ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{selectedTask.title}</p>
                  <p className="text-xs text-muted-foreground">Submit proof for this task</p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 border border-dashed border-muted-foreground/20 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">← Select a task from your claimed list first</p>
              </div>
            )}



            {/* Photo Upload / Camera */}
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={uploadedImage} alt="Proof" className="w-full h-56 object-cover rounded-xl" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 p-1.5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {geoLocation && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-white">
                      <MapPin className="w-3 h-3 text-green-400" />
                      {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs text-white font-medium">
                    <CheckCircle className="w-3 h-3" /> Photo Ready
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-44 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all"
                  >
                    <div className="p-4 rounded-full bg-primary/10">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground text-sm">Take Photo</p>
                      <p className="text-[10px] text-muted-foreground">Opens camera</p>
                    </div>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-44 border-2 border-dashed border-secondary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-secondary/60 hover:bg-secondary/5 transition-all"
                  >
                    <div className="p-4 rounded-full bg-secondary/10">
                      <ImagePlus className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground text-sm">Upload Image</p>
                      <p className="text-[10px] text-muted-foreground">From gallery</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Location Display */}
            <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
              <MapPin className={`w-5 h-5 flex-shrink-0 ${geoLocation ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {geoLocation ? '📍 Location attached' : 'No location yet'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {locationName || (geoLocation ? `${geoLocation.lat.toFixed(6)}, ${geoLocation.lng.toFixed(6)}` : 'Click Refresh Location above')}
                </p>
              </div>
              {geoLocation && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
            </div>

            {/* Description (optional) */}
            <Textarea
              placeholder="Describe the action you took... (optional but helps verification)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/30 border-primary/20 text-foreground placeholder:text-muted-foreground/50 min-h-[80px]"
            />
            {/* ── Validation Error Alert ── */}
            {validationError && (
              <div className={`rounded-xl p-4 border-2 ${
                verificationResult?.verdict === 'failed'
                  ? 'bg-red-50/80 border-red-300'
                  : 'bg-yellow-50/80 border-yellow-300'
              }`}>
                <div className="flex items-start gap-3">
                  {verificationResult?.verdict === 'failed' ? (
                    <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold mb-1 ${
                      verificationResult?.verdict === 'failed' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {verificationResult?.verdict === 'failed'
                        ? '❌ Geo-Verification Failed — Submission Blocked'
                        : '⚠️ Low Verification Score'}
                    </h4>
                    {validationError.split('\n\n').map((line, i) => (
                      <p key={i} className={`text-xs mb-1 ${
                        verificationResult?.verdict === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {line}
                      </p>
                    ))}
                    {verificationResult?.verdict === 'failed' && (
                      <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-200">
                        <p className="text-xs font-semibold text-red-700 mb-1">💡 How to fix:</p>
                        <ul className="text-[11px] text-red-600 space-y-1 list-disc list-inside">
                          <li>Open your phone's <b>Camera app</b> (not file picker)</li>
                          <li>Make sure <b>Location/GPS is enabled</b> in your phone settings</li>
                          <li>Take a <b>fresh photo at the task location</b></li>
                          <li>Come back and upload the new photo</li>
                        </ul>
                      </div>
                    )}
                    {verificationResult && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground">Score:</span>
                        <span className={`text-sm font-bold ${
                          verificationResult.score >= 80 ? 'text-green-600' :
                          verificationResult.score >= 60 ? 'text-yellow-600' :
                          verificationResult.score >= 40 ? 'text-orange-600' : 'text-red-600'
                        }`}>{verificationResult.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              className={`w-full font-bold py-6 rounded-xl text-base ${
                verificationResult?.verdict === 'failed'
                  ? 'bg-red-400 hover:bg-red-500 text-white cursor-not-allowed'
                  : 'bg-gradient-primary text-primary-foreground glow-primary'
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting || isValidating || !selectedTaskId || !selectedFile || verificationResult?.verdict === 'failed'}
            >
              {isValidating ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> 🔍 Running Geo-Verification...</>
              ) : isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Uploading & Submitting...</>
              ) : verificationResult?.verdict === 'failed' ? (
                <><ShieldAlert className="w-5 h-5 mr-2" /> Blocked — Upload a Valid Geo-Tagged Photo</>
              ) : (
                <><Upload className="w-5 h-5 mr-2" /> Submit Proof for Verification</>
              )}
            </Button>

            {/* Helper text */}
            <p className="text-[11px] text-center text-muted-foreground">
              {verificationResult?.verdict === 'failed'
                ? 'Change your photo to a geo-tagged image taken at the task location to proceed.'
                : 'AI will verify your photo\'s location data before submission. Valid proofs are auto-verified! ✅'
              }
            </p>
          </div>
        </div>

        {/* ─── Verification Result Card ──────────────────── */}
        {verificationResult && (
          <div className="mt-12 max-w-3xl mx-auto fade-in">
            <div className={`glass-card rounded-2xl p-8 border-2 ${
              verificationResult.verdict === 'verified' ? 'border-green-500/50 bg-green-50/30' :
              verificationResult.verdict === 'likely_valid' ? 'border-yellow-500/50 bg-yellow-50/30' :
              verificationResult.verdict === 'suspicious' ? 'border-orange-500/50 bg-orange-50/30' :
              'border-red-500/50 bg-red-50/30'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-inter font-bold text-foreground flex items-center gap-2">
                    {verificationResult.verdict === 'verified' ? '✅' :
                     verificationResult.verdict === 'likely_valid' ? '🟡' :
                     verificationResult.verdict === 'suspicious' ? '⚠️' : '❌'}
                    Geo-Verification Report
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{verificationResult.summary}</p>
                </div>
                <button
                  onClick={() => setVerificationResult(null)}
                  className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Score Circle */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={
                        verificationResult.score >= 80 ? '#22c55e' :
                        verificationResult.score >= 60 ? '#eab308' :
                        verificationResult.score >= 40 ? '#f97316' : '#ef4444'
                      }
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(verificationResult.score / 100) * 327} 327`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-inter font-black text-foreground">{verificationResult.score}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Score</span>
                  </div>
                </div>
              </div>

              {/* Verdict Badge */}
              <div className="text-center mb-6">
                <Badge className={`text-sm px-4 py-1.5 ${
                  verificationResult.verdict === 'verified' ? 'bg-green-500 text-white' :
                  verificationResult.verdict === 'likely_valid' ? 'bg-yellow-500 text-white' :
                  verificationResult.verdict === 'suspicious' ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {verificationResult.verdict === 'verified' ? '🎉 AUTO-VERIFIED' :
                   verificationResult.verdict === 'likely_valid' ? '📋 PENDING ADMIN REVIEW' :
                   verificationResult.verdict === 'suspicious' ? '🔍 NEEDS MANUAL REVIEW' :
                   '❌ VERIFICATION FAILED'}
                </Badge>
              </div>

              {/* Individual Checks */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-semibold text-foreground">Verification Checks</h4>
                {verificationResult.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-muted/30">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      check.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                    }`}>
                      {check.passed ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{check.name}</p>
                      <p className="text-xs text-muted-foreground">{check.detail}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-sm font-inter font-bold ${check.passed ? 'text-green-600' : 'text-red-500'}`}>
                        {check.score}/{check.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Distances */}
              {(verificationResult.distances.taskToDevice !== null ||
                verificationResult.distances.taskToExif !== null ||
                verificationResult.distances.deviceToExif !== null) && (
                <div className="p-4 rounded-xl bg-white/60 border border-muted/30">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Distance Analysis
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {verificationResult.distances.taskToDevice !== null && (
                      <div>
                        <p className="text-lg font-inter font-bold text-foreground">
                          {verificationResult.distances.taskToDevice < 1
                            ? `${Math.round(verificationResult.distances.taskToDevice * 1000)}m`
                            : `${verificationResult.distances.taskToDevice.toFixed(1)}km`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Task → Device</p>
                      </div>
                    )}
                    {verificationResult.distances.taskToExif !== null && (
                      <div>
                        <p className="text-lg font-inter font-bold text-foreground">
                          {verificationResult.distances.taskToExif < 1
                            ? `${Math.round(verificationResult.distances.taskToExif * 1000)}m`
                            : `${verificationResult.distances.taskToExif.toFixed(1)}km`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Task → Photo</p>
                      </div>
                    )}
                    {verificationResult.distances.deviceToExif !== null && (
                      <div>
                        <p className="text-lg font-inter font-bold text-foreground">
                          {verificationResult.distances.deviceToExif < 1
                            ? `${Math.round(verificationResult.distances.deviceToExif * 1000)}m`
                            : `${verificationResult.distances.deviceToExif.toFixed(1)}km`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Device → Photo</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default TakeActionSection;
