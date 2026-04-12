export interface EnvironmentalTask {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardPoints: number;
  status: 'open' | 'in_progress' | 'submitted' | 'verified' | 'rejected';
  claimedBy?: string;
  imageUrl?: string;
  category: string;
}

export const environmentalTasks: EnvironmentalTask[] = [
  {
    id: '1',
    title: 'Garbage Accumulation Near Central Park',
    description: 'Large amounts of garbage spotted near the central park entrance. Needs immediate cleanup to prevent contamination.',
    location: 'Central Park, Sector 21, Delhi',
    difficulty: 'Easy',
    rewardPoints: 50,
    status: 'open',
    category: 'Garbage Cleanup',
  },
  {
    id: '2',
    title: 'Plastic Waste Dumped Near Yamuna River',
    description: 'Plastic bottles and bags dumped near the riverbank. Hazardous to aquatic life and water quality.',
    location: 'Yamuna Ghat, Delhi',
    difficulty: 'Hard',
    rewardPoints: 200,
    status: 'open',
    category: 'Water Pollution',
  },
  {
    id: '3',
    title: 'Overflowing Dustbins on MG Road',
    description: 'Multiple dustbins overflowing with waste on the main road. Causing bad odor and attracting pests.',
    location: 'MG Road, Bangalore',
    difficulty: 'Easy',
    rewardPoints: 30,
    status: 'open',
    category: 'Waste Management',
  },
  {
    id: '4',
    title: 'Waste Burning in Residential Area',
    description: 'Open burning of waste observed in residential colony. Causing air pollution and health hazards.',
    location: 'Anand Vihar, Delhi',
    difficulty: 'Medium',
    rewardPoints: 120,
    status: 'open',
    category: 'Air Pollution',
  },
  {
    id: '5',
    title: 'Illegal Dumping on Open Land',
    description: 'Construction debris and household waste illegally dumped on vacant land near school.',
    location: 'Whitefield, Bangalore',
    difficulty: 'Hard',
    rewardPoints: 180,
    status: 'open',
    category: 'Illegal Dumping',
  },
  {
    id: '6',
    title: 'Blocked Drainage Due to Waste',
    description: 'Storm water drain blocked by plastic waste causing waterlogging during rains.',
    location: 'Koramangala, Bangalore',
    difficulty: 'Medium',
    rewardPoints: 100,
    status: 'open',
    category: 'Drainage',
  },
];

export interface UserProfile {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Eco Hero';
  totalPoints: number;
  tasksCompleted: number;
  streak: number;
  badges: string[];
  impactScore: number;
}

export const mockUser: UserProfile = {
  name: 'Eco Warrior',
  level: 'Intermediate',
  totalPoints: 1250,
  tasksCompleted: 15,
  streak: 7,
  badges: ['First Action', 'Week Warrior', 'River Saver', 'Tree Planter', '10 Tasks'],
  impactScore: 78,
};

export const leaderboardData = [
  { rank: 1, name: 'Priya Sharma', points: 4520, level: 'Eco Hero', tasks: 45 },
  { rank: 2, name: 'Rahul Verma', points: 3890, level: 'Eco Hero', tasks: 38 },
  { rank: 3, name: 'Ananya Patel', points: 3210, level: 'Eco Hero', tasks: 32 },
  { rank: 4, name: 'Arjun Singh', points: 2780, level: 'Intermediate', tasks: 28 },
  { rank: 5, name: 'Meera Reddy', points: 2450, level: 'Intermediate', tasks: 24 },
  { rank: 6, name: 'Vikram Das', points: 2100, level: 'Intermediate', tasks: 21 },
  { rank: 7, name: 'Sneha Gupta', points: 1800, level: 'Intermediate', tasks: 18 },
  { rank: 8, name: 'You', points: 1250, level: 'Intermediate', tasks: 15 },
  { rank: 9, name: 'Karan Malhotra', points: 1100, level: 'Beginner', tasks: 11 },
  { rank: 10, name: 'Deepa Nair', points: 950, level: 'Beginner', tasks: 9 },
];
