import type { LucideIcon } from 'lucide-react';
import {
  BriefcaseBusiness,
  CarFront,
  Film,
  HeartPulse,
  House,
  Lightbulb,
  Package,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import type { Category } from '../types';

export const CATEGORY_LIST: Category[] = [
  'Food & Dining',
  'Transport',
  'Housing',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#3897C7',
  'Transport': '#7C3AED',
  'Housing': '#A855F7',
  'Healthcare': '#22D3EE',
  'Entertainment': '#F59E0B',
  'Shopping': '#EC4899',
  'Utilities': '#64748B',
  'Salary': '#10B981',
  'Freelance': '#34D399',
  'Investment': '#6EE7B7',
  'Other': '#94A3B8',
};

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  'Food & Dining': UtensilsCrossed,
  'Transport': CarFront,
  'Housing': House,
  'Healthcare': HeartPulse,
  'Entertainment': Film,
  'Shopping': ShoppingBag,
  'Utilities': Lightbulb,
  'Salary': Wallet,
  'Freelance': BriefcaseBusiness,
  'Investment': TrendingUp,
  'Other': Package,
};
