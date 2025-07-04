# Eisenhower Matrix Examples

This project includes three different sized examples of the DraggableMatrix component to demonstrate its flexibility:

## 1. Standard Size (client.html)
- **Width**: 1200px
- **Quadrant Height**: 300px minimum
- **Font Size**: 14px
- **Use Case**: Default/standard desktop view

### Features:
- Standard sample tasks
- Balanced proportions for most use cases
- Good for general productivity tracking

## 2. Compact Size (client-compact.html)
- **Width**: 600px
- **Quadrant Height**: 150px minimum
- **Font Size**: 11px
- **Use Case**: Mobile devices, sidebars, embedded widgets

### Features:
- Smaller task cards with minimal padding
- Concise task titles and descriptions
- Perfect for space-constrained environments
- Responsive for smaller screens

## 3. Large Size (client-large.html)
- **Width**: 1600px
- **Quadrant Height**: 500px minimum
- **Font Size**: 16px
- **Use Case**: Large displays, presentations, detailed planning

### Features:
- Spacious layout with generous padding
- Detailed task descriptions
- Large text for better readability
- Ideal for team collaboration and detailed project planning

## Configuration Options

The `DraggableMatrix` constructor accepts a `MatrixSize` object with the following properties:

```typescript
interface MatrixSize {
  width?: string;           // Container max-width
  height?: string;          // Container height
  quadrantMinHeight?: string; // Minimum height for each quadrant
  fontSize?: string;        // Base font size
  padding?: string;         // Padding for container and quadrants
  taskPadding?: string;     // Padding for individual tasks
  titleSize?: string;       // Title font size
}
```

## Usage Example

```javascript
import { DraggableMatrix } from './dist/index.js';

// Compact configuration
const compactSize = {
  width: '600px',
  quadrantMinHeight: '150px',
  fontSize: '11px',
  padding: '10px',
  taskPadding: '6px',
  titleSize: '1.2em'
};

const matrix = new DraggableMatrix('container-id', undefined, compactSize);
```

## Features Common to All Sizes

- Drag and drop functionality
- Local storage persistence
- Double-click to remove tasks
- Programmatic task management API
- Responsive grid layout
- Visual feedback during drag operations