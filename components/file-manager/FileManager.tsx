'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FileExplorer, type FileNode } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { WebContainerPreview, type WebContainerFile } from './WebContainerPreview';
import { 
  Layout, 
  Code, 
  Globe, 
  Settings,
  Zap,
  Save,
  Download,
  Upload,
  Folder,
  RefreshCw,
  Smartphone,
  Monitor
} from 'lucide-react';

interface FileManagerProps {
  onFilesChange?: (files: FileNode[]) => void;
  initialFiles?: FileNode[];
  optimizeForLowEnd?: boolean;
  className?: string;
}

const DEFAULT_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'project',
    type: 'folder',
    path: '/',
    children: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'file',
        path: '/index.html',
        language: 'html',
        size: 2048,
        modified: new Date(),
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapid Prototype</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🚀 Rapid Prototyping Environment</h1>
        <p>Start building your ideas instantly!</p>
        <button onclick="showDemo()">Demo Interaction</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'file',
        path: '/styles.css',
        language: 'css',
        size: 1024,
        modified: new Date(),
        content: `/* Rapid Prototype Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

button:hover {
    background: #5a67d8;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

button:active {
    transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 1.5rem;
        margin: 10px;
    }
    
    h1 {
        font-size: 1.5rem;
    }
    
    p {
        font-size: 1rem;
    }
}

/* Low-end device optimizations */
@media (max-width: 480px) {
    body {
        background: #667eea; /* Simplified gradient for better performance */
    }
    
    .container {
        box-shadow: 0 10px 20px rgba(0,0,0,0.1); /* Reduced shadow complexity */
    }
    
    button {
        box-shadow: 0 2px 10px rgba(102, 126, 234, 0.2); /* Simplified shadow */
    }
    
    button:hover {
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
}`
      },
      {
        id: 'script-js',
        name: 'script.js',
        type: 'file',
        path: '/script.js',
        language: 'javascript',
        size: 512,
        modified: new Date(),
        content: `// Rapid Prototype JavaScript
console.log('🚀 Rapid prototyping environment loaded!');

// Demo function
function showDemo() {
    alert('🎉 Interactive prototype working!\\n\\nFeatures:\\n✅ Live editing\\n✅ Instant preview\\n✅ Multi-device testing\\n✅ Optimized performance');
}

// Performance monitoring for low-end devices
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(\`⚡ Page load time: \${loadTime}ms\`);
            
            // Show performance warning for slow devices
            if (loadTime > 2000) {
                console.log('💡 Consider enabling low-end device optimizations');
            }
        }, 100);
    });
}

// Lazy loading for images and heavy content
document.addEventListener('DOMContentLoaded', () => {
    // Add intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Mobile-friendly touch events
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchStartY - touchY;
    
    // Smooth scrolling for low-end devices
    if (Math.abs(touchDiff) > 5) {
        e.preventDefault();
        window.scrollBy(0, touchDiff * 0.8);
        touchStartY = touchY;
    }
}, { passive: false });

// Memory usage monitoring (for debugging on low-end devices)
if ('memory' in performance) {
    setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
            console.warn('⚠️ High memory usage detected. Consider optimizing.');
        }
    }, 30000);
}`
      },
      {
        id: 'readme-md',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        language: 'markdown',
        size: 256,
        modified: new Date(),
        content: `# 🚀 Rapid Prototyping Environment

A powerful, lightweight development environment optimized for rapid prototyping and low-budget devices.

## Features

- ✅ **Multi-file editing** - Edit HTML, CSS, JS, and more
- ✅ **Live preview** - See changes instantly
- ✅ **WebContainer integration** - Full development environment in browser
- ✅ **Mobile optimized** - Works great on tablets and phones
- ✅ **Performance focused** - Optimized for low-end devices
- ✅ **Responsive design** - Looks great on any screen size

## Quick Start

1. Edit files in the file explorer
2. See changes instantly in the preview
3. Test on different device sizes
4. Deploy when ready!

## Performance Tips

- Enable "Low-end device optimization" for better performance
- Use simple CSS animations on mobile devices
- Minimize JavaScript for faster loading
- Optimize images and assets

Built with ❤️ for rapid prototyping and accessible development.`
      }
    ]
  }
];

type LayoutMode = 'horizontal' | 'vertical' | 'preview-only' | 'editor-only';

export const FileManager: React.FC<FileManagerProps> = ({
  onFilesChange,
  initialFiles = DEFAULT_FILES,
  optimizeForLowEnd = true,
  className = '',
}) => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | undefined>();
  const [layout, setLayout] = useState<LayoutMode>('horizontal');
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Convert file structure to WebContainer format
  const convertToWebContainerFiles = useCallback((fileNodes: FileNode[]): WebContainerFile => {
    const result: WebContainerFile = {};
    
    const processNode = (node: FileNode, parentPath = '') => {
      if (node.type === 'file' && node.content !== undefined) {
        const fileName = node.name;
        result[fileName] = {
          file: {
            contents: node.content
          }
        };
      } else if (node.type === 'folder' && node.children) {
        node.children.forEach(child => processNode(child, `${parentPath}/${node.name}`));
      }
    };
    
    fileNodes.forEach(node => {
      if (node.children) {
        node.children.forEach(child => processNode(child));
      } else {
        processNode(node);
      }
    });
    
    return result;
  }, []);

  const webContainerFiles = convertToWebContainerFiles(files);

  const handleFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
  }, []);

  const handleFileCreate = useCallback((parentPath: string, name: string, type: 'file' | 'folder') => {
    const newFile: FileNode = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      path: `${parentPath}/${name}`,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
      size: 0,
      modified: new Date(),
      language: type === 'file' ? name.split('.').pop() : undefined,
    };

    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === parentPath && node.type === 'folder') {
          return {
            ...node,
            children: [...(node.children || []), newFile]
          };
        } else if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children)
          };
        }
        return node;
      });
    };

    const updatedFiles = parentPath === '/' 
      ? [...files, newFile]
      : updateFiles(files);
    
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  }, [files, onFilesChange]);

  const handleFileDelete = useCallback((fileToDelete: FileNode) => {
    const deleteFile = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === fileToDelete.id) {
          return false;
        }
        if (node.children) {
          node.children = deleteFile(node.children);
        }
        return true;
      });
    };

    const updatedFiles = deleteFile(files);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    
    if (selectedFile?.id === fileToDelete.id) {
      setSelectedFile(undefined);
    }
  }, [files, selectedFile, onFilesChange]);

  const handleFileRename = useCallback((file: FileNode, newName: string) => {
    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === file.id) {
          return {
            ...node,
            name: newName,
            path: node.path.replace(node.name, newName),
            language: node.type === 'file' ? newName.split('.').pop() : undefined,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children)
          };
        }
        return node;
      });
    };

    const updatedFiles = updateFiles(files);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    
    if (selectedFile?.id === file.id) {
      setSelectedFile({
        ...selectedFile,
        name: newName,
        language: newName.split('.').pop(),
      });
    }
  }, [files, selectedFile, onFilesChange]);

  const handleFileUpload = useCallback((fileList: FileList, parentPath: string) => {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileCreate(parentPath, file.name, 'file');
        
        // Update the content after creation
        setTimeout(() => {
          const updateFiles = (nodes: FileNode[]): FileNode[] => {
            return nodes.map(node => {
              if (node.name === file.name && node.type === 'file') {
                return {
                  ...node,
                  content,
                  size: file.size,
                  modified: new Date(file.lastModified),
                };
              }
              if (node.children) {
                return {
                  ...node,
                  children: updateFiles(node.children)
                };
              }
              return node;
            });
          };

          const updatedFiles = updateFiles(files);
          setFiles(updatedFiles);
          onFilesChange?.(updatedFiles);
        }, 100);
      };
      reader.readAsText(file);
    });
  }, [files, onFilesChange, handleFileCreate]);

  const handleContentChange = useCallback((content: string) => {
    if (!selectedFile) return;

    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === selectedFile.id) {
          return {
            ...node,
            content,
            size: content.length,
            modified: new Date(),
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children)
          };
        }
        return node;
      });
    };

    const updatedFiles = updateFiles(files);
    setFiles(updatedFiles);
    setSelectedFile(prev => prev ? { ...prev, content } : undefined);
    
    if (autoSave) {
      onFilesChange?.(updatedFiles);
    }
  }, [selectedFile, files, autoSave, onFilesChange]);

  const handleSave = useCallback(() => {
    onFilesChange?.(files);
    // Show save notification
    console.log('💾 Files saved!');
  }, [files, onFilesChange]);

  const downloadProject = useCallback(() => {
    const projectData = {
      files,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0',
        optimizeForLowEnd,
      }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapid-prototype-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [files, optimizeForLowEnd]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        onFilesChange?.(files);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [files, autoSave, onFilesChange]);

  const getLayoutClass = () => {
    switch (layout) {
      case 'horizontal':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-4';
      case 'vertical':
        return 'flex flex-col gap-4';
      case 'preview-only':
        return 'grid grid-cols-1';
      case 'editor-only':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-4';
      default:
        return 'grid grid-cols-1 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Folder className="text-blue-500" size={20} />
          <h2 className="text-lg font-semibold">Rapid Prototype Studio</h2>
          {optimizeForLowEnd && (
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
              <Zap size={12} className="text-green-600" />
              <span className="text-green-600">Optimized</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Layout Controls */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1">
            <button
              onClick={() => setLayout('horizontal')}
              className={`p-1 rounded ${layout === 'horizontal' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              title="Horizontal Layout"
            >
              <Layout size={14} />
            </button>
            <button
              onClick={() => setLayout('editor-only')}
              className={`p-1 rounded ${layout === 'editor-only' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              title="Editor Focus"
            >
              <Code size={14} />
            </button>
            <button
              onClick={() => setLayout('preview-only')}
              className={`p-1 rounded ${layout === 'preview-only' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              title="Preview Focus"
            >
              <Globe size={14} />
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          
          {/* Action Buttons */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          >
            <Save size={14} />
            Save
          </button>
          
          <button
            onClick={downloadProject}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Download Project"
          >
            <Download size={14} />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 rounded ${showSettings ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className="text-sm">Auto-save</span>
            </label>
            
            <label className="flex items-center gap-2">
              <span className="text-sm">Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            
            <div className="flex items-center gap-2">
              {optimizeForLowEnd ? <Smartphone size={14} /> : <Monitor size={14} />}
              <span className="text-sm">
                {optimizeForLowEnd ? 'Low-end optimized' : 'Standard performance'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 p-4 overflow-hidden ${getLayoutClass()}`}>
        {/* File Explorer */}
        {(layout === 'horizontal' || layout === 'editor-only') && (
          <div className="min-h-0">
            <FileExplorer
              files={files}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
              onFileUpload={handleFileUpload}
              className="h-full"
            />
          </div>
        )}

        {/* Code Editor */}
        {(layout === 'horizontal' || layout === 'editor-only') && (
          <div className="min-h-0">
            <CodeEditor
              file={selectedFile && selectedFile.type === 'file' && selectedFile.content !== undefined ? {
                id: selectedFile.id,
                name: selectedFile.name,
                content: selectedFile.content,
                language: selectedFile.language,
                path: selectedFile.path,
              } : undefined}
              onChange={handleContentChange}
              onSave={handleSave}
              theme={theme}
              optimizeForLowEnd={optimizeForLowEnd}
              className="h-full"
            />
          </div>
        )}

        {/* WebContainer Preview */}
        {(layout === 'horizontal' || layout === 'preview-only') && (
          <div className="min-h-0">
            <WebContainerPreview
              files={webContainerFiles}
              onFilesChange={() => {}}
              optimizeForLowEnd={optimizeForLowEnd}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs">
        <div className="flex items-center gap-4">
          <span>Files: {files.reduce((count, file) => count + (file.children?.length || 1), 0)}</span>
          <span>Selected: {selectedFile?.name || 'None'}</span>
          <span>Layout: {layout}</span>
        </div>
        <div className="flex items-center gap-2">
          {autoSave && <span className="text-green-600">Auto-save enabled</span>}
          {optimizeForLowEnd && <span className="text-blue-600">⚡ Optimized</span>}
          <span>Ready for rapid prototyping</span>
        </div>
      </div>
    </div>
  );
};

export default FileManager;