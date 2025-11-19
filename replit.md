# Fullstack React Application

## Overview
This is a modern fullstack JavaScript application with a React frontend and Express backend, successfully migrated from Lovable to Replit. The app features an animated hero section with rotating text tokens displayed over a perspective grid background.

## Project Structure
```
.
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── ui/       # Shadcn UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and query client
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles
│   └── index.html        # HTML template
├── server/               # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── vite.ts          # Vite dev server setup
└── shared/              # Shared types and schemas

```

## Recent Changes
- **November 19, 2025**: Successfully migrated from Lovable to Replit fullstack structure
  - Restructured project to separate client and server directories
  - Replaced React Router with Wouter for routing
  - Removed next-themes dependency (simplified to light theme)
  - Configured Vite to allow all hosts for Replit proxy
  - Added grid-perspective background image for hero animation
  - Set up Express backend with Vite dev server integration

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Express** - Web server
- **TypeScript** - Type safety
- **tsx** - TypeScript execution

## Key Features
- **Hero Animation**: Rotating text tokens with smooth animations
- **Responsive Design**: Mobile-first approach
- **Hot Module Replacement**: Fast development with Vite HMR
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Pre-built Shadcn UI components

## Development

### Running the App
```bash
npm run dev
```
The app will be available on port 5000 with hot reloading enabled.

### Building for Production
```bash
npm run build
npm start
```

### Project Configuration
- **Port**: 5000 (required for Replit webview)
- **Vite**: Configured with `allowedHosts: true` for Replit proxy
- **Path Aliases**: 
  - `@/` → `client/src/`
  - `@shared/` → `shared/`

## User Preferences
None specified yet.

## Current State
✅ Project successfully migrated and running
✅ Hero animation working with 6 rotating tokens
✅ Vite dev server configured for Replit environment
✅ All dependencies installed
✅ Workflow configured and running

## Next Steps
The project is ready for development! You can now:
- Add new pages in `client/src/pages/`
- Create API endpoints in `server/routes.ts`
- Add shared types in `shared/`
- Customize the hero animation tokens in `client/src/components/HeroAnimation.tsx`
- Build out your application features
