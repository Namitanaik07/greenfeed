import { EnvironmentalIssue } from '@/types/heatmap';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface IssueDetailPanelProps {
  issue: EnvironmentalIssue;
  onClose: () => void;
}

const severityConfig = {
  high: { label: 'High Severity', bg: 'bg-destructive/20 text-destructive border-destructive/30' },
  medium: { label: 'Medium Severity', bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low: { label: 'Low Severity', bg: 'bg-primary/20 text-primary border-primary/30' },
};

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-yellow-500/20 text-yellow-400' },
  in_progress: { label: 'In Progress', bg: 'bg-secondary/20 text-secondary' },
  completed: { label: 'Completed', bg: 'bg-primary/20 text-primary' },
};

const IssueDetailPanel = ({ issue, onClose }: IssueDetailPanelProps) => {
  const sev = severityConfig[issue.severity];
  const stat = statusConfig[issue.status];

  const handleClaim = () => {
    toast({
      title: 'Task Claimed! 🎯',
      description: `You've claimed: "${issue.title}". Start working and submit proof!`,
    });
    onClose();
  };

  return (
    <div className="glass-card p-5 rounded-xl border border-primary/20 animate-in slide-in-from-right-5 duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-orbitron font-bold text-lg pr-4">{issue.title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full border ${sev.bg}`}>{sev.label}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${stat.bg}`}>{stat.label}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{issue.category}</span>
      </div>

      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{issue.description}</p>

      <div className="space-y-2 mb-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</div>
        <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" />{issue.reportedBy}</div>
        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{issue.createdAt}</div>
        <div className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />{issue.reportCount} reports</div>
      </div>

      {issue.status === 'pending' && (
        <Button onClick={handleClaim} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-xl">
          Claim This Task
        </Button>
      )}
      {issue.status === 'in_progress' && (
        <div className="text-center text-xs text-secondary py-2 border border-secondary/20 rounded-xl">🔒 Task in progress</div>
      )}
      {issue.status === 'completed' && (
        <div className="text-center text-xs text-primary py-2 border border-primary/20 rounded-xl">✅ Resolved</div>
      )}
    </div>
  );
};

export default IssueDetailPanel;
