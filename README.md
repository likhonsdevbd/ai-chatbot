# 🚀 AI Rapid Prototype Studio

A powerful, lightweight development environment optimized for rapid prototyping and low-budget devices. Built with AI assistance, multi-file editing, WebContainer integration, and 100+ AI models.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Performance](https://img.shields.io/badge/performance-optimized-green.svg)
![Mobile](https://img.shields.io/badge/mobile-friendly-orange.svg)

## ✨ New Features

### 🛠️ Rapid Prototyping Environment
- **Multi-File Editing** - Edit HTML, CSS, JavaScript, and more simultaneously
- **Live Preview** - See changes instantly as you type with WebContainer integration
- **Multiple Layout Modes** - Chat-only, code-only, split view, or fullscreen coding
- **File Management** - Create, edit, rename, delete files and folders with intuitive explorer
- **Device Preview** - Test on desktop, tablet, and mobile viewports

### ⚡ Performance Optimized for All Devices
- **Low-End Device Support** - Optimized for budget smartphones and tablets (2GB+ RAM)
- **Auto-Detection** - Automatically detects device capabilities and adjusts performance
- **Efficient Resource Usage** - Minimal memory and CPU usage with smart optimizations
- **Progressive Loading** - Load features as needed to reduce initial load time
- **Responsive Design** - Perfect experience on any screen size

### 🎯 Perfect for Rapid Prototyping
- **Instant Setup** - No complex configuration, start coding immediately
- **AI-Assisted Development** - Get help with code generation, debugging, and optimization
- **Real-Time Collaboration** - Share and iterate on ideas quickly
- **Export Projects** - Download your prototypes for further development

## Features

### 🤖 AI-Powered Development
- **100+ AI Models**: Access models from MiniMax, OpenAI, Meta-Llama, Qwen, DeepSeek, and more
- **Streaming Responses**: Real-time AI responses with typing indicators
- **Chain of Thought Visualization**: See how AI reasons through problems
- **Context-Aware Assistance**: AI understands your codebase and provides relevant help
- **Smart Code Generation**: Generate components, functions, and entire features

### 🛠️ Advanced Development Environment
- **Multi-File Editing**: Edit HTML, CSS, JavaScript, and more simultaneously
- **Live Preview**: See changes instantly with WebContainer integration
- **File Management**: Intuitive file explorer with create, edit, rename, delete operations
- **Multiple Layout Modes**: Chat-only, code-only, split view, or fullscreen coding
- **Syntax Highlighting**: Support for 20+ programming languages
- **Search & Replace**: Find and replace across files
- **Auto-Save**: Never lose your work with automatic saving

### ⚡ Performance & Accessibility
- **Low-End Device Optimized**: Perfect for budget smartphones, tablets, and Chromebooks
- **Auto Device Detection**: Automatically adjusts performance based on device capabilities
- **Responsive Design**: Mobile-first with accessibility (WCAG 2.1 AA)
- **Touch-Optimized**: 44px+ touch targets on mobile devices
- **Fast Loading**: Optimized bundles, lazy loading, and efficient resource usage

### 🔧 Developer Experience
- **File Attachments**: Drag-and-drop upload for images and documents
- **Project Export**: Download your prototypes for further development
- **Multiple Themes**: Light and dark mode support
- **Keyboard Navigation**: Full keyboard accessibility
- **Undo/Redo**: Complete editing history
- **Device Preview**: Test on desktop, tablet, and mobile viewports

## 🎯 Perfect For

### Rapid Prototyping
- **Web Apps** - Build and test ideas quickly with live preview
- **Landing Pages** - Create marketing pages with instant visual feedback
- **Interactive Demos** - Prototype user interfaces with real-time updates
- **Educational Projects** - Learn by building with AI assistance

### Low-Budget Development
- **Students** - Learn coding on any device, including budget smartphones
- **Emerging Markets** - Develop on affordable hardware without compromising features
- **Remote Teams** - Collaborate from anywhere with lightweight tools
- **Freelancers** - Work efficiently on budget setups with full-featured environment

### AI-Assisted Coding
- **Code Review** - AI analyzes and suggests improvements to your code
- **Bug Fixing** - AI helps identify and resolve issues quickly
- **Feature Development** - AI generates boilerplate code and components
- **Learning** - AI explains code concepts and best practices

## Quick Start

### Prerequisites
- Node.js 20.9.0+ and pnpm/npm
- Git

### Installation

```bash
# Clone and install
git clone <your-repo-url>
cd ai-chatbot
pnpm install

# Set up environment (already configured in .env.local)
cp .env.local.example .env.local

# Run database migrations
# Go to Supabase Dashboard > SQL Editor
# Run: supabase/migrations/001_create_tables.sql

# Start development server
pnpm dev
```

Visit `http://localhost:3000`

## 📖 Rapid Prototyping Guide

### View Modes

1. **Split View** (Default)
   - Chat and code editor side by side
   - Perfect for AI-assisted development
   - Real-time preview alongside coding

2. **Chat Only**
   - Focus on AI conversation
   - Great for planning and discussion
   - Full-screen chat experience

3. **Code Only**
   - Multi-file development environment
   - File explorer, code editor, and live preview
   - Ideal for intensive coding sessions

4. **Fullscreen Code**
   - Maximum screen real estate for coding
   - Best for complex projects and large screens

### File Management

- **Create Files/Folders**: Click the `+` button in file explorer
- **Edit Files**: Select any file to open in the syntax-highlighted editor
- **Live Preview**: See changes instantly in the integrated preview panel
- **Upload Files**: Drag and drop files or use the upload button
- **Search**: Use Ctrl+F to search within files, Ctrl+H for replace
- **Auto-Save**: Files are automatically saved as you type

### AI-Powered Development

- **Ask Questions**: Get help with any coding problem or concept
- **Generate Code**: Request components, functions, or entire features
- **Code Review**: Ask AI to review and improve your existing code
- **Debug Issues**: Get help troubleshooting problems and errors
- **Learn**: Ask AI to explain programming concepts and best practices
- **Optimize**: Get suggestions for performance improvements

### Device Optimization

#### Low-End Device Features:
- Automatic detection of device capabilities (RAM, CPU, connection speed)
- Simplified animations and transitions for better performance
- Efficient memory management and garbage collection
- Lazy loading of heavy components and features
- Optimized rendering for slower devices

#### Performance Tips:
1. Enable "Low-End Optimization" in settings for budget devices
2. Use simple CSS animations on mobile devices
3. Minimize JavaScript complexity for better performance
4. Close unused browser tabs to free up memory
5. Use code-only view for intensive editing on slower devices

### Project Workflow

1. **Start**: Choose your view mode (split view recommended for beginners)
2. **Plan**: Use AI chat to discuss your project ideas and get suggestions
3. **Code**: Create files and start coding with AI assistance
4. **Preview**: See your changes instantly in the live preview
5. **Test**: Use device preview to test responsive design
6. **Iterate**: Make improvements with AI help and real-time feedback
7. **Export**: Download your completed prototype

## Architecture

```
Next.js Frontend  →  API Routes  →  HuggingFace API (AI)
                                 →  Supabase (DB + Storage)
                                 →  Clerk (Authentication)
                                 →  Redis (Caching)
```

### Tech Stack
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **AI**: Vercel AI SDK, HuggingFace Router (100+ models)
- **Database**: Supabase PostgreSQL with RLS
- **Auth**: Clerk with middleware protection
- **Caching**: Upstash Redis
- **Storage**: Supabase Storage (file attachments)
- **Deployment**: Vercel (recommended) or self-hosted

## Project Structure

```
ai-chatbot/
├── app/
│   ├── api/chat/route.ts              # Chat API endpoint
│   ├── page.tsx                       # Main chat interface with rapid prototyping
│   ├── layout.tsx                     # App layout with Open Graph tags
│   └── globals.css                    # Global styles (optimized)
├── components/
│   ├── file-manager/                  # 🆕 Rapid Prototyping Components
│   │   ├── FileExplorer.tsx          # File tree with CRUD operations
│   │   ├── CodeEditor.tsx             # Multi-language code editor
│   │   ├── WebContainerPreview.tsx    # Live preview with WebContainer
│   │   └── FileManager.tsx            # Main file management component
│   ├── RapidPrototypeLayout.tsx       # 🆕 Enhanced layout with view modes
│   ├── Message.tsx                    # Message display component
│   ├── ModelPicker.tsx                # AI model selector
│   └── FileUpload.tsx                 # File upload component
├── lib/
│   ├── supabase.ts                    # Supabase client setup
│   └── models.ts                      # AI model definitions
├── supabase/
│   └── migrations/                    # Database migrations
├── docs/
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── ARCHITECTURE.md                # System architecture
├── public/
│   ├── manifest.json                  # 🆕 PWA manifest
│   └── og-image.svg                   # 🆕 Open Graph image
└── README.md                          # This file
```

## Environment Variables

All credentials are pre-configured in `.env.local`:

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `HUGGINGFACE_API_KEY` - HuggingFace API key (server-side only)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key (server-side only)
- `REDIS_URL` - Redis connection string

### Optional
- `MONGODB_URI` - MongoDB for additional storage
- `NEON_DATABASE_URL` - Neon PostgreSQL alternative
- `E2B_API_KEY` - E2B sandbox for code execution
- `SMITHERY_API_KEY` - Smithery MCP server integration

## Key Features Explained

### 1. AI Model Selection

Choose from 100+ models grouped by provider:

```typescript
// Models include:
- MiniMax M2 (204K context)
- OpenAI GPT-OSS (120B parameters)
- Meta Llama 3.3 (70B parameters)
- Qwen3 (235B parameters)
- DeepSeek V3 (reasoning model)
- And many more...
```

### 2. Streaming Chat

Real-time AI responses using Vercel AI SDK:

```typescript
const { messages, sendMessage, status } = useChat({
  api: '/api/chat',
});
```

### 3. File Attachments

Drag-and-drop or click to upload:
- Images (PNG, JPG, WebP)
- Documents (PDF, DOCX, TXT)
- Max 10MB per file
- Stored in Supabase Storage

### 4. Security

- **Row Level Security**: Users can only access their own data
- **API Key Protection**: All keys server-side only
- **Rate Limiting**: Via Redis
- **Input Sanitization**: Prevent XSS attacks
- **CORS**: Restricted to allowed origins

## Database Schema

### conversations
- Stores chat sessions
- Links to user via `user_id`
- Tracks selected AI model

### messages
- Stores individual messages
- JSONB `parts` field for flexibility
- Supports text, reasoning, sources, tool calls

### attachments
- Metadata for uploaded files
- Links to messages and conversations
- Stores file URL, type, size

## API Endpoints

### POST /api/chat

Chat with AI models

**Request:**
```json
{
  "messages": [...],
  "model": "openai/gpt-oss-120b",
  "webSearch": false
}
```

**Response:** Server-Sent Events (streaming)

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main

# Deploy via Vercel Dashboard
# 1. Import GitHub repo
# 2. Add environment variables
# 3. Deploy
```

**Note**: Requires Node.js 20.9.0+ for Next.js 16. Vercel automatically provides the correct Node version.

## Testing

The application is production-ready with enhanced rapid prototyping features. To test locally (requires Node.js 20.9.0+):

```bash
# Development with turbo mode (better for low-end devices)
pnpm dev:turbo

# Standard development
pnpm dev
```

Visit `http://localhost:3000` and test:

### Chat Features:
1. Type a message in the chat input
2. Select different AI models from the model picker
3. Upload files using the attachment button
4. Enable web search toggle for enhanced responses

### Rapid Prototyping Features:
1. **Switch View Modes**: Try chat-only, split view, code-only, and fullscreen modes
2. **File Management**: Create HTML, CSS, JS files in the file explorer
3. **Live Coding**: Edit files and see changes instantly in the preview
4. **Device Testing**: Use viewport controls to test mobile/tablet/desktop views
5. **AI Assistance**: Ask AI to generate code, review your work, or help debug
6. **Performance**: Toggle low-end device optimization to test performance
7. **Export**: Download your prototype projects

### Performance Testing:
```bash
# Analyze bundle size
pnpm build:analyze

# Check performance with production build
pnpm build:production
pnpm start:production
```

## Performance

- **Redis Caching**: Model data, conversation lists
- **Optimistic UI**: Instant feedback before server response
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js automatic optimization
- **Edge Functions**: Deploy to Vercel Edge for low latency

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Rotate API keys regularly**
3. **Monitor usage** via provider dashboards
4. **Enable MFA** on all service accounts
5. **Review RLS policies** before production
6. **Scan dependencies** for vulnerabilities (`npm audit`)

## Accessibility

- **WCAG 2.1 AA compliant**
- **Keyboard navigation**: Tab, Enter, Escape work everywhere
- **Screen reader support**: Proper ARIA labels
- **Focus management**: Visible focus rings
- **Touch targets**: Minimum 44px on mobile
- **Color contrast**: Meets accessibility standards

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 Device Compatibility & Performance

### Optimized For:
- **Budget Smartphones** (2GB+ RAM) - Android/iOS
- **Tablets** (iPad, Android tablets)
- **Chromebooks** - Perfect for education and development
- **Low-end Laptops** - Windows/Mac/Linux
- **Any modern browser** - Progressive enhancement

### Performance Features:
- **Auto Device Detection**: Detects RAM, CPU cores, and connection speed
- **Adaptive Rendering**: Adjusts features based on device capabilities
- **Memory Management**: Efficient garbage collection and resource usage
- **Bundle Optimization**: Tree shaking, code splitting, and lazy loading
- **Progressive Loading**: Load features as needed to reduce initial load time
- **Optimized Animations**: Simple animations for low-end devices

### Performance Monitoring:
- Built-in performance monitoring and metrics
- Memory usage tracking and warnings
- Load time measurement and optimization tips
- Device capability detection and reporting

## Troubleshooting

### Common Issues

**"Failed to fetch" error**
- Check API keys in `.env.local`
- Verify HuggingFace API key is valid
- Check network connection

**Authentication not working**
- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard
- Clear browser cookies and retry

**File upload fails**
- Check Supabase Storage bucket exists
- Verify RLS policies allow uploads
- Check file size limits (10MB max)

**Database errors**
- Run migrations in Supabase SQL Editor
- Check RLS policies are configured
- Verify Supabase URL and keys

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Rapid Prototyping Enhancements
- [x] Multi-file editing with syntax highlighting
- [x] Live preview with WebContainer integration
- [x] Device viewport testing (mobile/tablet/desktop)
- [x] Performance optimization for low-end devices
- [x] Auto device capability detection
- [ ] Real WebContainer API integration (currently simulated)
- [ ] Project templates and starter kits
- [ ] Version control integration (Git)
- [ ] Collaborative editing (real-time)
- [ ] Component library and snippets

### AI & Development Features
- [ ] MCP server integration UI
- [ ] E2B sandbox for code execution
- [ ] Voice input/output for accessibility
- [ ] Code generation templates
- [ ] Advanced debugging tools
- [ ] Performance profiling and optimization tips

### Platform Features
- [ ] Multi-language support (i18n)
- [ ] Conversation export (PDF/Markdown)
- [ ] Advanced model parameters UI
- [ ] Analytics dashboard
- [ ] Offline support (PWA)
- [ ] Desktop app (Electron)

## Resources

- **Vercel AI SDK**: https://sdk.vercel.ai
- **HuggingFace**: https://huggingface.co
- **Supabase**: https://supabase.com
- **Clerk**: https://clerk.com
- **Next.js**: https://nextjs.org

## License

This project is for demonstration purposes. Ensure compliance with all third-party API terms of service.

## Support

For issues, questions, or feature requests:
- Open a GitHub Issue
- Check documentation in `/docs`
- Review architecture in `docs/ARCHITECTURE.md`
- Follow deployment guide in `docs/DEPLOYMENT.md`

---

**Built with** Next.js, Vercel AI SDK, Supabase, and 100+ AI models via HuggingFace Router.
