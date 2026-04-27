import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnvironmentalIssue } from '@/types/heatmap';

interface EnvironmentalMapProps {
  issues: EnvironmentalIssue[];
  onSelectIssue: (issue: EnvironmentalIssue) => void;
  center: [number, number];
  zoom: number;
}

const severityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
};

const EnvironmentalMap = ({ issues, onSelectIssue, center, zoom }: EnvironmentalMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    issues.forEach(issue => {
      const radius = ({ high: 14, medium: 10, low: 7 })[issue.severity] + Math.min(issue.reportCount, 10);
      const color = severityColors[issue.severity];

      const marker = L.circleMarker([issue.lat, issue.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.45,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip(
          `<strong>${issue.title}</strong><br/>${issue.reportCount} reports · ${issue.severity}`,
          { className: 'leaflet-dark-tooltip' }
        )
        .on('click', () => onSelectIssue(issue));

      markersRef.current.push(marker);
    });

    // Fit bounds
    if (issues.length > 0) {
      const bounds = L.latLngBounds(issues.map(i => [i.lat, i.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [issues, onSelectIssue]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '500px' }} />;
};

export default EnvironmentalMap;
