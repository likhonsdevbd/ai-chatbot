// AI Model definitions from HuggingFace
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  status: 'live' | 'offline';
  inputPrice?: number;
  outputPrice?: number;
  contextLength?: number;
  quality?: number;
  latency?: number;
  streaming: boolean;
  visionSupport: boolean;
}

// Parse model data from the provided list
export const AI_MODELS: AIModel[] = [
  {
    id: 'MiniMaxAI/MiniMax-M2',
    name: 'MiniMax M2',
    provider: 'MiniMax',
    status: 'live',
    inputPrice: 0.3,
    outputPrice: 1.2,
    contextLength: 204800,
    quality: 1.30,
    latency: 44,
    streaming: false,
    visionSupport: false
  },
  {
    id: 'openai/gpt-oss-safeguard-20b',
    name: 'GPT OSS Safeguard 20B',
    provider: 'OpenAI',
    status: 'live',
    contextLength: 131072,
    quality: 0.19,
    latency: 817,
    streaming: true,
    visionSupport: false
  },
  {
    id: 'zai-org/GLM-4.6',
    name: 'GLM 4.6',
    provider: 'ZhipuAI',
    status: 'live',
    inputPrice: 0.6,
    outputPrice: 2.2,
    contextLength: 204800,
    quality: 0.72,
    latency: 33,
    streaming: true,
    visionSupport: false
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT OSS 20B',
    provider: 'OpenAI',
    status: 'live',
    inputPrice: 0.05,
    outputPrice: 0.2,
    contextLength: 131072,
    quality: 0.36,
    latency: 48,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen3-VL-8B-Instruct',
    name: 'Qwen3 VL 8B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 0.08,
    outputPrice: 0.5,
    contextLength: 131072,
    quality: 0.77,
    latency: 41,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT OSS 120B',
    provider: 'OpenAI',
    status: 'live',
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextLength: 131072,
    quality: 0.43,
    latency: 112,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'meta-llama/Llama-3.1-8B-Instruct',
    name: 'Llama 3.1 8B Instruct',
    provider: 'Meta',
    status: 'live',
    inputPrice: 0.03,
    outputPrice: 0.09,
    contextLength: 131072,
    quality: 0.39,
    latency: 161,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'deepseek-ai/DeepSeek-V3.2-Exp',
    name: 'DeepSeek V3.2 Exp',
    provider: 'DeepSeek',
    status: 'live',
    inputPrice: 0.2,
    outputPrice: 0.2,
    contextLength: 32768,
    quality: 0.21,
    latency: 190,
    streaming: false,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen3-VL-30B-A3B-Instruct',
    name: 'Qwen3 VL 30B A3B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 0.2,
    outputPrice: 0.7,
    contextLength: 131072,
    quality: 0.72,
    latency: 77,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'HuggingFaceTB/SmolLM3-3B',
    name: 'SmolLM3 3B',
    provider: 'HuggingFace',
    status: 'live',
    quality: 0.22,
    latency: 87,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'moonshotai/Kimi-K2-Instruct-0905',
    name: 'Kimi K2 Instruct',
    provider: 'Moonshot',
    status: 'live',
    inputPrice: 0.6,
    outputPrice: 2.5,
    contextLength: 262144,
    quality: 0.51,
    latency: 45,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen3-Coder-30B-A3B-Instruct',
    name: 'Qwen3 Coder 30B A3B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextLength: 262144,
    quality: 0.90,
    latency: 102,
    streaming: true,
    visionSupport: false
  },
  {
    id: 'meta-llama/Meta-Llama-3-8B-Instruct',
    name: 'Llama 3 8B Instruct',
    provider: 'Meta',
    status: 'live',
    inputPrice: 0.04,
    outputPrice: 0.04,
    contextLength: 8192,
    quality: 0.77,
    latency: 68,
    streaming: false,
    visionSupport: false
  },
  {
    id: 'Qwen/Qwen3-Next-80B-A3B-Instruct',
    name: 'Qwen3 Next 80B A3B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 0.15,
    outputPrice: 1.5,
    contextLength: 262144,
    quality: 0.61,
    latency: 130,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'deepseek-ai/DeepSeek-R1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    status: 'live',
    inputPrice: 3,
    outputPrice: 7,
    contextLength: 163840,
    quality: 0.68,
    latency: 40,
    streaming: false,
    visionSupport: false
  },
  {
    id: 'meta-llama/Llama-3.3-70B-Instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    status: 'live',
    inputPrice: 0.88,
    outputPrice: 0.88,
    contextLength: 131072,
    quality: 0.51,
    latency: 107,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen3-Coder-480B-A35B-Instruct',
    name: 'Qwen3 Coder 480B A35B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 2,
    outputPrice: 2,
    contextLength: 262144,
    quality: 0.66,
    latency: 34,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'deepseek-ai/DeepSeek-V3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    status: 'live',
    inputPrice: 1.25,
    outputPrice: 1.25,
    contextLength: 131072,
    quality: 0.53,
    latency: 38,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen2.5-72B-Instruct',
    name: 'Qwen2.5 72B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 1.2,
    outputPrice: 1.2,
    contextLength: 131072,
    quality: 0.42,
    latency: 84,
    streaming: true,
    visionSupport: true
  },
  {
    id: 'Qwen/Qwen3-235B-A22B-Instruct-2507',
    name: 'Qwen3 235B A22B Instruct',
    provider: 'Qwen',
    status: 'live',
    inputPrice: 0.2,
    outputPrice: 0.6,
    contextLength: 262144,
    quality: 0.59,
    latency: 44,
    streaming: true,
    visionSupport: true
  }
];

// Group models by provider
export const getModelsByProvider = () => {
  const grouped: Record<string, AIModel[]> = {};
  
  AI_MODELS.forEach(model => {
    if (!grouped[model.provider]) {
      grouped[model.provider] = [];
    }
    grouped[model.provider].push(model);
  });
  
  return grouped;
};

// Get model by ID
export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id);
};

// Get recommended models (high quality, low latency, live status)
export const getRecommendedModels = (): AIModel[] => {
  return AI_MODELS
    .filter(model => model.status === 'live')
    .filter(model => model.quality && model.quality > 0.5)
    .filter(model => model.latency && model.latency < 100)
    .sort((a, b) => (b.quality || 0) - (a.quality || 0))
    .slice(0, 5);
};
