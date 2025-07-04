import { Task, QuadrantType, QuadrantInfo } from './types';

export class EisenhowerMatrix {
  private tasks: Map<string, Task> = new Map();

  static readonly QUADRANTS: Record<QuadrantType, QuadrantInfo> = {
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
}