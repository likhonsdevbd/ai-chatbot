'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  Loader2,
  AlertCircle,
  CheckCircle,
  Terminal,
  ExternalLink,
  Settings,
  Zap
} from 'lucide-react';

export interface WebContainerFile {
  [key: string]: {
    file: {
      contents: string;
    };
  } | WebContainerFile;
}

// Type guard to check if an object is a file entry
function isFileEntry(obj: any): obj is { file: { contents: string } } {
  return obj && 
         typeof obj === 'object' && 
         'file' in obj && 
         obj.file && 
         typeof obj.file === 'object' &&
         'contents' in obj.file &&
         typeof obj.file.contents === 'string';
}

interface WebContainerPreviewProps {
  files: WebContainerFile;
  onFilesChange: (files: WebContainerFile) => void;
  className?: string;
  optimizeForLowEnd?: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_SIZES = {
  desktop: { width: '100%', height: '100%', icon: Monitor },
  tablet: { width: '768px', height: '1024px', icon: Tablet },
  mobile: { width: '375px', height: '667px', icon: Smartphone },
};

const DEFAULT_FILES: WebContainerFile = {
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Prototype</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5a67d8;
        }
        .feature-list {
            text-align: left;
            margin: 1.5rem 0;
        }
        .feature-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        .feature-item:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Rapid Prototype Ready!</h1>
        <p>Your development environment is set up and optimized for rapid prototyping.</p>
        
        <div class="feature-list">
            <div class="feature-item">✅ Multi-file editing</div>
            <div class="feature-item">✅ Live preview</div>
            <div class="feature-item">✅ WebContainer integration</div>
            <div class="feature-item">✅ Low-budget device optimized</div>
            <div class="feature-item">✅ Mobile-responsive design</div>
        </div>
        
        <button class="btn" onclick="showAlert()">Test Interaction</button>
        
        <p style="margin-top: 1.5rem; font-size: 14px; color: #666;">
            Modify this code in the editor to see instant changes!
        </p>
    </div>

    <script>
        function showAlert() {
            alert('🎉 Interactive prototype working perfectly!\\n\\nFeatures:\\n- Instant updates\\n- Multi-device preview\\n- Optimized performance');
        }
        
        // Performance monitoring for low-end devices
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    </script>
</body>
</html>`
    }
  },
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'rapid-prototype',
        version: '1.0.0',
        description: 'Rapid prototyping environment',
        main: 'index.html',
        scripts: {
          start: 'echo "Starting preview server..." && python3 -m http.server 3000 || python -m SimpleHTTPServer 3000',
          dev: 'echo "Development mode enabled"'
        },
        dependencies: {},
        devDependencies: {}
      }, null, 2)
    }
  }
};

export const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  files = DEFAULT_FILES,
  onFilesChange,
  className = '',
  optimizeForLowEnd = true,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [showTerminal, setShowTerminal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate WebContainer for demo (in real implementation, this would use @webcontainer/api)
  const createPreviewContent = useCallback(() => {
    const indexFile = files['index.html'];
    if (indexFile && isFileEntry(indexFile)) {
      const blob = new Blob([indexFile.file.contents], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }
    return '';
  }, [files]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  }, []);

  const startPreview = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    addLog('🚀 Starting preview server...');
    
    try {
      // Simulate server startup delay
      await new Promise(resolve => setTimeout(resolve, optimizeForLowEnd ? 500 : 1000));
      
      const url = createPreviewContent();
      setPreviewUrl(url);
      setIsRunning(true);
      addLog('✅ Preview server started successfully');
      addLog(`📱 Preview URL: ${url}`);
      
      if (optimizeForLowEnd) {
        addLog('⚡ Low-end device optimizations enabled');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start preview';
      setError(errorMessage);
      addLog(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [createPreviewContent, optimizeForLowEnd, addLog, isLoading]);

  const stopPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setIsRunning(false);
    addLog('🛑 Preview server stopped');
  }, [previewUrl, addLog]);

  const refreshPreview = useCallback(() => {
    if (isRunning) {
      addLog('🔄 Refreshing preview...');
      const newUrl = createPreviewContent();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newUrl);
      setRefreshKey(prev => prev + 1);
      addLog('✅ Preview refreshed');
    }
  }, [isRunning, createPreviewContent, previewUrl, addLog]);

  // Auto-refresh when files change
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        refreshPreview();
      }, optimizeForLowEnd ? 1000 : 500);
      
      return () => clearTimeout(timer);
    }
  }, [files, isRunning, refreshPreview, optimizeForLowEnd]);

  const currentViewport = VIEWPORT_SIZES[viewport];
  const ViewportIcon = currentViewport.icon;

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Globe className="text-blue-500" size={16} />
          <span className="font-semibold text-sm">Live Preview</span>
          {optimizeForLowEnd && (
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
              <Zap size={12} className="text-green-600" />
              <span className="text-green-600">Optimized</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Viewport Controls */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1">
            {Object.entries(VIEWPORT_SIZES).map(([size, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={size}
                  onClick={() => setViewport(size as ViewportSize)}
                  className={`p-1 rounded ${
                    viewport === size 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title={`${size} view`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* Preview Controls */}
          {!isRunning ? (
            <button
              onClick={startPreview}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-sm"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isLoading ? 'Starting...' : 'Start'}
            </button>
          ) : (
            <>
              <button
                onClick={refreshPreview}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={stopPreview}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                <Square size={14} />
                Stop
              </button>
            </>
          )}
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-1 rounded ${showTerminal ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Toggle Terminal"
          >
            <Terminal size={14} />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {(isLoading || error || isRunning) && (
        <div className={`flex items-center gap-2 px-3 py-2 text-sm border-b border-gray-200 dark:border-gray-700 ${
          error ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
          isRunning ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
          'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        }`}>
          {error ? (
            <AlertCircle size={16} />
          ) : isRunning ? (
            <CheckCircle size={16} />
          ) : (
            <Loader2 size={16} className="animate-spin" />
          )}
          <span>
            {error ? `Error: ${error}` :
             isRunning ? 'Preview running' :
             'Starting preview server...'}
          </span>
          {isRunning && previewUrl && (
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink size={14} />
              <span>Open in new tab</span>
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 overflow-auto">
          {!isRunning ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Monitor size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-2">Click "Start" to begin live preview</p>
              <p className="text-sm">Your code will be instantly reflected here</p>
            </div>
          ) : (
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{
                width: currentViewport.width,
                height: currentViewport.height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                key={refreshKey}
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading={optimizeForLowEnd ? 'lazy' : 'eager'}
              />
            </div>
          )}
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div className="h-48 border-t border-gray-200 dark:border-gray-700 bg-black text-green-400 p-3 overflow-y-auto">
            <div className="font-mono text-sm">
              <div className="mb-2 text-green-300">
                === WebContainer Terminal === {optimizeForLowEnd && '[Low-End Optimized]'}
              </div>
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {isRunning && (
        <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs">
          <div className="flex items-center gap-4">
            <span>Status: Running</span>
            <span>Viewport: {viewport}</span>
            {optimizeForLowEnd && <span className="text-green-600">⚡ Optimized</span>}
          </div>
          <div className="text-gray-500">
            Auto-refresh enabled • Changes reflect instantly
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;