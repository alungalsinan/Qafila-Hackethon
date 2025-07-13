export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'prayer' | 'quran' | 'dhikr' | 'charity' | 'learning' | 'personal';
  dueDate?: Date;
  reminderTime?: Date;
  createdAt: Date;
  completedAt?: Date;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  tags?: string[];
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Prayer {
  id: string;
  name: string;
  arabicName: string;
  time: string;
  completed: boolean;
  isCurrentPrayer?: boolean;
}

export interface Dua {
  id: string;
  arabic: string;
  translation: string;
  transliteration?: string;
  occasion: string;
  category: string;
}

export interface HabitStreak {
  id: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
  lastCompleted?: Date;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
  completedCount: number;
}

export interface IslamicReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  isActive: boolean;
  type: 'prayer' | 'dhikr' | 'quran' | 'dua' | 'custom';
  recurringDays: number[]; // 0-6 for Sunday-Saturday
}