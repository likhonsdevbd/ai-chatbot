import { MessagePart } from '@/lib/supabase';
import { User, Bot, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ChainOfThought } from './ChainOfThought';

interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  isStreaming?: boolean;
  onCopy?: (text: string) => void;
}

export function Message({ role, parts, isStreaming, onCopy }: MessageProps) {
  const [expandedReasoning, setExpandedReasoning] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onCopy?.(text);
  };

  return (
    <div className={`flex gap-4 p-4 ${role === 'assistant' ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
      <div className="flex-shrink-0">
        {role === 'user' ? (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {parts.map((part, index) => {
          switch (part.type) {
            case 'text':
              return (
                <div key={index} className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap break-words">
                    {part.text}
                    {isStreaming && index === parts.length - 1 && (
                      <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />
                    )}
                  </div>
                  {role === 'assistant' && part.text && (
                    <button
                      onClick={() => handleCopy(part.text!, index)}
                      className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              );

            case 'chain-of-thought':
              return (
                <ChainOfThought
                  key={index}
                  steps={part.reasoningSteps || []}
                  isStreaming={isStreaming && index === parts.length - 1}
                  title="AI Reasoning Process"
                  className="my-2"
                />
              );

            case 'reasoning':
              return (
                <div key={index} className="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedReasoning(expandedReasoning === index ? null : index)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Reasoning Steps {isStreaming && index === parts.length - 1 && '(Thinking...)'}
                    </span>
                    {expandedReasoning === index ? (
                      <ChevronUp className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    )}
                  </button>
                  {expandedReasoning === index && (
                    <div className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {part.text}
                      {isStreaming && index === parts.length - 1 && (
                        <span className="inline-block w-1 h-4 ml-1 bg-blue-400 animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              );

            case 'source-url':
              return (
                <a
                  key={index}
                  href={part.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Source: {part.url}
                </a>
              );

            case 'tool-call':
              return (
                <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Calling tool: {part.name}
                  </div>
                  {part.text && (
                    <pre className="mt-2 text-xs text-purple-600 dark:text-purple-400 overflow-x-auto">
                      {part.text}
                    </pre>
                  )}
                </div>
              );

            case 'tool-result':
              return (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">
                    Tool result:
                  </div>
                  <pre className="mt-2 text-xs text-green-600 dark:text-green-400 overflow-x-auto">
                    {typeof part.result === 'string' ? part.result : JSON.stringify(part.result, null, 2)}
                  </pre>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
