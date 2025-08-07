import { EisenhowerMatrix } from './eisenhower-matrix';
import { QuadrantType, CustomQuadrantLabels } from './types';

export interface StorageAdapter {
  save(data: any): Promise<void>;
  load(): Promise<any>;
}

export class LocalStorageAdapter implements StorageAdapter {
  private key: string;

  constructor(key: string = 'eisenhower-matrix') {
    this.key = key;
  }

  async save(data: any): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async load(): Promise<any> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }
}

export interface MatrixSize {
  width?: string;
  height?: string;
  quadrantMinHeight?: string;
  fontSize?: string;
  padding?: string;
  taskPadding?: string;
  titleSize?: string;
}

export class DraggableMatrix {
  private matrix: EisenhowerMatrix;
  private storageAdapter: StorageAdapter;
  private container: HTMLElement;
  private size: MatrixSize;

  constructor(containerId: string, storageAdapter: StorageAdapter = new LocalStorageAdapter(), size: MatrixSize = {}, customLabels?: CustomQuadrantLabels) {
    this.matrix = new EisenhowerMatrix(customLabels);
    this.storageAdapter = storageAdapter;
    this.size = {
      width: '1200px',
      height: 'auto',
      quadrantMinHeight: '300px',
      fontSize: '14px',
      padding: '20px',
      taskPadding: '12px',
      titleSize: '2em',
      ...size
    };
    
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }
    this.container = container;
    
    this.init();
  }

  private init(): void {
    this.injectCSS();
    this.createHTML();
    this.setupEventListeners();
    this.loadData();
    this.loadSampleTasks();
  }

  private injectCSS(): void {
    const style = document.createElement('style');
    style.textContent = `
      .eisenhower-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: ${this.size.width};
        margin: 0 auto;
        padding: ${this.size.padding};
        background-color: #f5f5f5;
        font-size: ${this.size.fontSize};
      }
      
      .eisenhower-title {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
        font-size: ${this.size.titleSize};
      }
      
      .eisenhower-matrix {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 30px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        overflow: visible;
        position: relative;
        height: ${this.size.height};
      }
      
      .eisenhower-quadrant {
        min-height: ${this.size.quadrantMinHeight};
        max-height: 600px;
        padding: ${this.size.padding};
        border: 1px solid #e0e0e0;
        position: relative;
        background: #fafafa;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .eisenhower-quadrant.drag-over {
        background-color: #e8f5e8;
        border-color: #4CAF50;
      }
      
      .eisenhower-quadrant-header {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 2px solid #ddd;
      }
      
      .eisenhower-quadrant-strategy {
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
        font-style: italic;
      }
      
      .eisenhower-tasks-container {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .eisenhower-quadrant.urgent-important {
        background: linear-gradient(135deg, #ffebee, #ffcdd2);
      }
      
      .eisenhower-quadrant.not-urgent-important {
        background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
      }
      
      .eisenhower-quadrant.urgent-not-important {
        background: linear-gradient(135deg, #fff3e0, #ffe0b2);
      }
      
      .eisenhower-quadrant.not-urgent-not-important {
        background: linear-gradient(135deg, #f3e5f5, #e1bee7);
      }
      
      .eisenhower-task {
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: ${this.size.taskPadding};
        margin-bottom: 10px;
        cursor: move;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
      }
      
      .eisenhower-task:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transform: translateY(-2px);
      }
      
      .eisenhower-task.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
      }
      
      .eisenhower-task-title {
        font-weight: 600;
        margin-bottom: 5px;
        color: #333;
      }
      
      .eisenhower-task-description {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
      }
      
      .eisenhower-axis-labels {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      
      .eisenhower-urgent-label, .eisenhower-important-label {
        position: absolute;
        font-weight: bold;
        color: #666;
        font-size: 14px;
      }
      
      .eisenhower-urgent-label {
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
      }
      
      .eisenhower-important-label {
        left: -80px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
        transform-origin: center;
      }
    `;
    document.head.appendChild(style);
  }

  private createHTML(): void {
    const quadrants = this.matrix.getAllQuadrantInfo();
    
    this.container.innerHTML = `
      <div class="eisenhower-container">
        <h1 class="eisenhower-title">Eisenhower Matrix</h1>
        <div class="eisenhower-matrix">
          <div class="eisenhower-axis-labels">
            <div class="eisenhower-urgent-label">URGENT →</div>
            <div class="eisenhower-important-label">IMPORTANT ↑</div>
          </div>
          
          <div class="eisenhower-quadrant urgent-important" data-quadrant="urgent_important">
            <div class="eisenhower-quadrant-header">${quadrants[QuadrantType.URGENT_IMPORTANT].name}</div>
            <div class="eisenhower-quadrant-strategy">${quadrants[QuadrantType.URGENT_IMPORTANT].actionStrategy}</div>
            <div class="eisenhower-tasks-container"></div>
          </div>
          
          <div class="eisenhower-quadrant not-urgent-important" data-quadrant="not_urgent_important">
            <div class="eisenhower-quadrant-header">${quadrants[QuadrantType.NOT_URGENT_IMPORTANT].name}</div>
            <div class="eisenhower-quadrant-strategy">${quadrants[QuadrantType.NOT_URGENT_IMPORTANT].actionStrategy}</div>
            <div class="eisenhower-tasks-container"></div>
          </div>
          
          <div class="eisenhower-quadrant urgent-not-important" data-quadrant="urgent_not_important">
            <div class="eisenhower-quadrant-header">${quadrants[QuadrantType.URGENT_NOT_IMPORTANT].name}</div>
            <div class="eisenhower-quadrant-strategy">${quadrants[QuadrantType.URGENT_NOT_IMPORTANT].actionStrategy}</div>
            <div class="eisenhower-tasks-container"></div>
          </div>
          
          <div class="eisenhower-quadrant not-urgent-not-important" data-quadrant="not_urgent_not_important">
            <div class="eisenhower-quadrant-header">${quadrants[QuadrantType.NOT_URGENT_NOT_IMPORTANT].name}</div>
            <div class="eisenhower-quadrant-strategy">${quadrants[QuadrantType.NOT_URGENT_NOT_IMPORTANT].actionStrategy}</div>
            <div class="eisenhower-tasks-container"></div>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const quadrants = this.container.querySelectorAll('.eisenhower-quadrant');
    
    quadrants.forEach(quadrant => {
      quadrant.addEventListener('dragover', this.handleDragOver.bind(this));
      quadrant.addEventListener('drop', this.handleDrop.bind(this));
      quadrant.addEventListener('dragleave', this.handleDragLeave.bind(this));
    });
  }

  private handleDragOver(e: Event): void {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();
    (dragEvent.currentTarget as HTMLElement).classList.add('drag-over');
  }

  private handleDragLeave(e: Event): void {
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  private handleDrop(e: Event): void {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();
    const taskId = dragEvent.dataTransfer?.getData('text/plain');
    const quadrant = (dragEvent.currentTarget as HTMLElement).dataset.quadrant;
    
    (dragEvent.currentTarget as HTMLElement).classList.remove('drag-over');
    
    if (taskId && quadrant) {
      this.moveTask(taskId, quadrant as QuadrantType);
    }
  }

  private moveTask(taskId: string, newQuadrant: QuadrantType): void {
    const task = this.matrix.updateTask(taskId, { quadrant: newQuadrant });
    if (task) {
      this.render();
      this.saveData();
    }
  }

  private async loadData(): Promise<void> {
    try {
      const data = await this.storageAdapter.load();
      if (data && data.tasks) {
        this.matrix.clear();
        data.tasks.forEach((task: any) => {
          this.matrix.addTask(task.title, task.description, task.quadrant, task.id);
        });
        this.render();
      }
    } catch (error) {
      console.warn('Failed to load data:', error);
    }
  }

  private async saveData(): Promise<void> {
    try {
      const data = {
        tasks: this.matrix.getAllTasks(),
        timestamp: new Date().toISOString()
      };
      await this.storageAdapter.save(data);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private render(): void {
    const matrixData = this.matrix.getMatrix();
    
    Object.entries(matrixData).forEach(([quadrant, tasks]: [string, any[]]) => {
      const container = this.container.querySelector(`[data-quadrant="${quadrant}"] .eisenhower-tasks-container`);
      if (container) {
        container.innerHTML = '';
        
        tasks.forEach(task => {
          const taskElement = this.createTaskElement(task);
          container.appendChild(taskElement);
        });
      }
    });
  }

  private createTaskElement(task: any): HTMLElement {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'eisenhower-task';
    taskDiv.draggable = true;
    taskDiv.dataset.taskId = task.id;
    
    taskDiv.innerHTML = `
      <div class="eisenhower-task-title">${task.title}</div>
      <div class="eisenhower-task-description">${task.description || ''}</div>
    `;
    
    taskDiv.addEventListener('dragstart', (e: DragEvent) => {
      e.dataTransfer?.setData('text/plain', task.id);
      taskDiv.classList.add('dragging');
    });
    
    taskDiv.addEventListener('dragend', () => {
      taskDiv.classList.remove('dragging');
    });
    
    taskDiv.addEventListener('dblclick', () => {
      if (confirm('Remove this task?')) {
        this.removeTask(task.id);
      }
    });
    
    return taskDiv;
  }

  private loadSampleTasks(): void {
    if (this.matrix.getTaskCount() === 0) {
      this.matrix.addTask('Fix production bug', 'Critical system error affecting all users', QuadrantType.URGENT_IMPORTANT);
      this.matrix.addTask('Plan quarterly goals', 'Set strategic objectives for next quarter', QuadrantType.NOT_URGENT_IMPORTANT);
      this.matrix.addTask('Respond to emails', 'Answer routine correspondence', QuadrantType.URGENT_NOT_IMPORTANT);
      this.matrix.addTask('Browse social media', 'Check latest posts and updates', QuadrantType.NOT_URGENT_NOT_IMPORTANT);
      this.render();
    }
  }

  // Public API
  public addTask(title: string, description: string, quadrant: QuadrantType): void {
    this.matrix.addTask(title, description, quadrant);
    this.render();
    this.saveData();
  }

  public removeTask(taskId: string): void {
    if (this.matrix.removeTask(taskId)) {
      this.render();
      this.saveData();
    }
  }

  public getTasks(): any[] {
    return this.matrix.getAllTasks();
  }

  public getTasksByQuadrant(quadrant: QuadrantType): any[] {
    return this.matrix.getTasksByQuadrant(quadrant);
  }

  public clear(): void {
    this.matrix.clear();
    this.render();
    this.saveData();
  }
}