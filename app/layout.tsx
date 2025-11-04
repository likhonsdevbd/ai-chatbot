import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Chatbot - Advanced Chain of Thought | 100+ Models',
  description: 'Advanced AI chatbot with Chain of Thought visualization, Smithery API integration, streaming responses, and 100+ model support. Experience transparent AI reasoning with step-by-step visualization.',
  keywords: ['AI chatbot', 'Chain of Thought', 'AI reasoning', 'Smithery', 'OpenAI', 'HuggingFace', 'AI visualization', 'transparent AI'],
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'MiniMax',
  robots: 'index, follow',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-chatbot-likhonsdevbd.vercel.app',
    siteName: 'AI Chatbot with Chain of Thought',
    title: 'AI Chatbot - Advanced Chain of Thought Visualization',
    description: 'Experience the future of AI interaction with transparent reasoning visualization. Our advanced chatbot shows you how AI thinks step-by-step, integrates with Smithery API, and supports 100+ models.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Chatbot with Chain of Thought Visualization',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@minimax',
    creator: '@minimax',
    title: 'AI Chatbot - Advanced Chain of Thought Visualization',
    description: 'Experience transparent AI reasoning with step-by-step visualization. 100+ models, Smithery integration, and advanced features.',
    images: ['/og-image.png'],
  },
  
  // Additional metadata
  alternates: {
    canonical: 'https://ai-chatbot-likhonsdevbd.vercel.app',
  },
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Chatbot',
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Theme color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  
  // Viewport
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
