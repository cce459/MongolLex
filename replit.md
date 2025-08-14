# Overview

This is a Mongolian-Korean-English multilingual dictionary web application built with a full-stack TypeScript architecture. The application allows users to search, browse, and view dictionary entries that contain Traditional Mongolian script, Cyrillic Mongolian, Korean, and English translations with examples and pronunciation guides.

The application features both search functionality and alphabetical browsing, with support for switching between Traditional Mongolian and Cyrillic scripts. It's designed to help users learn and reference Mongolian vocabulary with comprehensive multilingual support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Font Support**: Noto Sans Mongolian for Traditional Mongolian script rendering

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured endpoints for dictionary operations
- **Development**: Hot module replacement via Vite integration in development mode
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle ORM with Zod schema validation
- **Connection**: Neon Database serverless PostgreSQL adapter
- **Schema**: Single dictionary entries table with JSONB for examples array
- **Development Storage**: In-memory storage with seeded sample data

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express sessions configured with PostgreSQL session store (connect-pg-simple)
- **Architecture**: Session-based authentication infrastructure prepared but not active

### API Structure
The REST API provides the following endpoints:
- `GET /api/dictionary/search?q={query}&limit={limit}` - Search dictionary entries
- `GET /api/dictionary/letter/{letter}?script={traditional|cyrillic}` - Browse by first letter
- `GET /api/dictionary/{id}` - Get single dictionary entry
- `GET /api/dictionary` - Get all dictionary entries

### Component Architecture
- **Search Components**: Real-time search with debounced queries and suggestion dropdown
- **Navigation Components**: Alphabet-based browsing with script type switching
- **Display Components**: Multilingual entry display with pronunciation and examples
- **UI Components**: Comprehensive shadcn/ui component library with custom styling

### Development Workflow
- **Hot Reloading**: Vite development server with HMR
- **Database Management**: Drizzle Kit for schema migrations and database operations
- **Build Process**: Separate client (Vite) and server (esbuild) build processes
- **Error Handling**: Runtime error overlay in development environment

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **PostgreSQL**: Primary database engine for structured dictionary data storage

### UI and Styling Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for UI elements and interactive components

### Development and Build Tools
- **Vite**: Frontend build tool with TypeScript support and plugin ecosystem
- **TanStack Query**: Server state management and caching solution
- **Zod**: Schema validation for API data and database operations
- **Wouter**: Lightweight routing library for single-page application navigation

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Fonts and Internationalization
- **Google Fonts**: Inter font family for Latin text
- **Noto Sans Mongolian**: Specialized font for Traditional Mongolian script rendering