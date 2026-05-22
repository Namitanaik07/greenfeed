export interface FeedItem {
  id: string; title: string; content: string; author: string; hashtags: string; likes: number; date: string;
}
export interface SpotIssueItem {
  id: string; title: string; location: string; severity: string; status: string; reporter: string; date: string;
}
export interface ActionItem {
  id: string; title: string; description: string; category: string; points: number; deadline: string; status: string; assignedTo?: string; submittedBy?: string;
}
export interface RewardItem {
  id: string; name: string; description: string; cost: number; category: string; stock: number;
}
export interface HeatmapItem {
  id: string; location: string; type: string; severity: string; lat: number; lng: number; status: string;
}
export interface LeaderItem {
  id: string; name: string; points: number; level: string; tasks: number; tier: string;
}
export interface MockAppUser {
  id: string; name: string; email: string; city: string; joinedDate: string; claimedTaskIds: string[];
}

export const initialFeed: FeedItem[] = [
  { id: 'f1', title: 'Beach Cleanup Day', content: 'Collected 50kg of plastic waste from Juhu Beach', author: 'Priya S.', hashtags: '#BeachCleanup #PlasticFree', likes: 24, date: '2026-05-01' },
  { id: 'f2', title: 'Tree Planting Drive', content: 'Planted 30 saplings in the community park', author: 'Rahul V.', hashtags: '#TreePlanting #GreenFeed', likes: 18, date: '2026-05-03' },
  { id: 'f3', title: 'Waste Segregation Workshop', content: 'Conducted a workshop for 100 students on waste management', author: 'Ananya P.', hashtags: '#ZeroWaste #Education', likes: 32, date: '2026-05-05' },
];

export const initialSpotIssues: SpotIssueItem[] = [
  { id: 's1', title: 'Overflowing Dustbin', location: 'MG Road, Bangalore', severity: 'high', status: 'open', reporter: 'Arjun S.', date: '2026-05-02' },
  { id: 's2', title: 'Illegal Dumping', location: 'Lake Area, Mangalore', severity: 'critical', status: 'in-progress', reporter: 'Meera R.', date: '2026-05-04' },
  { id: 's3', title: 'Broken Recycling Bin', location: 'MITE Campus', severity: 'medium', status: 'resolved', reporter: 'Kiran M.', date: '2026-04-28' },
];

export const initialActions: ActionItem[] = [
  { id: 'a1', title: 'Beach Cleanup Drive', description: 'Organize and participate in beach cleanup', category: 'cleanup', points: 50, deadline: '2026-05-15', status: 'in-progress', assignedTo: 'u1' },
  { id: 'a2', title: 'Plant 10 Trees', description: 'Plant saplings in designated areas', category: 'planting', points: 75, deadline: '2026-05-20', status: 'pending_verification', submittedBy: 'u2', assignedTo: 'u2' },
  { id: 'a3', title: 'Eco Workshop', description: 'Conduct awareness session on waste management', category: 'awareness', points: 100, deadline: '2026-06-01', status: 'active' },
];

export const initialRewards: RewardItem[] = [
  { id: 'r1', name: 'Eco Tote Bag', description: 'Reusable cotton tote bag with GreenFeed logo', cost: 200, category: 'merchandise', stock: 50 },
  { id: 'r2', name: 'Amazon Voucher ₹500', description: 'Amazon gift card worth ₹500', cost: 1000, category: 'voucher', stock: 20 },
  { id: 'r3', name: 'Plant a Tree Certificate', description: 'We plant a tree in your name', cost: 150, category: 'impact', stock: 999 },
];

export const initialHeatmap: HeatmapItem[] = [
  { id: 'h1', location: 'Juhu Beach, Mumbai', type: 'waste-dump', severity: 'high', lat: 19.0988, lng: 72.8267, status: 'active' },
  { id: 'h2', location: 'Cubbon Park, Bangalore', type: 'air-quality', severity: 'medium', lat: 12.9763, lng: 77.5929, status: 'monitoring' },
  { id: 'h3', location: 'Marina Beach, Chennai', type: 'water-pollution', severity: 'critical', lat: 13.0500, lng: 80.2824, status: 'active' },
];

export const initialLeaderboard: LeaderItem[] = [
  { id: 'l1', name: 'Priya Sharma', points: 4520, level: 'Eco Hero', tasks: 45, tier: 'Platinum' },
  { id: 'l2', name: 'Rahul Verma', points: 3890, level: 'Eco Hero', tasks: 38, tier: 'Gold' },
  { id: 'l3', name: 'Ananya Patel', points: 3210, level: 'Eco Warrior', tasks: 30, tier: 'Gold' },
  { id: 'l4', name: 'Arjun Singh', points: 2780, level: 'Intermediate', tasks: 25, tier: 'Silver' },
  { id: 'l5', name: 'Meera Reddy', points: 2450, level: 'Intermediate', tasks: 22, tier: 'Silver' },
];

export const initialAppUsers: MockAppUser[] = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', city: 'Mumbai', joinedDate: '2026-01-15', claimedTaskIds: ['a1'] },
  { id: 'u2', name: 'Rahul Verma', email: 'rahul@example.com', city: 'Bangalore', joinedDate: '2026-02-10', claimedTaskIds: ['a2'] },
  { id: 'u3', name: 'Ananya Patel', email: 'ananya@example.com', city: 'Delhi', joinedDate: '2026-03-05', claimedTaskIds: [] },
  { id: 'u4', name: 'Arjun Singh', email: 'arjun@example.com', city: 'Chennai', joinedDate: '2026-04-20', claimedTaskIds: [] },
];
