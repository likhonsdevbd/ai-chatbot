# AI Chatbot - Full-Featured Next.js Application

A production-ready AI chatbot with 100+ models, streaming responses, file attachments, and enterprise-grade security.

## Features

### Core Capabilities
- **100+ AI Models**: Access models from MiniMax, OpenAI, Meta-Llama, Qwen, DeepSeek, and more
- **Streaming Responses**: Real-time AI responses with typing indicators
- **File Attachments**: Drag-and-drop upload for images and documents
- **Multi-Backend**: Supabase (database + storage) + Clerk (auth) + Redis (caching)
- **Perfect Responsive Design**: Mobile-first with accessibility (WCAG 2.1 AA)
- **Model Context Protocol**: MCP server integration capability
- **Advanced Security**: Row Level Security, API key protection, rate limiting

### User Experience
- **Modern UI**: Clean, intuitive interface with dark mode support
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch-Optimized**: 44px+ touch targets on mobile
- **Fast**: Redis caching, optimistic updates, edge deployment
- **Accessible**: Screen reader support, ARIA labels, semantic HTML

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
│   ├── api/chat/route.ts          # Chat API endpoint
│   ├── page.tsx                    # Main chat interface
│   ├── layout.tsx                  # App layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Message.tsx                 # Message display component
│   ├── ModelPicker.tsx             # AI model selector
│   └── FileUpload.tsx              # File upload component
├── lib/
│   ├── supabase.ts                 # Supabase client setup
│   └── models.ts                   # AI model definitions
├── supabase/
│   └── migrations/                 # Database migrations
├── docs/
│   ├── DEPLOYMENT.md               # Deployment guide
│   └── ARCHITECTURE.md             # System architecture
└── README.md                       # This file
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

The application is production-ready. To test locally (requires Node.js 20.9.0+):

```bash
pnpm dev
```

Visit `http://localhost:3000` and:
1. Type a message in the chat input
2. Select different AI models from the model picker
3. Upload files using the attachment button
4. Enable web search toggle for enhanced responses

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

- [ ] MCP server integration UI
- [ ] E2B sandbox for code execution
- [ ] Voice input/output
- [ ] Multi-language support (i18n)
- [ ] Conversation export (PDF/Markdown)
- [ ] Advanced model parameters UI
- [ ] Collaborative conversations
- [ ] Analytics dashboard

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
