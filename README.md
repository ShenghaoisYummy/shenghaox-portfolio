# ShenghaoX Personal Website

A modern, interactive personal portfolio website built with Next.js, featuring a responsive design, real-time chat functionality, and dynamic content management.

## ✨ Features

### Core Features

- **Responsive Design**: Fully responsive layout optimized for desktop and mobile devices
- **Dark/Light Theme**: Dynamic theme switching with smooth transitions
- **Interactive Homepage**: Typewriter animation, GitHub contribution heatmap, and interactive tags
- **Portfolio Showcase**: Dedicated works page to display projects and achievements
- **Blog System**: Markdown-based blog with syntax highlighting and dynamic content
- **Real-time Chat**: Live chat room with Pusher integration for instant messaging
- **Comment System**: Interactive commenting with emoji reactions and real-time updates

### Interactive Elements

- **Modal Components**: Image gallery, music player, and video modals
- **Danmaku Animation**: Floating text animations for enhanced user engagement
- **SVG Icons**: Custom icon system with theme-aware color schemes
- **Loading Animations**: Smooth loading transitions and visual feedback

### Technical Features

- **Database Integration**: PostgreSQL with Prisma ORM for data management
- **API Routes**: RESTful API endpoints for comments, reactions, and chat functionality
- **Real-time Updates**: Pusher integration for live chat and notifications
- **Content Management**: File-based blog system with automatic metadata generation
- **TypeScript**: Full TypeScript support for type safety and better development experience

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Syntax Highlighter** - Code syntax highlighting

### Backend & Database

- **Prisma** - Modern database toolkit and ORM
- **PostgreSQL** - Relational database
- **Pusher** - Real-time WebSocket service
- **Next.js API Routes** - Serverless API endpoints

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development
- **Gray Matter** - Frontmatter parser for blog posts
- **Chokidar** - File watching for development

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShenghaoisYummy/shenghaox-portfilio.git
   cd template-web
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   DIRECT_URL="postgresql://username:password@localhost:5432/database"
   NEXT_PUBLIC_PUSHER_APP_KEY="your_pusher_app_key"
   PUSHER_APP_ID="your_pusher_app_id"
   PUSHER_SECRET="your_pusher_secret"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
   ```

4. **Set up the database**

   ```bash
   pnpm push-db
   pnpm generate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 📝 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm count` - Generate blog post statistics
- `pnpm watch-blogs` - Watch blog files for changes
- `pnpm push-db` - Push database schema changes
- `pnpm generate` - Generate Prisma client

## 📁 Project Structure

```
   public/                 # Static assets
      images/            # Images and photos
      svgs/              # SVG icons
      ci/                # CI-related assets
   src/
      components/        # Reusable React components
      contexts/          # React context providers
      data/              # Static data configurations
      lib/               # Utility libraries
      pages/             # Next.js pages and API routes
      styles/            # Global styles
      utils/             # Utility functions
   prisma/                # Database schema and migrations
   scripts/               # Build and utility scripts
   service/               # API service layer
   blogs/                 # Markdown blog posts
```

## 🧩 Key Components

### Interactive Modals

- **ImageModal**: Gallery viewer with danmaku animations
- **MusicModal**: Audio player with cover art and controls
- **VideoModal**: Video player with overlay features
- **CommentModal**: Real-time commenting interface

### UI Components

- **GitHubHeatmap**: Contribution visualization
- **ThemeToggle**: Dark/light mode switcher
- **SvgIcon**: Dynamic icon rendering system
- **LoadingAnimation**: Smooth loading transitions

### Features

- **Real-time Chat**: Multi-room chat with user presence
- **Blog System**: Markdown rendering with syntax highlighting
- **Portfolio Display**: Project showcase with filtering
- **Comment System**: Threaded comments with reactions

## 🗃 Database Schema

The application uses PostgreSQL with the following main entities:

- **Comments**: User comments with threading support
- **Reactions**: Emoji reactions (like, cheer, celebrate, appreciate, smile)
- **ChatRooms**: Chat room management
- **Messages**: Real-time chat messages

## 🌐 API Endpoints

- `GET/POST /api/comments` - Comment management
- `GET/POST /api/reactions` - Reaction tracking
- `GET/POST /api/chat/rooms` - Chat room operations
- `GET/POST /api/chat/messages` - Message handling
- `GET /api/blogs` - Blog post listing
- `GET /api/blog-stats` - Blog statistics

## 🚢 Deployment

The application is optimized for deployment on Vercel with the following configuration:

- Automatic builds on push to main branch
- Environment variables configured in Vercel dashboard
- PostgreSQL database hosted on your preferred provider
- Pusher service for real-time features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Pusher for real-time infrastructure
- Tailwind CSS for the utility-first approach
- All contributors and users of this project
# shenghaox-portfilio
# shenghaox-portfilio
# shenghaox-portfilio
# shenghaox-portfilio
# shenghaox-portfilio
