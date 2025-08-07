# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Build**: `yarn build` - Compiles TypeScript and fixes import paths for ES modules
- **Build CDN**: `yarn build:cdn` - Creates minified browser bundle using Rollup
- **Test**: `yarn test` - Runs Jest test suite
- **Test Watch**: `yarn test:watch` - Runs tests in watch mode
- **Clean**: `yarn clean` - Removes dist directory

## Architecture Overview

This is a TypeScript library for creating and managing Eisenhower Matrix tasks with two main components:

### Core Classes
- **EisenhowerMatrix** (`src/eisenhower-matrix.ts`): Core task management class with CRUD operations
- **DraggableMatrix** (`src/draggable-matrix.ts`): DOM-based draggable interface with storage adapters
- **Types** (`src/types.ts`): Shared type definitions for tasks and quadrants

### Build System
- **Dual Build Process**: 
  - `tsc` for library distribution (ES modules with .d.ts files)
  - `rollup` for browser CDN bundle (IIFE format, minified)
- **Import Fixing**: `fix-imports.js` adds .js extensions to imports for ES module compatibility

### Key Patterns
- Uses ES2020 modules with strict TypeScript configuration
- Task management through Map-based storage for O(1) lookups
- Quadrant-based task categorization (4 types: urgent/important combinations)
- Storage adapter pattern for persistence (LocalStorageAdapter provided)
- Browser-compatible drag-and-drop interface with event handling

### Testing
- Jest with ts-jest for TypeScript support
- Tests located in `tests/` directory
- Coverage collection from `src/` files only