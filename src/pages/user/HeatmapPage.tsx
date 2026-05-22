import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import { Toaster } from '@/components/ui/toaster';
import { Map as MapIcon, Loader2, MapPin, AlertTriangle, Flame, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { geocodeLocationName } from '@/utils/geoVerification';
import ReportIncidentModal from '@/components/heatmap/ReportIncidentModal';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Types ──
interface TaskPoint {
  id: string;
  title: string;
  location_name: string;
  category: string;
  difficulty: string;
  reward_points: number;
  status: string;
  lat: number;
  lng: number;
}

interface RegionCluster {
  name: string;
  lat: number;
  lng: number;
  taskCount: number;
  openCount: number;
  tasks: TaskPoint[];
  severity: 'critical' | 'high' | 'moderate' | 'low';
}

// ── Helpers ──
function getClusterSeverity(count: number): RegionCluster['severity'] {
  if (count >= 8) return 'critical';
  if (count >= 5) return 'high';
  if (count >= 3) return 'moderate';
  return 'low';
}

const severityConfig: Record<string, { color: string; fill: string; label: string; bg: string; text: string }> = {
  critical: { color: '#dc2626', fill: '#fecaca', label: 'Critical (8+)', bg: 'bg-red-500', text: 'text-red-600' },
  high:     { color: '#ea580c', fill: '#fed7aa', label: 'High (5-7)',     bg: 'bg-orange-500', text: 'text-orange-600' },
  moderate: { color: '#ca8a04', fill: '#fef08a', label: 'Moderate (3-4)', bg: 'bg-yellow-500', text: 'text-yellow-600' },
  low:      { color: '#16a34a', fill: '#bbf7d0', label: 'Low (1-2)',      bg: 'bg-green-500', text: 'text-green-600' },
};

// Region grouping: round lat/lng to ~11km grid
function regionKey(lat: number, lng: number) {
  return `${(Math.round(lat * 10) / 10).toFixed(1)}_${(Math.round(lng * 10) / 10).toFixed(1)}`;
}

// Build an irregular polygon around a center point to look like a geographical boundary
function buildRegionPolygon(lat: number, lng: number, taskCount: number): L.LatLngExpression[] {
  // Base spread in degrees (~0.05 deg ≈ 5.5km radius)
  const spread = 0.04 + Math.min(taskCount * 0.008, 0.06);
  // Create an organic, irregular polygon (8 vertices with jitter)
  const points: L.LatLngExpression[] = [];
  const vertexCount = 10;
  // Use a deterministic "random" based on lat+lng so shapes are consistent
  const seed = (lat * 1000 + lng * 100) % 1;
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    // Jitter the radius for organic shape (±30%)
    const jitter = 0.7 + 0.6 * Math.abs(Math.sin(seed * 100 + i * 2.7));
    const r = spread * jitter;
    // Adjust for longitude stretching at different latitudes
    const lngFactor = 1 / Math.cos((lat * Math.PI) / 180);
    points.push([
      lat + r * Math.sin(angle),
      lng + r * Math.cos(angle) * lngFactor,
    ]);
  }
  return points;
}

// ── Leaflet Map Component ──
const TaskHeatmap = ({
  clusters,
  onSelectCluster,
  onMapClick,
}: {
  clusters: RegionCluster[];
  onSelectCluster: (c: RegionCluster) => void;
  onMapClick?: (lat: number, lng: number) => void;
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.Layer[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // Light theme tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onMapClick]);

  // Draw region polygons when clusters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old layers
    layersRef.current.forEach(l => {
      try { map.removeLayer(l); } catch {}
    });
    layersRef.current = [];

    clusters.forEach(cluster => {
      const cfg = severityConfig[cluster.severity];
      const polyCoords = buildRegionPolygon(cluster.lat, cluster.lng, cluster.taskCount);

      // Region polygon — border outline + light fill
      const polygon = L.polygon(polyCoords, {
        color: cfg.color,
        weight: 3,
        opacity: 0.9,
        fillColor: cfg.fill,
        fillOpacity: 0.45,
        dashArray: cluster.severity === 'low' ? '6,4' : undefined,
      })
        .addTo(map)
        .bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:2px 0">
            <strong style="font-size:13px">${cluster.name}</strong><br/>
            <span style="font-size:11px;color:#666">${cluster.taskCount} task${cluster.taskCount > 1 ? 's' : ''} · ${cluster.openCount} open</span>
          </div>`,
          { sticky: true, className: 'leaflet-light-tooltip' }
        )
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectCluster(cluster);
        });

      layersRef.current.push(polygon);

      // Label with task count in the center
      const icon = L.divIcon({
        html: `<div style="
          background:${cfg.color};
          color:white;
          font-weight:900;
          font-size:${cluster.taskCount > 9 ? '11px' : '13px'};
          font-family:Inter,sans-serif;
          width:28px;height:28px;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px ${cfg.color}66;
          border:2px solid white;
        ">${cluster.taskCount}</div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const label = L.marker([cluster.lat, cluster.lng], { icon, interactive: false }).addTo(map);
      layersRef.current.push(label);
    });

    // Fit bounds
    if (clusters.length > 0) {
      const bounds = L.latLngBounds(clusters.map(c => [c.lat, c.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
    }
  }, [clusters, onSelectCluster]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '520px' }} />;
};

// ── Main Page ──
const HeatmapPage = () => {
  const [tasks, setTasks] = useState<TaskPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<RegionCluster | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress'>('all');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportCoords, setReportCoords] = useState<{ lat: number; lng: number } | null>(null);

  const fetchAndGeocodeTasks = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('eco_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error('[Heatmap] Fetch error:', error);
        setLoading(false);
        return;
      }

      // Geocode tasks that have a location_name but no lat/lng
      const geocoded: TaskPoint[] = [];
      const geocodeCache = new Map<string, { lat: number; lng: number } | null>();

      for (const task of data) {
        let lat = task.latitude;
        let lng = task.longitude;

        if ((!lat || !lng) && task.location_name) {
          const locKey = task.location_name.toLowerCase().trim();
          if (geocodeCache.has(locKey)) {
            const cached = geocodeCache.get(locKey);
            if (cached) { lat = cached.lat; lng = cached.lng; }
          } else {
            try {
              const coords = await geocodeLocationName(task.location_name);
              geocodeCache.set(locKey, coords);
              if (coords) { lat = coords.lat; lng = coords.lng; }
            } catch {
              geocodeCache.set(locKey, null);
            }
          }
        }

        if (lat && lng) {
          geocoded.push({
            id: task.id,
            title: task.title,
            location_name: task.location_name || 'Unknown',
            category: task.category || 'General',
            difficulty: task.difficulty || 'Easy',
            reward_points: task.reward_points || 0,
            status: task.status || 'open',
            lat,
            lng,
          });
        }
      }

      setTasks(geocoded);
    } catch (err) {
      console.error('[Heatmap] Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndGeocodeTasks();
  }, [fetchAndGeocodeTasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') return tasks;
    return tasks.filter(t => t.status === statusFilter);
  }, [tasks, statusFilter]);

  // Cluster tasks into regions
  const clusters = useMemo<RegionCluster[]>(() => {
    const map = new Map<string, TaskPoint[]>();

    filteredTasks.forEach(t => {
      const key = regionKey(t.lat, t.lng);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });

    return Array.from(map.entries()).map(([, regionTasks]) => {
      const avgLat = regionTasks.reduce((s, t) => s + t.lat, 0) / regionTasks.length;
      const avgLng = regionTasks.reduce((s, t) => s + t.lng, 0) / regionTasks.length;
      const name = regionTasks[0].location_name.split(',')[0];
      const openCount = regionTasks.filter(t => t.status === 'open').length;

      return {
        name,
        lat: avgLat,
        lng: avgLng,
        taskCount: regionTasks.length,
        openCount,
        tasks: regionTasks,
        severity: getClusterSeverity(regionTasks.length),
      };
    }).sort((a, b) => b.taskCount - a.taskCount);
  }, [filteredTasks]);

  // Stats
  const totalTasks = filteredTasks.length;
  const hotspotCount = clusters.filter(c => c.severity === 'critical' || c.severity === 'high').length;
  const openTasks = filteredTasks.filter(t => t.status === 'open').length;

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <NavBar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-10 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-6">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-foreground/80">Task Density Map</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-inter font-bold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 bg-clip-text text-transparent">
                Environmental
              </span>{' '}
              Heatmap
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Regions with more tasks appear in <span className="text-red-600 font-bold">red</span> (critical), while cleaner areas appear in <span className="text-green-600 font-bold">green</span>. Click any zone to view tasks.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-2xl font-inter font-black text-foreground">{totalTasks}</p>
              <p className="text-[11px] text-muted-foreground font-medium">Total Tasks</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-2xl font-inter font-black text-red-500">{hotspotCount}</p>
              <p className="text-[11px] text-muted-foreground font-medium">Hotspot Regions</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-2xl font-inter font-black text-green-500">{openTasks}</p>
              <p className="text-[11px] text-muted-foreground font-medium">Open to Claim</p>
            </div>
          </div>

          {/* Layout */}
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-4 order-2 lg:order-1">
              {/* Filters */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-inter font-bold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" /> Filter by Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'open', 'in_progress'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        statusFilter === s
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {s === 'all' ? 'All Tasks' : s === 'open' ? 'Open' : 'In Progress'}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-xs gap-2"
                  onClick={fetchAndGeocodeTasks}
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Data
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full mt-2 text-xs gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl"
                  onClick={() => {
                    setReportCoords(null);
                    setIsReportOpen(true);
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                </Button>
              </div>

              {/* Legend */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-inter font-bold text-sm mb-3">Density Legend</h3>
                <div className="space-y-2.5">
                  {Object.entries(severityConfig).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-6 h-4 rounded-sm border-2" style={{ borderColor: cfg.color, backgroundColor: cfg.fill }} />
                      <span className="text-xs text-foreground/70">{cfg.label} tasks</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region List */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-inter font-bold text-sm mb-3">Regions ({clusters.length})</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {clusters.map((c, i) => {
                    const cfg = severityConfig[c.severity];
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCluster(c)}
                        className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-md ${
                          selectedCluster?.name === c.name
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-muted/30 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground truncate">{c.name}</span>
                          <span className={`text-xs font-bold ${cfg.text}`}>{c.taskCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-2 rounded-sm border" style={{ borderColor: cfg.color, backgroundColor: cfg.fill }} />
                          <span className="text-[10px] text-muted-foreground">{c.openCount} open · {c.taskCount - c.openCount} claimed</span>
                        </div>
                      </button>
                    );
                  })}
                  {clusters.length === 0 && !loading && (
                    <p className="text-xs text-muted-foreground text-center py-4">No tasks with location data found.</p>
                  )}
                </div>
              </div>

              {/* Selected Cluster Detail */}
              {selectedCluster && (
                <div className="glass-card rounded-2xl p-5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-inter font-bold text-sm">{selectedCluster.name}</h3>
                    <button onClick={() => setSelectedCluster(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${severityConfig[selectedCluster.severity].bg} text-white text-[10px]`}>
                      {selectedCluster.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedCluster.taskCount} tasks in this zone</span>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {selectedCluster.tasks.map(t => (
                      <div key={t.id} className="p-2.5 rounded-lg bg-muted/20 border border-muted/30">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">{t.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">{t.category}</span>
                          <Badge variant="outline" className={`text-[9px] ${
                            t.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            t.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            'bg-green-50 text-green-600 border-green-200'
                          }`}>
                            {t.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{t.location_name.split(',')[0]}
                          </span>
                          <span className="text-[10px] font-bold text-primary">{t.reward_points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="order-1 lg:order-2 glass-card rounded-xl overflow-hidden border border-primary/20" style={{ minHeight: '520px' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-white/50">
                <MapIcon className="w-4 h-4 text-primary" />
                <span className="font-inter text-sm font-bold">Task Density Map</span>
                <span className="ml-auto text-xs text-muted-foreground">{clusters.length} regions · {totalTasks} tasks</span>
              </div>
              {loading ? (
                <div className="flex items-center justify-center" style={{ minHeight: '480px' }}>
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Geocoding task locations...</p>
                  </div>
                </div>
              ) : (
                <TaskHeatmap
                  clusters={clusters}
                  onSelectCluster={setSelectedCluster}
                  onMapClick={(lat, lng) => {
                    setReportCoords({ lat, lng });
                    setIsReportOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <ReportIncidentModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        initialCoords={reportCoords}
        onSuccess={fetchAndGeocodeTasks}
      />
    </div>
  );
};

export default HeatmapPage;
