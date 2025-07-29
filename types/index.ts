// types/index.ts
export interface User {
  name: string;
  level: string;
  xp: number;
  avatar?: string;
}

export interface Friend {
  name: string;
  status: 'online' | 'offline';
  activity: string;
}

export interface LearningModule {
  title: string;
  description: string;
  progress: string;
  level: string;
  color: string;
  icon: any;
}

export interface InteractiveFeature {
  title: string;
  description: string;
  type: string;
  color: string;
}

export type Theme = 'light' | 'dark';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
