import { AIModel } from '@/lib/models';
import { Search, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

interface ModelPickerProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  models: AIModel[];
}

export function ModelPicker({ selectedModel, onSelectModel, models }: ModelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedModelData = models.find(m => m.id === selectedModel);
  
  const filteredModels = models.filter(model => 
    model.status === 'live' &&
    (model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     model.provider.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedModels = filteredModels.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-medium">{selectedModelData?.name || 'Select Model'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {Object.entries(groupedModels).map(([provider, providerModels]) => (
                <div key={provider} className="p-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {provider}
                  </div>
                  {providerModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model.id);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{model.name}</span>
                        <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {model.contextLength && (
                            <span>{(model.contextLength / 1024).toFixed(0)}K ctx</span>
                          )}
                          {model.latency && (
                            <span>{model.latency}ms</span>
                          )}
                          {model.visionSupport && (
                            <span className="text-blue-500">Vision</span>
                          )}
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
