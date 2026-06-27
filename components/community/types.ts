import React from 'react';
import { MarketplaceListing, ForumPost, ForumReply, Story, NavigationTab } from '@/types';

export interface Question {
  id: string;
  author: string;
  authorAvatar?: string;
  title: string;
  body: string;
  category: string;
  answers: Answer[];
  likes: number;
  solved: boolean;
  date: string;
}

export interface Answer {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  isExpert: boolean;
  accepted: boolean;
  likes: number;
  date: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  crop: string;
  xp: number;
  participants: number;
  daysLeft: number;
  progress: number;
  icon: React.ElementType;
}

export type CommunityTab = 'FEED' | 'GROUPS' | 'MARKET' | 'QA';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    author: 'Amara Okafor',
    title: 'How do you prevent fall armyworm in maize during early vegetative stage?',
    body: 'My maize is 3 weeks old and I noticed early signs of fall armyworm. What preventive measures work best at this stage before it spreads?',
    category: 'Pests',
    answers: [
      { id: 'a1', author: 'Dr. Kofi Mensah', content: 'Push-pull technology works very well — plant Desmodium between maize rows and Napier grass as a border. The Desmodium repels the moths while Napier attracts them away.', isExpert: true, accepted: true, likes: 24, date: '2026-06-10' },
      { id: 'a2', author: 'Fatima Abdullahi', content: 'I use neem oil spray at 5ml per liter of water. Apply early morning every 3 days. Worked well last season on my 2-hectare farm.', isExpert: false, accepted: false, likes: 12, date: '2026-06-11' }
    ],
    likes: 45,
    solved: true,
    date: '2026-06-09'
  },
  {
    id: 'q2',
    author: 'Rajesh Kumar',
    title: 'Best drip irrigation setup for small-scale tomato farming under 0.5 acres?',
    body: 'I want to switch from flood irrigation to drip for my tomato plot. Budget is tight — what is the most cost-effective setup for less than half an acre?',
    category: 'Equipment',
    answers: [
      { id: 'a3', author: 'Priya Sharma', content: 'Gravel-packed drip kits from local cooperatives cost around $40-60 for 0.5 acres. They last 3-5 seasons with proper maintenance.', isExpert: false, accepted: false, likes: 8, date: '2026-06-12' }
    ],
    likes: 22,
    solved: false,
    date: '2026-06-12'
  },
  {
    id: 'q3',
    author: 'Maria Santos',
    title: 'When should I apply the second dose of nitrogen for irrigated wheat?',
    body: 'First dose was at sowing. Crop is now at tillering stage. Should I wait for jointing or apply now? Soil is clay loam.',
    category: 'Crops',
    answers: [],
    likes: 15,
    solved: false,
    date: '2026-06-13'
  },
  {
    id: 'q4',
    author: 'Thomas Mwangi',
    title: 'How to improve milk yield during dry season feed shortage?',
    body: 'My crossbred cows drop from 12L to 6L per day during the dry season. What supplementary feeding strategies are cost-effective?',
    category: 'Livestock',
    answers: [
      { id: 'a4', author: 'Prof. Amina Bakari', content: 'Prepare silage from excess wet-season forage. Add molasses-based urea blocks as cheap protein supplement. Consistently get 9-10L even in dry months.', isExpert: true, accepted: false, likes: 18, date: '2026-06-13' }
    ],
    likes: 31,
    solved: false,
    date: '2026-06-13'
  }
];

export interface LocationAlerts {
  weather: import('@/types').SystemAlert[];
  prices: { id: string; title: string; message: string; severity: 'high' | 'medium' }[];
}
