'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Loader2, Globe, Plus, Menu, Star, Copy, Settings, Zap } from 'lucide-react';
import { AI_MODELS } from '@/lib/models';
import { ModelPicker } from '@/components/ModelPicker';
import { Message } from '@/components/Message';
import { FileUpload } from '@/components/FileUpload';
import { useSmithery } from '@/hooks/useSmithery';

interface FileAttachment {
  file: File;
  preview?: string;
  type: string;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState(AI_MODELS[5].id); // Default to GPT OSS 120B
  const [webSearch, setWebSearch] = useState(false);
  const [reasoningEnabled, setReasoningEnabled] = useState(true);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Smithery integration
  const smithery = useSmithery({ 
    autoSync: true 
  });

  const { messages, append, status, error, reload } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      // Sync with Smithery if available
      if (smithery.isAvailable && smithery.currentChat) {
        try {
          await smithery.sendMessage(
            smithery.currentChat.id, 
            message.content,
            { 
              model, 
              webSearch, 
              reasoning: reasoningEnabled,
              timestamp: new Date().toISOString()
            }
          );
        } catch (error) {
          console.warn('Failed to sync with Smithery:', error);
        }
      }
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && attachments.length === 0) return;

    // Prepare files for upload
    const files = attachments.length > 0 
      ? attachments.map(a => a.file)
      : undefined;

    // Send message
    await append(
      { 
        role: 'user',
        content: input || 'Sent with attachments',
        // files
      },
      {
        body: {
          model,
          webSearch,
          reasoning: reasoningEnabled,
          smithery: {
            enabled: smithery.isAvailable,
            projectId: smithery.currentProject?.id,
            chatId: smithery.currentChat?.id,
          }
        },
      }
    );

    // Clear input and attachments
    setInput('');
    setAttachments([]);
    setShowFileUpload(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const newAttachments = files.map(file => ({
      file,
      type: file.type,
      preview: file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : undefined
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (index: number) => {
    const attachment = attachments[index];
    if (attachment.preview) {
      URL.revokeObjectURL(attachment.preview);
    }
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleNewChat = async () => {
    if (smithery.isAvailable) {
      try {
        const chat = await smithery.createChat({
          name: `Chat ${new Date().toLocaleString()}`,
          project_id: smithery.currentProject?.id,
        });
        await smithery.selectChat(chat.id);
      } catch (error) {
        console.error('Failed to create new chat:', error);
      }
    }
    // Clear local messages would need to be implemented in useChat
  };

  const handleProjectChange = async (projectId: string) => {
    if (smithery.isAvailable) {
      await smithery.selectProject(projectId);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar - Conversation History & Projects */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        fixed md:relative z-20 
        w-64 h-full bg-gray-50 dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        transition-transform duration-300 ease-in-out
      `}>
        {/* Smithery Project Selector */}
        {smithery.isAvailable && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <select
              value={smithery.currentProject?.id || ''}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project</option>
              {smithery.projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {smithery.isAvailable && smithery.chats.length > 0 ? (
            smithery.chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => smithery.selectChat(chat.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-colors
                  ${smithery.currentChat?.id === chat.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {chat.name}
                  </span>
                  {chat.is_favorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {smithery.isAvailable 
                ? 'No chats yet. Create your first chat!'
                : 'Previous conversations will appear here'
              }
            </div>
          )}
        </div>

        {/* Smithery Status */}
        {smithery.isAvailable && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Smithery Connected
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {smithery.currentChat?.name || 'AI Chatbot'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Chain of Thought Toggle */}
            <button
              onClick={() => setReasoningEnabled(!reasoningEnabled)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${reasoningEnabled 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
              title="Toggle Chain of Thought reasoning"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Reasoning</span>
            </button>

            {/* Web Search Toggle */}
            <button
              onClick={() => setWebSearch(!webSearch)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${webSearch 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Search</span>
            </button>

            <ModelPicker
              selectedModel={model}
              onSelectModel={setModel}
              models={AI_MODELS.filter(m => m.status === 'live')}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to AI Chatbot
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose from 100+ AI models and start chatting. Features include:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      Chain of Thought
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      See detailed reasoning with search results, images, and step-by-step analysis
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-semibold mb-1">Multiple Models</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Access 100+ AI models from various providers
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-semibold mb-1">File Attachments</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Upload images and documents for AI analysis
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-semibold mb-1">Web Search</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Get answers with real-time web search and citations
                    </div>
                  </div>
                  {smithery.isAvailable && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-1 sm:col-span-2">
                      <div className="font-semibold mb-1 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Smithery Integration
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Project management, chat persistence, and rich MCP interfaces enabled
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role as 'user' | 'assistant'}
                  parts={message.parts as any}
                  isStreaming={status === 'streaming' && message.id === messages[messages.length - 1]?.id}
                />
              ))}
              {status === 'submitted' && (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
              {error && (
                <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-red-700 dark:text-red-300 font-semibold mb-1">Error</div>
                  <div className="text-red-600 dark:text-red-400 text-sm">{error.message}</div>
                  <button
                    onClick={() => reload()}
                    className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {showFileUpload && (
              <div className="mb-4">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  attachments={attachments}
                  onRemoveAttachment={handleRemoveAttachment}
                />
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  disabled={status === 'streaming' || status === 'submitted'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none max-h-32"
                  rows={1}
                />
                <button
                  type="button"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Attach files"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={(!input.trim() && attachments.length === 0) || status === 'streaming' || status === 'submitted'}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {status === 'streaming' || status === 'submitted' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {AI_MODELS.find(m => m.id === model)?.name} 
              {reasoningEnabled && <span className="text-purple-500"> • Chain of Thought Enabled</span>}
              {webSearch && <span className="text-green-500"> • Web Search Enabled</span>}
              <span className="block sm:inline sm:ml-2">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}