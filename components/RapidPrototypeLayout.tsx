'use client';

import React, { useState, useCallback } from 'react';
import { 
  Code, 
  MessageSquare, 
  Layout, 
  Zap,
  Settings,
  Smartphone,
  Monitor,
  SplitSquareHorizontal,
  FullscreenIcon
} from 'lucide-react';
import FileManager from './file-manager/FileManager';

interface RapidPrototypeLayoutProps {
  children: React.ReactNode;
  className?: string;
}

type ViewMode = 'chat' | 'code' | 'split' | 'fullscreen-code';

export const RapidPrototypeLayout: React.FC<RapidPrototypeLayoutProps> = ({
  children,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [optimizeForLowEnd, setOptimizeForLowEnd] = useState(() => {
    // Auto-detect low-end devices
    if (typeof window !== 'undefined') {
      const isLowEnd = 
        /Android.*Chrome\/[.0-9]* Mobile/i.test(navigator.userAgent) ||
        /iPhone|iPad/i.test(navigator.userAgent) ||
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).connection?.effectiveType === 'slow-2g' ||
        (navigator as any).connection?.effectiveType === '2g';
      return isLowEnd;
    }
    return false;
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleFilesChange = useCallback((files: any[]) => {
    // Handle file changes for integration with chat
    console.log('Files updated:', files.length);
  }, []);

  const getViewModeConfig = () => {
    switch (viewMode) {
      case 'chat':
        return {
          showChat: true,
          showCode: false,
          chatClass: 'w-full',
          codeClass: 'hidden',
        };
      case 'code':
        return {
          showChat: false,
          showCode: true,
          chatClass: 'hidden',
          codeClass: 'w-full',
        };
      case 'split':
        return {
          showChat: true,
          showCode: true,
          chatClass: 'w-1/2',
          codeClass: 'w-1/2',
        };
      case 'fullscreen-code':
        return {
          showChat: false,
          showCode: true,
          chatClass: 'hidden',
          codeClass: 'w-full h-screen',
        };
      default:
        return {
          showChat: true,
          showCode: true,
          chatClass: 'w-1/2',
          codeClass: 'w-1/2',
        };
    }
  };

  const config = getViewModeConfig();

  return (
    <div className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Rapid Prototype Studio
            </h1>
          </div>
          
          {optimizeForLowEnd && (
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs">
              <Smartphone size={12} className="text-green-600" />
              <span className="text-green-600 font-medium">Optimized</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Controls */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('chat')}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                viewMode === 'chat' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Chat Only"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Chat</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                viewMode === 'split' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Split View"
            >
              <SplitSquareHorizontal size={14} />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                viewMode === 'code' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Code Editor"
            >
              <Code size={14} />
              <span className="hidden sm:inline">Code</span>
            </button>
            <button
              onClick={() => setViewMode('fullscreen-code')}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                viewMode === 'fullscreen-code' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Fullscreen Code"
            >
              <FullscreenIcon size={14} />
            </button>
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          
          {/* Performance Toggle */}
          <button
            onClick={() => setOptimizeForLowEnd(!optimizeForLowEnd)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
              optimizeForLowEnd 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Toggle Low-End Device Optimization"
          >
            {optimizeForLowEnd ? <Smartphone size={14} /> : <Monitor size={14} />}
            <span className="hidden md:inline">
              {optimizeForLowEnd ? 'Low-End' : 'Standard'}
            </span>
          </button>
          
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${
              showSettings 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">🚀 Rapid Prototyping</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Multi-file editing with live preview</li>
                <li>• WebContainer integration</li>
                <li>• Instant AI assistance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">⚡ Performance</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Auto-detects device capabilities</li>
                <li>• Optimized for low-budget devices</li>
                <li>• Efficient resource usage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Smart Features</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Context-aware AI assistance</li>
                <li>• Code generation & review</li>
                <li>• Multiple device preview</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        {config.showChat && (
          <div className={`${config.chatClass} flex flex-col border-r border-gray-200 dark:border-gray-700`}>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        )}

        {/* Code Editor Section */}
        {config.showCode && (
          <div className={`${config.codeClass} flex flex-col bg-gray-50 dark:bg-gray-900`}>
            <FileManager
              onFilesChange={handleFilesChange}
              optimizeForLowEnd={optimizeForLowEnd}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ready for rapid prototyping
          </span>
          <span>View: {viewMode}</span>
          {optimizeForLowEnd && (
            <span className="text-green-600 font-medium">⚡ Performance optimized</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>🚀 AI Rapid Prototype Studio</span>
          <span className="text-gray-500">Perfect for low-budget devices</span>
        </div>
      </div>
    </div>
  );
};

export default RapidPrototypeLayout;