/**
 * Smithery API Client for project and chat management
 * Integrates with the Model Context Protocol (MCP) for rich UI experiences
 */

export interface SmitheryProject {
  id: string;
  name: string;
  description?: string;
  chat_id?: string;
  created_at: string;
  updated_at: string;
  environment_variables?: Record<string, string>;
}

export interface SmitheryChat {
  id: string;
  name: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
  messages_count?: number;
}

export interface SmitheryMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SmitheryDeployment {
  id: string;
  project_id: string;
  version: string;
  status: 'pending' | 'building' | 'ready' | 'error';
  url?: string;
  created_at: string;
  logs?: string[];
  errors?: string[];
}

class SmitheryAPIClient {
  private baseURL = 'https://api.smithery.ai';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Smithery API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Project Management
  async createProject(data: {
    name: string;
    description?: string;
    environment_variables?: Record<string, string>;
  }): Promise<SmitheryProject> {
    return this.request<SmitheryProject>('/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjects(): Promise<SmitheryProject[]> {
    return this.request<SmitheryProject[]>('/v1/projects');
  }

  async getProject(id: string): Promise<SmitheryProject> {
    return this.request<SmitheryProject>(`/v1/projects/${id}`);
  }

  async updateProject(id: string, data: Partial<SmitheryProject>): Promise<SmitheryProject> {
    return this.request<SmitheryProject>(`/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/v1/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async assignProjectToChat(projectId: string, chatId: string): Promise<SmitheryProject> {
    return this.request<SmitheryProject>(`/v1/projects/${projectId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ chat_id: chatId }),
    });
  }

  // Environment Variables
  async createEnvironmentVariable(
    projectId: string, 
    key: string, 
    value: string
  ): Promise<void> {
    await this.request(`/v1/projects/${projectId}/env`, {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  async getEnvironmentVariables(projectId: string): Promise<Record<string, string>> {
    return this.request<Record<string, string>>(`/v1/projects/${projectId}/env`);
  }

  async updateEnvironmentVariable(
    projectId: string, 
    key: string, 
    value: string
  ): Promise<void> {
    await this.request(`/v1/projects/${projectId}/env/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async deleteEnvironmentVariable(projectId: string, key: string): Promise<void> {
    await this.request(`/v1/projects/${projectId}/env/${key}`, {
      method: 'DELETE',
    });
  }

  // Chat Management
  async createChat(data: {
    name: string;
    project_id?: string;
  }): Promise<SmitheryChat> {
    return this.request<SmitheryChat>('/v1/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChats(projectId?: string): Promise<SmitheryChat[]> {
    const endpoint = projectId ? `/v1/chats?project_id=${projectId}` : '/v1/chats';
    return this.request<SmitheryChat[]>(endpoint);
  }

  async getChat(id: string): Promise<SmitheryChat> {
    return this.request<SmitheryChat>(`/v1/chats/${id}`);
  }

  async updateChat(id: string, data: Partial<SmitheryChat>): Promise<SmitheryChat> {
    return this.request<SmitheryChat>(`/v1/chats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChat(id: string): Promise<void> {
    await this.request(`/v1/chats/${id}`, {
      method: 'DELETE',
    });
  }

  async favoriteChat(id: string, favorite: boolean = true): Promise<SmitheryChat> {
    return this.request<SmitheryChat>(`/v1/chats/${id}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ favorite }),
    });
  }

  async forkChat(id: string, name?: string): Promise<SmitheryChat> {
    return this.request<SmitheryChat>(`/v1/chats/${id}/fork`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async initializeChat(id: string): Promise<SmitheryChat> {
    return this.request<SmitheryChat>(`/v1/chats/${id}/initialize`, {
      method: 'POST',
    });
  }

  // Message Management
  async sendMessage(chatId: string, data: {
    content: string;
    role?: 'user' | 'assistant' | 'system';
    metadata?: Record<string, any>;
  }): Promise<SmitheryMessage> {
    return this.request<SmitheryMessage>(`/v1/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        role: 'user',
        ...data,
      }),
    });
  }

  async getChatMessages(chatId: string): Promise<SmitheryMessage[]> {
    return this.request<SmitheryMessage[]>(`/v1/chats/${chatId}/messages`);
  }

  async getMessage(chatId: string, messageId: string): Promise<SmitheryMessage> {
    return this.request<SmitheryMessage>(`/v1/chats/${chatId}/messages/${messageId}`);
  }

  async resumeMessage(chatId: string, messageId: string): Promise<SmitheryMessage> {
    return this.request<SmitheryMessage>(`/v1/chats/${chatId}/messages/${messageId}/resume`, {
      method: 'POST',
    });
  }

  // Deployment Management
  async createDeployment(projectId: string, data: {
    version?: string;
    files?: Record<string, string>;
  }): Promise<SmitheryDeployment> {
    return this.request<SmitheryDeployment>(`/v1/projects/${projectId}/deployments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDeployments(projectId: string): Promise<SmitheryDeployment[]> {
    return this.request<SmitheryDeployment[]>(`/v1/projects/${projectId}/deployments`);
  }

  async getDeployment(deploymentId: string): Promise<SmitheryDeployment> {
    return this.request<SmitheryDeployment>(`/v1/deployments/${deploymentId}`);
  }

  async deleteDeployment(deploymentId: string): Promise<void> {
    await this.request(`/v1/deployments/${deploymentId}`, {
      method: 'DELETE',
    });
  }

  async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    return this.request<string[]>(`/v1/deployments/${deploymentId}/logs`);
  }

  async getDeploymentErrors(deploymentId: string): Promise<string[]> {
    return this.request<string[]>(`/v1/deployments/${deploymentId}/errors`);
  }

  // User and Billing
  async getUser(): Promise<any> {
    return this.request('/v1/user');
  }

  async getBilling(): Promise<any> {
    return this.request('/v1/user/billing');
  }

  async getPlan(): Promise<any> {
    return this.request('/v1/user/plan');
  }

  async getUserScopes(): Promise<string[]> {
    return this.request<string[]>('/v1/user/scopes');
  }

  // Reports
  async getUsageReport(period?: string): Promise<any> {
    const endpoint = period ? `/v1/reports/usage?period=${period}` : '/v1/reports/usage';
    return this.request(endpoint);
  }

  // Vercel Integration
  async createVercelProject(data: {
    name: string;
    framework?: string;
    repository_url?: string;
  }): Promise<any> {
    return this.request('/v1/integrations/vercel/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVercelProjects(): Promise<any[]> {
    return this.request<any[]>('/v1/integrations/vercel/projects');
  }

  // Hooks Management
  async createHook(data: {
    name: string;
    url: string;
    events: string[];
    secret?: string;
  }): Promise<any> {
    return this.request('/v1/hooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getHooks(): Promise<any[]> {
    return this.request<any[]>('/v1/hooks');
  }

  async getHook(id: string): Promise<any> {
    return this.request(`/v1/hooks/${id}`);
  }

  async updateHook(id: string, data: Partial<any>): Promise<any> {
    return this.request(`/v1/hooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHook(id: string): Promise<void> {
    await this.request(`/v1/hooks/${id}`, {
      method: 'DELETE',
    });
  }

  // Rate Limits
  async getRateLimit(): Promise<any> {
    return this.request('/v1/rate-limit');
  }
}

// Singleton instance
let smitheryClient: SmitheryAPIClient | null = null;

export function getSmitheryClient(): SmitheryAPIClient {
  if (!smitheryClient) {
    const apiKey = process.env.SMITHERY_API_KEY || process.env.NEXT_PUBLIC_SMITHERY_API_KEY;
    if (!apiKey) {
      throw new Error('Smithery API key not found. Please set SMITHERY_API_KEY environment variable.');
    }
    smitheryClient = new SmitheryAPIClient(apiKey);
  }
  return smitheryClient;
}

export { SmitheryAPIClient };