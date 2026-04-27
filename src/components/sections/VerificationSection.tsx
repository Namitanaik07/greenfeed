import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Clock, Image, QrCode, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const VerificationSection = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [scores, setScores] = useState({ qr: 0, location: 0, time: 0, image: 0, total: 0 });
  const scrollToSection = useScrollToSection();

  const startVerification = () => {
    setIsVerifying(true);
    setVerificationComplete(false);

    // Simulate verification steps
    const steps = [
      { key: 'qr', value: 85, delay: 800 },
      { key: 'location', value: 92, delay: 1600 },
      { key: 'time', value: 95, delay: 2400 },
      { key: 'image', value: 88, delay: 3200 },
    ];

    steps.forEach(({ key, value, delay }) => {
      setTimeout(() => {
        setScores(prev => ({ ...prev, [key]: value }));
      }, delay);
    });

    setTimeout(() => {
      const total = 90;
      setScores(prev => ({ ...prev, total }));
      setIsVerifying(false);
      setVerificationComplete(true);
    }, 4000);
  };

  const isVerified = scores.total >= 70;

  const verificationSteps = [
    { icon: QrCode, label: 'QR Code Validation', score: scores.qr, color: 'text-primary' },
    { icon: MapPin, label: 'Location Matching', score: scores.location, color: 'text-secondary' },
    { icon: Clock, label: 'Time Validation', score: scores.time, color: 'text-accent-solar' },
    { icon: Image, label: 'Image Proof Check', score: scores.image, color: 'text-accent' },
  ];

  // Impact score calculation display
  const impactBreakdown = {
    workDone: 0.85,
    difficulty: 1.5, // Hard
    areaImportance: 1.2,
    verificationScore: scores.total / 100,
  };
  const impactScore = Math.round(impactBreakdown.workDone * impactBreakdown.difficulty * impactBreakdown.areaImportance * impactBreakdown.verificationScore * 100);

  return (
    <section id="verification" className="py-24 px-4 ">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">AI-Powered Verification</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-orbitron font-bold mb-4">
            <span className="text-glow bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verification
            </span>{' '}
            System
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Your submission is verified using multiple checks to ensure authenticity.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 lg:p-12 space-y-8 fade-in">
          {/* Start Verification */}
          {!isVerifying && !verificationComplete && (
            <div className="text-center py-8">
              <div className="p-6 rounded-full bg-primary/10 inline-block mb-6">
                <Shield className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">Ready to Verify</h3>
              <p className="text-foreground/60 mb-8">Click below to start the verification process for your submitted proof.</p>
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-bold px-10 py-6 rounded-xl glow-primary text-base"
                onClick={startVerification}
              >
                <Shield className="w-5 h-5 mr-2" /> Start Verification
              </Button>
            </div>
          )}

          {/* Verification Steps */}
          {(isVerifying || verificationComplete) && (
            <div className="space-y-6">
              {verificationSteps.map((step, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                      <span className="font-semibold text-foreground text-sm">{step.label}</span>
                    </div>
                    <span className="font-orbitron font-bold text-foreground">
                      {step.score > 0 ? `${step.score}%` : '...'}
                    </span>
                  </div>
                  <Progress value={step.score} className="h-2" />
                </div>
              ))}

              {/* Total Score */}
              {verificationComplete && (
                <div className="pt-6 border-t border-primary/20 space-y-6">
                  <div className="text-center">
                    <div className={`text-6xl font-orbitron font-black ${isVerified ? 'text-primary text-glow' : 'text-destructive'}`}>
                      {scores.total}%
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {isVerified ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1">
                          <CheckCircle className="w-4 h-4 mr-1" /> Verified ✅
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-sm px-4 py-1">
                          <XCircle className="w-4 h-4 mr-1" /> Rejected
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Impact Score Breakdown */}
                  {isVerified && (
                    <div className="glass-card-accent rounded-2xl p-6 space-y-4">
                      <h4 className="font-orbitron font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent-solar" /> Impact Score Breakdown
                      </h4>
                      <div className="text-sm text-foreground/60 font-mono bg-muted/30 p-4 rounded-xl">
                        Impact = Work Done × Difficulty × Area Importance × Verification
                        <br />
                        Impact = {impactBreakdown.workDone} × {impactBreakdown.difficulty} × {impactBreakdown.areaImportance} × {impactBreakdown.verificationScore.toFixed(2)}
                        <br />
                        <span className="text-accent-solar font-bold">= {impactScore} Impact Points</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Work Done', value: '85%', color: 'text-primary' },
                          { label: 'Difficulty', value: 'Hard (1.5x)', color: 'text-destructive' },
                          { label: 'Area Importance', value: 'High (1.2x)', color: 'text-secondary' },
                          { label: 'Verification', value: `${scores.total}%`, color: 'text-accent-solar' },
                        ].map((item, i) => (
                          <div key={i} className="bg-muted/20 p-3 rounded-xl text-center">
                            <div className={`font-orbitron font-bold ${item.color}`}>{item.value}</div>
                            <div className="text-xs text-foreground/50">{item.label}</div>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-xl glow-primary"
                        onClick={() => scrollToSection('rewards')}
                      >
                        View My Rewards →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
