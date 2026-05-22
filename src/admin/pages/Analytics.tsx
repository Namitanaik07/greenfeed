import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Map, Trophy } from 'lucide-react';
import { HeatmapItem, LeaderItem } from '@/data/adminMockData';

interface AdminContextType {
  heatmap: HeatmapItem[];
  leaders: LeaderItem[];
}

export const Analytics = () => {
  const { heatmap, leaders } = useOutletContext<AdminContextType>();
  const [activeTab, setActiveTab] = useState<'heatmap' | 'leaderboard'>('heatmap');

  const severityColor = (s: string) => {
    if (s === 'critical') return 'bg-red-100 text-red-700 border-red-300';
    if (s === 'high') return 'bg-orange-100 text-orange-700 border-orange-300';
    if (s === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  const tierColor = (t: string) => {
    if (t === 'Platinum') return 'bg-purple-100 text-purple-700 border-purple-300';
    if (t === 'Gold') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (t === 'Silver') return 'bg-gray-100 text-gray-700 border-gray-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-inter">Global Analytics</h2>
          <p className="text-muted-foreground text-sm">Monitor regional issues and top user performance.</p>
        </div>
        <div className="flex glass-card rounded-lg p-1 border border-primary/20 shadow-sm">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'heatmap' ? 'bg-[#E8FBEA] text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('heatmap')}
          >
            <Map className="w-4 h-4" /> Heatmap
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'leaderboard' ? 'bg-[#E8FBEA] text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy className="w-4 h-4" /> Leaderboard
          </button>
        </div>
      </div>

      {activeTab === 'heatmap' && (
        <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm animate-fade-in">
          <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-transparent">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Map className="w-4 h-4 text-primary" /> Issue Heatmap Data</h3>
            <Badge className="bg-primary/10 text-primary">{heatmap.length} Active Points</Badge>
          </div>
          <div className="hidden md:grid px-6 py-3 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <span className="text-xs font-bold text-muted-foreground uppercase">Location</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Type / Severity</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Coordinates</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
          </div>
          <div className="divide-y divide-primary/20/50">
            {heatmap.map(item => (
              <div key={item.id} className="grid items-center px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                <span className="font-semibold text-sm pr-4">{item.location}</span>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs uppercase text-muted-foreground">{item.type}</span>
                  <Badge variant="outline" className={`${severityColor(item.severity)} text-[10px]`}>{item.severity}</Badge>
                </div>
                <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded w-fit border border-gray-200">{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</span>
                <span className="text-sm capitalize">{item.status}</span>
              </div>
            ))}
            {heatmap.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Map className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No heatmap data found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm animate-fade-in">
          <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-transparent">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Global User Rankings</h3>
            <Badge className="bg-primary/10 text-primary">Top {leaders.length}</Badge>
          </div>
          <div className="hidden md:grid px-6 py-3 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '60px 2fr 1fr 1fr 1fr' }}>
            <span className="text-xs font-bold text-muted-foreground uppercase">Rank</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">User Profile</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Score</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Tasks Done</span>
            <span className="text-xs font-bold text-muted-foreground uppercase">Reward Tier</span>
          </div>
          <div className="divide-y divide-primary/20/50">
            {leaders.map((item, index) => (
              <div key={item.id} className="grid items-center px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors" style={{ gridTemplateColumns: '60px 2fr 1fr 1fr 1fr' }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.level}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{item.points.toLocaleString()} pts</span>
                <span className="text-sm">{item.tasks} completed</span>
                <div><Badge variant="outline" className={`${tierColor(item.tier)}`}>{item.tier}</Badge></div>
              </div>
            ))}
            {leaders.length === 0 && (
              <div className="px-6 py-16 text-center">
                <BarChart3 className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No leaderboard data found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

