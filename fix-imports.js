import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Fix imports in built files to include .js extensions
const distDir = './dist';
const files = ['index.js', 'eisenhower-matrix.js', 'draggable-matrix.js'];

files.forEach(file => {
  const filePath = join(distDir, file);
  let content = readFileSync(filePath, 'utf8');
  
  // Replace imports without .js extension with ones that have .js
  content = content.replace(/from ['"]\.\/([^'"]+)['"]/g, "from './$1.js'");
  
  writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed imports in ${file}`);
});