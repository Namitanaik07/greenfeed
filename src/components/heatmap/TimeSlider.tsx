import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';

interface TimeSliderProps {
  value: number;
  onChange: (v: number) => void;
  labels: string[];
}

const TimeSlider = ({ value, onChange, labels }: TimeSliderProps) => (
  <div className="glass-card p-4 rounded-xl">
    <div className="flex items-center gap-2 mb-3">
      <Clock className="w-4 h-4 text-secondary" />
      <h3 className="font-orbitron font-bold text-sm">Time Range</h3>
    </div>
    <Slider
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      max={labels.length - 1}
      step={1}
      className="mb-2"
    />
    <div className="flex justify-between text-xs text-muted-foreground">
      {labels.map((l, i) => (
        <span key={i} className={i === value ? 'text-primary font-semibold' : ''}>{l}</span>
      ))}
    </div>
  </div>
);

export default TimeSlider;
