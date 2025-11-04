import { useState, useEffect, useCallback } from 'react';
import { getSmitheryClient, SmitheryProject, SmitheryChat, SmitheryMessage } from '@/lib/smithery';

export interface UseSmitheryOptions {
  autoSync?: boolean;
  projectId?: string;
  chatId?: string;
}

export function useSmithery(options: UseSmitheryOptions = {}) {
  const [client] = useState(() => {
    try {
      return getSmitheryClient();
    } catch (error) {
      console.warn('Smithery client not available:', error);
      return null;
    }
  });

  const [projects, setProjects] = useState<SmitheryProject[]>([]);
  const [currentProject, setCurrentProject] = useState<SmitheryProject | null>(null);
  const [chats, setChats] = useState<SmitheryChat[]>([]);
  const [currentChat, setCurrentChat] = useState<SmitheryChat | null>(null);
  const [messages, setMessages] = useState<SmitheryMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = useCallback(async () => {
    if (!client) return;
    
    try {
      setLoading(true);
      setError(null);
      const projectData = await client.getProjects();
      setProjects(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Load chats for a project
  const loadChats = useCallback(async (projectId?: string) => {
    if (!client) return;
    
    try {
      setLoading(true);
      setError(null);
      const chatData = await client.getChats(projectId);
      setChats(chatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Load messages for a chat
  const loadMessages = useCallback(async (chatId: string) => {
    if (!client) return;
    
    try {
      setLoading(true);
      setError(null);
      const messageData = await client.getChatMessages(chatId);
      setMessages(messageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Create a new project
  const createProject = useCallback(async (data: {
    name: string;
    description?: string;
    environment_variables?: Record<string, string>;
  }) => {
    if (!client) throw new Error('Smithery client not available');
    
    try {
      setLoading(true);
      setError(null);
      const project = await client.createProject(data);
      setProjects(prev => [...prev, project]);
      return project;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Create a new chat
  const createChat = useCallback(async (data: {
    name: string;
    project_id?: string;
  }) => {
    if (!client) throw new Error('Smithery client not available');
    
    try {
      setLoading(true);
      setError(null);
      const chat = await client.createChat(data);
      setChats(prev => [...prev, chat]);
      return chat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Send a message
  const sendMessage = useCallback(async (
    chatId: string, 
    content: string, 
    metadata?: Record<string, any>
  ) => {
    if (!client) throw new Error('Smithery client not available');
    
    try {
      setError(null);
      const message = await client.sendMessage(chatId, { content, metadata });
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [client]);

  // Update current project
  const selectProject = useCallback(async (projectId: string) => {
    if (!client) return;
    
    try {
      setLoading(true);
      setError(null);
      const project = await client.getProject(projectId);
      setCurrentProject(project);
      
      // Auto-load chats for the selected project
      if (options.autoSync) {
        await loadChats(projectId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select project');
    } finally {
      setLoading(false);
    }
  }, [client, options.autoSync, loadChats]);

  // Update current chat
  const selectChat = useCallback(async (chatId: string) => {
    if (!client) return;
    
    try {
      setLoading(true);
      setError(null);
      const chat = await client.getChat(chatId);
      setCurrentChat(chat);
      
      // Auto-load messages for the selected chat
      if (options.autoSync) {
        await loadMessages(chatId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select chat');
    } finally {
      setLoading(false);
    }
  }, [client, options.autoSync, loadMessages]);

  // Favorite/unfavorite a chat
  const toggleFavorite = useCallback(async (chatId: string, favorite: boolean) => {
    if (!client) throw new Error('Smithery client not available');
    
    try {
      const updatedChat = await client.favoriteChat(chatId, favorite);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? updatedChat : chat
      ));
      if (currentChat?.id === chatId) {
        setCurrentChat(updatedChat);
      }
      return updatedChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update favorite status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [client, currentChat]);

  // Fork a chat
  const forkChat = useCallback(async (chatId: string, name?: string) => {
    if (!client) throw new Error('Smithery client not available');
    
    try {
      setLoading(true);
      setError(null);
      const newChat = await client.forkChat(chatId, name);
      setChats(prev => [...prev, newChat]);
      return newChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fork chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Initialize data on mount
  useEffect(() => {
    if (!client || !options.autoSync) return;

    loadProjects();
  }, [client, options.autoSync, loadProjects]);

  // Auto-select project if provided
  useEffect(() => {
    if (options.projectId && client && !currentProject) {
      selectProject(options.projectId);
    }
  }, [options.projectId, client, currentProject, selectProject]);

  // Auto-select chat if provided
  useEffect(() => {
    if (options.chatId && client && !currentChat) {
      selectChat(options.chatId);
    }
  }, [options.chatId, client, currentChat, selectChat]);

  return {
    // State
    projects,
    currentProject,
    chats,
    currentChat,
    messages,
    loading,
    error,
    
    // Actions
    loadProjects,
    loadChats,
    loadMessages,
    createProject,
    createChat,
    sendMessage,
    selectProject,
    selectChat,
    toggleFavorite,
    forkChat,
    
    // Utilities
    isAvailable: !!client,
    client,
  };
}