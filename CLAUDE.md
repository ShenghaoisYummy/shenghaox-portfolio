# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack (runs on port 3000/3001)
- `pnpm build` - Build production application (includes Prisma generation)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Operations
- `pnpm push-db` - Push database schema changes to PostgreSQL
- `pnpm generate` - Generate Prisma client (auto-runs on install)
- Database seed: `npx prisma db seed` (uses tsx to run prisma/seed.ts)

### Content Management
- `pnpm count` - Generate blog post statistics (runs scripts/generate-count.js)
- `pnpm watch-blogs` - Watch blog files for changes during development

## Architecture Overview

### Core Stack
- **Frontend**: Next.js 15 (Pages Router) + React 19 + TypeScript + Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Pusher for WebSocket connections
- **AI Integration**: Gemini 2.0 (primary) + OpenAI (fallback) for tech stack extraction

### Project Structure
```
src/
├── pages/           # Next.js Pages Router (index, works, blog, chat, _app, _document)
├── components/      # React components (modals, interactive elements, UI components)
├── services/        # Business logic (GitHub API, LLM tech extraction)
├── utils/           # Helper functions and utilities
├── hooks/           # Custom React hooks
├── contexts/        # React Context providers
├── data/            # Static configuration data
└── blogs/           # Markdown blog posts
```

### Key Features Architecture

#### Tech Stack Display System
- `TechIcon.tsx` - Main icon component with tooltip support
- `techIconMapping.ts` - Comprehensive tech mapping with regex pattern matching for variations
- `CustomTechIcons.tsx` - Custom SVG icons for technologies not in devicon
- Supports 50+ technologies with intelligent fallback patterns

#### Real-time Chat System
- Pusher WebSocket integration for live messaging
- Multi-room chat support with user presence
- Database persistence via PostgreSQL (ChatRoom, Message models)
- API routes: `/api/chat/rooms`, `/api/chat/messages`, `/api/pusher/auth`

#### LLM-Powered Tech Extraction (`llm-techstack.ts`)
- Dual provider system: Gemini 2.0 Flash-Lite (primary) + OpenAI GPT-4.1-nano (fallback)
- Automatically extracts technology stacks from GitHub repository README files
- Caching system to avoid repeated API calls
- Pattern matching for technology normalization

#### Interactive Modals System
- `ImageModal.tsx` - Gallery viewer with danmaku animations
- `MusicModal.tsx` - Audio player with cover art
- `VideoModal.tsx` - Video player with overlay controls
- `CommentModal.tsx` - Real-time commenting interface

#### Blog System
- File-based markdown system in `src/blogs/`
- Gray Matter for frontmatter parsing
- React Syntax Highlighter for code blocks
- Automatic metadata generation and statistics

### Database Schema (Prisma)
- **Comments**: Threaded commenting system with parent/child relationships
- **Reactions**: Five types of emoji reactions (like, cheer, celebrate, appreciate, smile)
- **ChatRooms**: Multi-room chat functionality
- **Messages**: Real-time chat message persistence

### Environment Configuration
Required environment variables:
- `DATABASE_URL` / `DIRECT_URL` - PostgreSQL connection
- `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` - Real-time features
- `GITHUB_TOKEN` - GitHub API access (optional, for higher rate limits)
- `OPENAI_API_KEY` - OpenAI API for tech extraction fallback
- `GEMINI_API_KEY` - Google Gemini API for primary tech extraction

### Build & Deployment
- Optimized for Vercel deployment
- Turbopack for fast development builds
- Automatic Prisma client generation on build
- Static generation for blog and portfolio pages
- Remote image optimization for GitHub content

### Development Notes
- React Strict Mode is disabled (`reactStrictMode: false`)
- Uses pnpm as package manager
- Supports hot reloading with file watchers for blog content
- TypeScript strict mode enabled throughout
- ESLint configured with Next.js rules