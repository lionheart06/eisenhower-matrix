import { Task, QuadrantType, QuadrantInfo, CustomQuadrantLabels } from './types';

export class EisenhowerMatrix {
  private tasks: Map<string, Task> = new Map();
  private quadrantLabels: Record<QuadrantType, QuadrantInfo>;

  static readonly DEFAULT_QUADRANTS: Record<QuadrantType, QuadrantInfo> = {
    [QuadrantType.URGENT_IMPORTANT]: {
      type: QuadrantType.URGENT_IMPORTANT,
      name: 'Do First',
      description: 'Urgent and Important',
      actionStrategy: 'Do these tasks immediately'
    },
    [QuadrantType.NOT_URGENT_IMPORTANT]: {
      type: QuadrantType.NOT_URGENT_IMPORTANT,
      name: 'Schedule',
      description: 'Important but Not Urgent',
      actionStrategy: 'Schedule these tasks for later'
    },
    [QuadrantType.URGENT_NOT_IMPORTANT]: {
      type: QuadrantType.URGENT_NOT_IMPORTANT,
      name: 'Delegate',
      description: 'Urgent but Not Important',
      actionStrategy: 'Delegate these tasks if possible'
    },
    [QuadrantType.NOT_URGENT_NOT_IMPORTANT]: {
      type: QuadrantType.NOT_URGENT_NOT_IMPORTANT,
      name: 'Eliminate',
      description: 'Neither Urgent nor Important',
      actionStrategy: 'Eliminate these tasks'
    }
  };

  constructor(customLabels?: CustomQuadrantLabels) {
    this.quadrantLabels = this.mergeQuadrantLabels(customLabels);
  }

  addTask(title: string, description: string, quadrant: QuadrantType, id?: string): Task {
    const taskId = id || this.generateId();
    const task: Task = {
      id: taskId,
      title,
      description,
      quadrant,
      createdAt: new Date(),
      isCompleted: false
    };
    
    this.tasks.set(taskId, task);
    return task;
  }

  removeTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  completeTask(id: string): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const completedTask = {
      ...task,
      isCompleted: true,
      completedAt: new Date()
    };
    
    this.tasks.set(id, completedTask);
    return completedTask;
  }

  getTask(id: string): Task | null {
    return this.tasks.get(id) || null;
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getTasksByQuadrant(quadrant: QuadrantType): Task[] {
    return this.getAllTasks().filter(task => task.quadrant === quadrant);
  }

  getCompletedTasks(): Task[] {
    return this.getAllTasks().filter(task => task.isCompleted);
  }

  getPendingTasks(): Task[] {
    return this.getAllTasks().filter(task => !task.isCompleted);
  }

  getMatrix(): Record<QuadrantType, Task[]> {
    return {
      [QuadrantType.URGENT_IMPORTANT]: this.getTasksByQuadrant(QuadrantType.URGENT_IMPORTANT),
      [QuadrantType.NOT_URGENT_IMPORTANT]: this.getTasksByQuadrant(QuadrantType.NOT_URGENT_IMPORTANT),
      [QuadrantType.URGENT_NOT_IMPORTANT]: this.getTasksByQuadrant(QuadrantType.URGENT_NOT_IMPORTANT),
      [QuadrantType.NOT_URGENT_NOT_IMPORTANT]: this.getTasksByQuadrant(QuadrantType.NOT_URGENT_NOT_IMPORTANT)
    };
  }

  clear(): void {
    this.tasks.clear();
  }

  getTaskCount(): number {
    return this.tasks.size;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private mergeQuadrantLabels(customLabels?: CustomQuadrantLabels): Record<QuadrantType, QuadrantInfo> {
    if (!customLabels) {
      return { ...EisenhowerMatrix.DEFAULT_QUADRANTS };
    }

    const merged = { ...EisenhowerMatrix.DEFAULT_QUADRANTS };
    
    Object.entries(customLabels).forEach(([quadrantType, customInfo]) => {
      const type = quadrantType as QuadrantType;
      if (customInfo) {
        merged[type] = {
          ...merged[type],
          ...customInfo,
          type: type
        };
      }
    });

    return merged;
  }

  getQuadrantInfo(quadrant: QuadrantType): QuadrantInfo {
    return this.quadrantLabels[quadrant];
  }

  getAllQuadrantInfo(): Record<QuadrantType, QuadrantInfo> {
    return { ...this.quadrantLabels };
  }

  static get QUADRANTS(): Record<QuadrantType, QuadrantInfo> {
    return EisenhowerMatrix.DEFAULT_QUADRANTS;
  }
}