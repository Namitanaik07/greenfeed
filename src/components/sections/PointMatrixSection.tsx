import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Trash2, Droplets, Recycle, Battery, QrCode,
  CalendarCheck, CheckSquare, Upload, Flame, UserPlus,
  MapPin, Users, AlertTriangle, Copy, FileWarning,
  MessageSquareWarning, ShieldAlert, ChevronDown, ChevronUp,
  TrendingUp, Award, Gift
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSmartDustbin } from '@/hooks/useSmartDustbin';

// ── Point Matrix Data (matching SRS) ──────────────────────
const earnActivities = [
  { icon: Trash2,        label: 'Dispose dry recyclable waste', condition: 'Per 1 kg',            pts: '+20',  color: 'text-amber-600',   bg: 'bg-amber-500/10' },
  { icon: Droplets,      label: 'Dispose wet waste correctly',  condition: 'Per 1 kg',            pts: '+10',  color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  { icon: Recycle,       label: 'Dispose recyclable waste',     condition: 'Per 1 kg',            pts: '+20',  color: 'text-green-500',   bg: 'bg-green-500/10' },
  { icon: Battery,       label: 'Dispose e-waste properly',     condition: 'Per 1 kg',            pts: '+25',  color: 'text-purple-500',  bg: 'bg-purple-500/10' },
  { icon: QrCode,        label: 'Scan QR & use smart bin',      condition: 'Each usage',          pts: '+5',   color: 'text-primary',     bg: 'bg-primary/10' },
  { icon: CalendarCheck, label: 'Daily active participation',   condition: 'Once per day',        pts: '+10',  color: 'text-orange-500',  bg: 'bg-orange-500/10' },
  { icon: CheckSquare,   label: 'Complete cleanup task',        condition: 'Verified by admin',   pts: '+50',  color: 'text-secondary',   bg: 'bg-secondary/10' },
  { icon: Upload,        label: 'Upload environmental activity',condition: 'Approved post',       pts: '+15',  color: 'text-cyan-500',    bg: 'bg-cyan-500/10' },
  { icon: Flame,         label: 'Consecutive 7-day streak',     condition: 'Daily usage',         pts: '+40',  color: 'text-red-500',     bg: 'bg-red-500/10' },
  { icon: UserPlus,      label: 'Refer a new user',             condition: 'Successful signup',   pts: '+25',  color: 'text-indigo-500',  bg: 'bg-indigo-500/10' },
  { icon: MapPin,        label: 'Report polluted area',         condition: 'Verified report',     pts: '+20',  color: 'text-rose-500',    bg: 'bg-rose-500/10' },
  { icon: Users,         label: 'Participate in community drive',condition: 'Event participation',pts: '+60',  color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const penalties = [
  { icon: AlertTriangle,       label: 'Wrong waste segregation',      penalty: '-10 pts',       severity: 'warning' },
  { icon: FileWarning,         label: 'Fake cleanup task submission', penalty: '-50 pts',       severity: 'danger' },
  { icon: Copy,                label: 'Uploading duplicate images',   penalty: '-20 pts',       severity: 'warning' },
  { icon: MessageSquareWarning,label: 'Spam pollution reports',       penalty: '-20 pts',       severity: 'warning' },
  { icon: ShieldAlert,         label: 'Misusing QR code system',      penalty: 'Account Warning', severity: 'danger' },
];

const PointMatrixSection = () => {
  const { user, profile } = useAuth();
  const { totalPoints: binPoints, totalWeightKg, logs } = useSmartDustbin(user?.id ?? null);
  const [showPenalties, setShowPenalties] = useState(false);

  const totalPoints = profile?.total_points ?? 0;
  const tasksCompleted = profile?.tasks_completed ?? 0;
  const streak = profile?.streak_days ?? 0;

  // Calculate points from different sources
  const taskPoints = tasksCompleted * 50;
  const streakBonuses = Math.floor(streak / 7) * 40;
  const dailyPoints = streak * 10;

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-4">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-foreground/80">Point Matrix System</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-inter font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Earn
            </span>{' '}
            & Track Your Points
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every eco-action you take earns rewards. Here's exactly how the point system works.
          </p>
        </div>

        {/* Live Points Summary */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-inter font-black text-primary">{totalPoints}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Points</div>
            </div>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
              <Trash2 className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <div className="text-2xl font-inter font-black text-green-600">{binPoints}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Smart Bin Pts</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
              <CheckSquare className="w-5 h-5 mx-auto mb-1 text-secondary" />
              <div className="text-2xl font-inter font-black text-secondary">{taskPoints}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Task Pts</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-2xl font-inter font-black text-orange-500">{streakBonuses}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak Bonus</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <Award className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-2xl font-inter font-black text-blue-500">{totalWeightKg.toFixed(1)} kg</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Waste Disposed</div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-500" />
              <div className="text-2xl font-inter font-black text-red-500">{profile?.penalties || 0}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Penalties</div>
            </div>
          </div>
        </div>

        {/* ── Earning Matrix ── */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h3 className="font-inter font-bold text-lg flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Point Earning Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-1">All activities that earn you GreenFeed reward points</p>
          </div>

          <div className="divide-y divide-primary/5">
            {earnActivities.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.label}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary/[0.02] transition-colors"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={`p-2 rounded-lg ${a.bg} shrink-0`}>
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground">{a.label}</div>
                    <div className="text-[11px] text-muted-foreground">{a.condition}</div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-inter font-bold text-sm shrink-0">
                    {a.pts}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── How Points Are Used ── */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <h3 className="font-inter font-bold text-lg mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            What Can You Do With Points?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { emoji: '🎟️', label: 'Redeem coupons', desc: 'Amazon, Swiggy, Flipkart & more' },
              { emoji: '🌱', label: 'Eco-friendly products', desc: 'Sustainable merch from the store' },
              { emoji: '🏅', label: 'Achievement badges', desc: 'Unlock special profile badges' },
              { emoji: '🏆', label: 'Leaderboard ranking', desc: 'Climb the GreenFeed leaderboard' },
              { emoji: '🌍', label: 'Environmental campaigns', desc: 'Join drives and earn bonus' },
              { emoji: '⭐', label: 'Premium tier access', desc: 'Unlock Gold & Platinum perks' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <div className="font-semibold text-sm text-foreground">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Penalty System ── */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
          <button
            className="w-full p-5 flex items-center justify-between border-b border-red-500/10 bg-gradient-to-r from-red-500/5 to-orange-500/5 hover:from-red-500/10 hover:to-orange-500/10 transition-colors"
            onClick={() => setShowPenalties(!showPenalties)}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <h3 className="font-inter font-bold text-lg text-foreground">Penalty System</h3>
                <p className="text-xs text-muted-foreground">Ensures fair participation and prevents misuse</p>
              </div>
            </div>
            {showPenalties ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>

          {showPenalties && (
            <div className="divide-y divide-red-500/5">
              {/* How it works */}
              <div className="p-5 bg-red-500/[0.02]">
                <h4 className="font-semibold text-sm text-foreground mb-3">How the Penalty System Works</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'User performs an activity (disposal or task)',
                    'System or admin verifies the activity',
                    'If incorrect or fraudulent → penalties applied',
                    'Points deducted & warnings issued',
                    'Repeated violations → account restriction',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty table */}
              {penalties.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="flex items-center gap-4 px-5 py-3.5">
                    <div className={`p-2 rounded-lg ${p.severity === 'danger' ? 'bg-red-500/10' : 'bg-orange-500/10'} shrink-0`}>
                      <Icon className={`w-4 h-4 ${p.severity === 'danger' ? 'text-red-500' : 'text-orange-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{p.label}</div>
                    </div>
                    <Badge className={`font-inter font-bold text-sm shrink-0 ${
                      p.severity === 'danger'
                        ? 'bg-red-500/10 text-red-600 border-red-500/20'
                        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                    }`}>
                      {p.penalty}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Recent Smart Bin Activity (live from Supabase) ── */}
        {logs.length > 0 && (
          <div className="glass-card rounded-2xl p-6 animate-fade-in">
            <h3 className="font-inter font-bold text-lg mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-secondary" />
              Your Smart Bin History
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] ml-auto">LIVE</Badge>
            </h3>
            <div className="space-y-2">
              {logs.slice(0, 8).map(log => {
                const icons: Record<string, string> = { dry: '📦', wet: '🍃', recyclable: '♻️', 'e-waste': '🔋' };
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-primary/5 hover:border-primary/20 transition-colors">
                    <span className="text-xl">{icons[log.waste_type] ?? '🗑️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground capitalize">{log.waste_type} waste</div>
                      <div className="text-xs text-muted-foreground">
                        {log.weight_grams}g · {log.location_name || 'Smart Bin'} · {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="font-inter font-bold text-green-600 text-sm">+{log.points_awarded}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PointMatrixSection;
