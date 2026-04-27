import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/sections/Footer';
import EnvironmentalMap from '@/components/heatmap/EnvironmentalMap';
import HeatmapFilters from '@/components/heatmap/HeatmapFilters';
import HeatmapLegend from '@/components/heatmap/HeatmapLegend';
import IssueDetailPanel from '@/components/heatmap/IssueDetailPanel';
import TimeSlider from '@/components/heatmap/TimeSlider';
import ReportIncidentModal from '@/components/heatmap/ReportIncidentModal';
import { mockIssues } from '@/data/heatmapData';
import { EnvironmentalIssue, SeverityFilter, StatusFilter } from '@/types/heatmap';
import { Toaster } from '@/components/ui/toaster';
import { Map, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const timeLabels = ['1W', '2W', '1M', '3M', 'All'];

const HeatmapPage = () => {
  const [severity, setSeverity] = useState<SeverityFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [selectedIssue, setSelectedIssue] = useState<EnvironmentalIssue | null>(null);
  const [timeRange, setTimeRange] = useState(4);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockIssues.filter(i => {
      if (severity !== 'all' && i.severity !== severity) return false;
      if (status !== 'all' && i.status !== status) return false;
      return true;
    });
  }, [severity, status]);

  return (
    <div className="min-h-screen particles-bg">
      <Toaster />
      <NavBar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-10 fade-in">
            <h1 className="text-4xl lg:text-5xl font-inter font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Environmental
              </span>{' '}
              Heatmap
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore real-time environmental conditions across regions. Identify hotspots, track progress, and claim tasks directly from the map.
            </p>
            <Button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 bg-primary text-white gap-2 rounded-xl font-semibold"
            >
              <Plus className="w-4 h-4" /> Report Issue
            </Button>
          </div>

          {/* Layout */}
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-4 order-2 lg:order-1">
              <HeatmapFilters
                severity={severity}
                status={status}
                onSeverityChange={setSeverity}
                onStatusChange={setStatus}
                issueCount={filtered.length}
              />
              <TimeSlider value={timeRange} onChange={setTimeRange} labels={timeLabels} />
              <HeatmapLegend />
              {selectedIssue && (
                <IssueDetailPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
              )}
            </div>

            {/* Map */}
            <div className="order-1 lg:order-2 glass-card rounded-xl overflow-hidden border border-primary/20" style={{ minHeight: '500px' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10">
                <Map className="w-4 h-4 text-primary" />
                <span className="font-inter text-sm font-bold">Live Map</span>
                <span className="ml-auto text-xs text-muted-foreground">{filtered.length} active points</span>
              </div>
              <EnvironmentalMap
                issues={filtered}
                onSelectIssue={setSelectedIssue}
                center={[22.5, 78.9]}
                zoom={5}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ReportIncidentModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};

export default HeatmapPage;
