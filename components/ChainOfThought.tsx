import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Image, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

export interface ReasoningStep {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  timestamp?: string;
  type?: 'thought' | 'search' | 'analysis' | 'conclusion';
  metadata?: {
    searchQuery?: string;
    searchResults?: SearchResult[];
    images?: ImageReference[];
    sources?: string[];
    confidence?: number;
  };
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface ImageReference {
  url: string;
  caption?: string;
  alt?: string;
}

interface ChainOfThoughtProps {
  steps: ReasoningStep[];
  isStreaming?: boolean;
  title?: string;
  className?: string;
}

export function ChainOfThought({ 
  steps, 
  isStreaming = false, 
  title = "Reasoning Steps",
  className = "" 
}: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusIcon = (status: ReasoningStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepTypeIcon = (type?: ReasoningStep['type']) => {
    switch (type) {
      case 'search':
        return <Search className="w-3 h-3 text-blue-500" />;
      case 'analysis':
        return <Image className="w-3 h-3 text-purple-500" />;
      default:
        return null;
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <div className={`border border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {title}
            </span>
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3 animate-pulse" />
                Thinking...
              </div>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {completedSteps}/{totalSteps}
            </span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-blue-700 dark:text-blue-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-700 dark:text-blue-300" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-blue-200 dark:border-blue-700">
          {steps.map((step, index) => (
            <div key={step.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              {/* Step header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {step.title}
                    </span>
                    {getStepTypeIcon(step.type)}
                  </div>
                  {step.timestamp && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-3 h-3 text-gray-400 transition-transform ${
                    expandedSteps.has(step.id) ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Step content */}
              {expandedSteps.has(step.id) && (
                <div className="px-3 pb-3">
                  <div className="pl-6 space-y-3">
                    {/* Main content */}
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {step.content}
                    </div>

                    {/* Search query */}
                    {step.metadata?.searchQuery && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                        <Search className="w-3 h-3 text-blue-500" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium">Search:</span>
                        <span className="text-blue-600 dark:text-blue-400">{step.metadata.searchQuery}</span>
                      </div>
                    )}

                    {/* Search results */}
                    {step.metadata?.searchResults && step.metadata.searchResults.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Search Results:</div>
                        {step.metadata.searchResults.map((result, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {result.title}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">
                                  {result.snippet}
                                </div>
                                <div className="text-gray-500 dark:text-gray-500 mt-1">
                                  {result.source}
                                </div>
                              </div>
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Images */}
                    {step.metadata?.images && step.metadata.images.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Referenced Images:</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {step.metadata.images.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img 
                                src={image.url} 
                                alt={image.alt || `Reference image ${idx + 1}`}
                                className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
                              />
                              {image.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
                                  {image.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {step.metadata?.sources && step.metadata.sources.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Sources:</div>
                        {step.metadata.sources.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {source}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Confidence score */}
                    {typeof step.metadata?.confidence === 'number' && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all duration-300"
                              style={{ width: `${step.metadata.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {Math.round(step.metadata.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="p-3 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4 animate-pulse" />
              Generating reasoning steps...
            </div>
          )}
        </div>
      )}
    </div>
  );
}