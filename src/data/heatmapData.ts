import { EnvironmentalIssue } from '@/types/heatmap';

export const mockIssues: EnvironmentalIssue[] = [
  {
    id: '1', title: 'Garbage Near Central Park', description: 'Large accumulation of plastic waste near the park entrance.',
    lat: 28.6139, lng: 77.2090, severity: 'high', status: 'pending', reportCount: 12,
    reportedBy: 'EcoWarrior_Raj', createdAt: '2026-03-28', category: 'Plastic Waste',
  },
  {
    id: '2', title: 'Overflowing Bins at Market', description: 'Bins overflowing with mixed waste, attracting pests.',
    lat: 28.6329, lng: 77.2195, severity: 'high', status: 'in_progress', reportCount: 8,
    reportedBy: 'GreenActivist_Maya', createdAt: '2026-03-27', category: 'Overflowing Bins',
  },
  {
    id: '3', title: 'Plastic in Yamuna River', description: 'Plastic waste accumulating near the riverbank.',
    lat: 28.6468, lng: 77.2425, severity: 'high', status: 'pending', reportCount: 20,
    reportedBy: 'RiverGuard_Ankit', createdAt: '2026-03-25', category: 'Water Pollution',
  },
  {
    id: '4', title: 'Illegal Dumping Site', description: 'Unauthorized waste dumping in residential area.',
    lat: 28.5921, lng: 77.1860, severity: 'medium', status: 'pending', reportCount: 5,
    reportedBy: 'CleanCity_Priya', createdAt: '2026-03-29', category: 'Illegal Dumping',
  },
  {
    id: '5', title: 'Blocked Drainage Canal', description: 'Drainage blocked with solid waste causing waterlogging.',
    lat: 28.6200, lng: 77.2350, severity: 'medium', status: 'in_progress', reportCount: 6,
    reportedBy: 'DrainWatch_Suresh', createdAt: '2026-03-26', category: 'Blocked Drainage',
  },
  {
    id: '6', title: 'Clean Park Zone', description: 'This area was cleaned last week and is well maintained.',
    lat: 28.6050, lng: 77.2250, severity: 'low', status: 'completed', reportCount: 1,
    reportedBy: 'ParkKeeper_Neha', createdAt: '2026-03-20', category: 'Resolved',
  },
  {
    id: '7', title: 'Community Garden Cleanup', description: 'Successful cleanup drive completed.',
    lat: 28.6350, lng: 77.2000, severity: 'low', status: 'completed', reportCount: 2,
    reportedBy: 'GardenHero_Amit', createdAt: '2026-03-18', category: 'Resolved',
  },
  {
    id: '8', title: 'E-Waste Dumping Near School', description: 'Electronic waste found near school premises.',
    lat: 28.6500, lng: 77.1950, severity: 'high', status: 'pending', reportCount: 9,
    reportedBy: 'SafeSchool_Divya', createdAt: '2026-03-30', category: 'E-Waste',
  },
  {
    id: '9', title: 'Construction Debris on Road', description: 'Construction waste blocking pedestrian path.',
    lat: 28.5800, lng: 77.2100, severity: 'medium', status: 'pending', reportCount: 4,
    reportedBy: 'RoadWatch_Karan', createdAt: '2026-03-29', category: 'Construction Waste',
  },
  {
    id: '10', title: 'Beach Cleanup Complete', description: 'Shoreline cleaned and maintained.',
    lat: 13.0827, lng: 80.2707, severity: 'low', status: 'completed', reportCount: 1,
    reportedBy: 'BeachGuard_Ravi', createdAt: '2026-03-15', category: 'Resolved',
  },
  {
    id: '11', title: 'Industrial Effluent Discharge', description: 'Factory releasing untreated water into drain.',
    lat: 12.9716, lng: 77.5946, severity: 'high', status: 'pending', reportCount: 15,
    reportedBy: 'WaterWatch_Lakshmi', createdAt: '2026-03-28', category: 'Water Pollution',
  },
  {
    id: '12', title: 'Waste Burning Site', description: 'Open burning of garbage creating air pollution.',
    lat: 19.0760, lng: 72.8777, severity: 'high', status: 'in_progress', reportCount: 11,
    reportedBy: 'AirGuard_Pooja', createdAt: '2026-03-27', category: 'Air Pollution',
  },
];
