// Example usage of the Eisenhower Matrix module
import { EisenhowerMatrix, QuadrantType } from './dist/index.js';

// Create a new matrix instance
const matrix = new EisenhowerMatrix();

console.log('=== Eisenhower Matrix Example ===\n');

// Add some sample tasks
console.log('Adding tasks...');
const task1 = matrix.addTask(
  'Fix production bug',
  'Critical system error affecting all users',
  QuadrantType.URGENT_IMPORTANT
);

const task2 = matrix.addTask(
  'Plan quarterly goals',
  'Set strategic objectives for next quarter',
  QuadrantType.NOT_URGENT_IMPORTANT
);

const task3 = matrix.addTask(
  'Respond to non-critical emails',
  'Answer routine correspondence',
  QuadrantType.URGENT_NOT_IMPORTANT
);

const task4 = matrix.addTask(
  'Browse social media',
  'Check latest posts and updates',
  QuadrantType.NOT_URGENT_NOT_IMPORTANT
);

console.log(`Added ${matrix.getTaskCount()} tasks\n`);

// Display the matrix
console.log('Current Matrix:');
const fullMatrix = matrix.getMatrix();

Object.entries(EisenhowerMatrix.QUADRANTS).forEach(([key, info]) => {
  const tasks = fullMatrix[key];
  console.log(`\n${info.name} (${info.description}):`);
  console.log(`Strategy: ${info.actionStrategy}`);
  
  if (tasks.length === 0) {
    console.log('  No tasks');
  } else {
    tasks.forEach(task => {
      console.log(`  - ${task.title}: ${task.description}`);
    });
  }
});

// Complete a task
console.log('\nCompleting the production bug fix...');
matrix.completeTask(task1.id);

console.log(`\nCompleted tasks: ${matrix.getCompletedTasks().length}`);
console.log(`Pending tasks: ${matrix.getPendingTasks().length}`);

console.log('\n=== Example Complete ===');