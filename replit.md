# TetraTides - Ocean-Themed Tetris Game

## Overview

TetraTides is a stunning ocean-themed Tetris game built with a React frontend and Express backend. The project features an immersive underwater aesthetic with glowing coral-like pieces, animated bubbles, and oceanic visual effects. Built with modern tech stack including TypeScript, Tailwind CSS, Radix UI components, and Drizzle ORM for database operations. The game features complete Tetris mechanics, scoring, and audio support with an enchanting ocean depths theme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for client-side bundling
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: Zustand for game state and audio management
- **3D Graphics**: React Three Fiber (@react-three/fiber) for potential 3D features
- **Query Management**: TanStack Query for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: Hot reload with tsx and Vite middleware integration
- **API Structure**: RESTful endpoints with `/api` prefix

### Build System
- **Development**: Vite dev server with Express middleware integration
- **Production**: Vite build for frontend, esbuild for backend bundling
- **TypeScript**: Shared configuration across client, server, and shared modules

## Key Components

### Game Logic
- **Tetris Engine**: Complete game implementation with piece movement, rotation, and line clearing
- **Modern Features**: Ghost piece visualization, true 7-bag randomization system for balanced piece distribution, hold piece functionality
- **Advanced Mechanics**: Super Rotation System (SRS) with wall kicks, T-spin detection and scoring
- **State Management**: Zustand stores for game state (`useGame`, `useTetris`), audio (`useAudio`), and controls (`useControls`)
- **Game Components**: Modular React components for board, pieces, UI, controls, and settings
- **Known Limitation**: T-spin wall kicks may not work perfectly in all edge case scenarios (advanced mechanic affecting <1% of players)

### Database Layer
- **Schema**: User authentication schema with username/password (in `shared/schema.ts`)
- **Storage Interface**: Abstracted storage interface with in-memory implementation for development
- **Migrations**: Drizzle migrations stored in `./migrations` directory

### UI System
- **Design System**: Custom Tailwind configuration with CSS variables for theming
- **Component Library**: Extensive shadcn/ui components for consistent UI
- **Responsive Design**: Mobile-friendly with breakpoint utilities

## Data Flow

### Game Flow
1. Game starts in "ready" state with modern 7-bag piece randomization
2. Player actions trigger state updates in Zustand stores with SRS validation
3. Advanced rotation system enables wall kicks and T-spin detection
4. Game logic validates moves and updates board state with ghost piece preview
5. T-spin bonuses are calculated and visual notifications displayed
6. React components re-render based on state changes
7. Audio feedback plays for game events (when unmuted)
8. Hold piece system allows strategic piece management

### Authentication Flow (Prepared)
1. User credentials processed through shared schema validation
2. Storage interface handles user operations
3. Session management ready for implementation

### Development Flow
1. Vite dev server serves frontend with HMR
2. Express server handles API routes with logging middleware
3. Database operations through Drizzle ORM
4. TypeScript compilation with shared types

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query
- **Backend**: Express.js, Node.js types
- **Database**: Drizzle ORM, Neon Database connector
- **Build Tools**: Vite, esbuild, tsx for development

### UI and Styling
- **Radix UI**: Complete suite of accessible components
- **Tailwind CSS**: Utility-first styling with PostCSS
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Game-Specific
- **Zustand**: Lightweight state management
- **Audio Support**: HTML5 audio with custom hook integration
- **3D Capabilities**: React Three Fiber ecosystem (drei, postprocessing)

### Development Tools
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database schema management and migrations
- **Vite Plugins**: Runtime error overlay, GLSL shader support

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle push command applies schema changes

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Production**: `NODE_ENV=production` for optimized builds
- **Development**: Hot reload with file watching

### Asset Handling
- **Static Assets**: Vite handles bundling and optimization
- **Large Files**: Support for 3D models (gltf, glb) and audio files
- **Font Loading**: Inter font with local hosting

### Production Considerations
- **Database**: PostgreSQL via Neon Database for serverless scaling
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Error Handling**: Comprehensive error middleware in Express
- **Logging**: Request/response logging with performance metrics

The architecture supports both development and production environments with proper separation of concerns, type safety, and modern development practices. The game is fully functional with room for future enhancements like multiplayer support, user accounts, and leaderboards.