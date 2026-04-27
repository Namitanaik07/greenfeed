export interface EnvironmentalIssue {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  reportCount: number;
  imageUrl?: string;
  reportedBy: string;
  createdAt: string;
  category: string;
}

export type SeverityFilter = 'all' | 'high' | 'medium' | 'low';
export type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed';
