const HeatmapLegend = () => {
  const items = [
    { color: 'bg-red-500', label: 'High Waste / Urgent' },
    { color: 'bg-yellow-500', label: 'Moderate Issues' },
    { color: 'bg-green-500', label: 'Clean / Resolved' },
  ];

  return (
    <div className="glass-card p-4 rounded-xl">
      <h3 className="font-orbitron font-bold text-sm mb-3">Legend</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-xs text-foreground/80">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapLegend;
