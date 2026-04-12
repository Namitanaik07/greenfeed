import { SeverityFilter, StatusFilter } from '@/types/heatmap';
import { Button } from '@/components/ui/button';
import { Filter, Flame, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

interface HeatmapFiltersProps {
  severity: SeverityFilter;
  status: StatusFilter;
  onSeverityChange: (s: SeverityFilter) => void;
  onStatusChange: (s: StatusFilter) => void;
  issueCount: number;
}

const HeatmapFilters = ({ severity, status, onSeverityChange, onStatusChange, issueCount }: HeatmapFiltersProps) => {
  const severityOptions: { value: SeverityFilter; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" />, color: 'border-primary/30 text-primary' },
    { value: 'high', label: 'High', icon: <Flame className="w-3.5 h-3.5" />, color: 'border-destructive/30 text-destructive' },
    { value: 'medium', label: 'Medium', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'border-accent-solar text-accent-solar' },
    { value: 'low', label: 'Low', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'border-primary/30 text-primary' },
  ];

  const statusOptions: { value: StatusFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" /> },
    { value: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5" /> },
    { value: 'in_progress', label: 'In Progress', icon: <Loader className="w-3.5 h-3.5" /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron font-bold text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" /> Filters
        </h3>
        <span className="text-xs text-muted-foreground">{issueCount} issues</span>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Severity</p>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map(opt => (
            <Button
              key={opt.value}
              size="sm"
              variant={severity === opt.value ? 'default' : 'outline'}
              className={`text-xs rounded-full h-7 px-3 ${severity !== opt.value ? opt.color : ''}`}
              onClick={() => onSeverityChange(opt.value)}
            >
              {opt.icon}
              <span className="ml-1">{opt.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(opt => (
            <Button
              key={opt.value}
              size="sm"
              variant={status === opt.value ? 'default' : 'outline'}
              className="text-xs rounded-full h-7 px-3"
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.icon}
              <span className="ml-1">{opt.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapFilters;
