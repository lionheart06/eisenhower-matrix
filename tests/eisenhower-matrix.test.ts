import { EisenhowerMatrix, QuadrantType } from '../src';

describe('EisenhowerMatrix', () => {
  let matrix: EisenhowerMatrix;

  beforeEach(() => {
    matrix = new EisenhowerMatrix();
  });

  describe('addTask', () => {
    it('should add a task successfully', () => {
      const task = matrix.addTask('Test Task', 'Test Description', QuadrantType.URGENT_IMPORTANT);
      
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.quadrant).toBe(QuadrantType.URGENT_IMPORTANT);
      expect(task.isCompleted).toBe(false);
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('should use provided ID when given', () => {
      const customId = 'custom-123';
      const task = matrix.addTask('Test', 'Desc', QuadrantType.URGENT_IMPORTANT, customId);
      
      expect(task.id).toBe(customId);
    });
  });

  describe('getTask', () => {
    it('should retrieve a task by ID', () => {
      const task = matrix.addTask('Test Task', 'Description', QuadrantType.URGENT_IMPORTANT);
      const retrieved = matrix.getTask(task.id);
      
      expect(retrieved).toEqual(task);
    });

    it('should return null for non-existent ID', () => {
      const retrieved = matrix.getTask('non-existent');
      expect(retrieved).toBeNull();
    });
  });

  describe('completeTask', () => {
    it('should mark a task as completed', () => {
      const task = matrix.addTask('Test Task', 'Description', QuadrantType.URGENT_IMPORTANT);
      const completedTask = matrix.completeTask(task.id);
      
      expect(completedTask?.isCompleted).toBe(true);
      expect(completedTask?.completedAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent task', () => {
      const result = matrix.completeTask('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('getTasksByQuadrant', () => {
    it('should return tasks filtered by quadrant', () => {
      matrix.addTask('Urgent Important', 'Desc', QuadrantType.URGENT_IMPORTANT);
      matrix.addTask('Not Urgent Important', 'Desc', QuadrantType.NOT_URGENT_IMPORTANT);
      
      const urgentImportant = matrix.getTasksByQuadrant(QuadrantType.URGENT_IMPORTANT);
      const notUrgentImportant = matrix.getTasksByQuadrant(QuadrantType.NOT_URGENT_IMPORTANT);
      
      expect(urgentImportant).toHaveLength(1);
      expect(notUrgentImportant).toHaveLength(1);
      expect(urgentImportant[0].title).toBe('Urgent Important');
    });
  });

  describe('getMatrix', () => {
    it('should return all tasks organized by quadrant', () => {
      matrix.addTask('Task 1', 'Desc', QuadrantType.URGENT_IMPORTANT);
      matrix.addTask('Task 2', 'Desc', QuadrantType.NOT_URGENT_IMPORTANT);
      
      const matrixData = matrix.getMatrix();
      
      expect(matrixData[QuadrantType.URGENT_IMPORTANT]).toHaveLength(1);
      expect(matrixData[QuadrantType.NOT_URGENT_IMPORTANT]).toHaveLength(1);
      expect(matrixData[QuadrantType.URGENT_NOT_IMPORTANT]).toHaveLength(0);
      expect(matrixData[QuadrantType.NOT_URGENT_NOT_IMPORTANT]).toHaveLength(0);
    });
  });

  describe('removeTask', () => {
    it('should remove a task successfully', () => {
      const task = matrix.addTask('Test Task', 'Description', QuadrantType.URGENT_IMPORTANT);
      const removed = matrix.removeTask(task.id);
      
      expect(removed).toBe(true);
      expect(matrix.getTask(task.id)).toBeNull();
    });

    it('should return false for non-existent task', () => {
      const removed = matrix.removeTask('non-existent');
      expect(removed).toBe(false);
    });
  });
});