export enum QuadrantType {
  URGENT_IMPORTANT = 'urgent_important',
  NOT_URGENT_IMPORTANT = 'not_urgent_important', 
  URGENT_NOT_IMPORTANT = 'urgent_not_important',
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: QuadrantType;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

export interface QuadrantInfo {
  type: QuadrantType;
  name: string;
  description: string;
  actionStrategy: string;
}

export interface CustomQuadrantLabels {
  [QuadrantType.URGENT_IMPORTANT]?: Partial<Omit<QuadrantInfo, 'type'>>;
  [QuadrantType.NOT_URGENT_IMPORTANT]?: Partial<Omit<QuadrantInfo, 'type'>>;
  [QuadrantType.URGENT_NOT_IMPORTANT]?: Partial<Omit<QuadrantInfo, 'type'>>;
  [QuadrantType.NOT_URGENT_NOT_IMPORTANT]?: Partial<Omit<QuadrantInfo, 'type'>>;
}