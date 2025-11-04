'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Save, 
  Undo, 
  Redo, 
  Search, 
  Replace, 
  Settings,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Type,
  Zap,
  Download,
  Copy,
  Check
} from 'lucide-react';

interface CodeEditorProps {
  file?: {
    id: string;
    name: string;
    content: string;
    language?: string;
    path: string;
  };
  onChange: (content: string) => void;
  onSave: () => void;
  className?: string;
  theme?: 'light' | 'dark';
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  minimap?: boolean;
  optimizeForLowEnd?: boolean;
}

const LANGUAGE_MAPPINGS: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  html: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  sh: 'bash',
  rs: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  php: 'php',
  rb: 'ruby',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
};

const THEMES = {
  light: {
    background: '#ffffff',
    foreground: '#24292e',
    selection: '#0366d625',
    lineNumber: '#586069',
    border: '#e1e4e8',
    keyword: '#d73a49',
    string: '#032f62',
    comment: '#6a737d',
    function: '#6f42c1',
  },
  dark: {
    background: '#1a1a1a',
    foreground: '#e1e1e1',
    selection: '#264f7840',
    lineNumber: '#858585',
    border: '#333333',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    comment: '#8b949e',
    function: '#d2a8ff',
  },
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onChange,
  onSave,
  className = '',
  theme = 'dark',
  fontSize = 14,
  tabSize = 2,
  wordWrap = true,
  minimap = false,
  optimizeForLowEnd = true,
}) => {
  const [content, setContent] = useState(file?.content || '');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [copied, setCopied] = useState(false);
  
  // Performance optimization: Debounce content changes
  const [debouncedContent, setDebouncedContent] = useState(content);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContent(content);
      onChange(content);
    }, optimizeForLowEnd ? 500 : 150);
    
    return () => clearTimeout(timer);
  }, [content, onChange, optimizeForLowEnd]);

  useEffect(() => {
    if (file?.content !== undefined) {
      setContent(file.content);
      // Add to history when file changes
      if (file.content !== content) {
        setHistory(prev => [...prev.slice(0, historyIndex + 1), file.content]);
        setHistoryIndex(prev => prev + 1);
      }
    }
  }, [file?.content]);

  const currentTheme = THEMES[localTheme];
  
  const language = useMemo(() => {
    if (!file?.name) return 'text';
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAPPINGS[ext] || 'text';
  }, [file?.name]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Add to history on significant changes
    if (Math.abs(newContent.length - content.length) > 10) {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), content]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [content, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          onSave();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'f':
          e.preventDefault();
          setShowSearch(true);
          break;
        case 'a':
          // Allow default Ctrl+A
          break;
        default:
          break;
      }
    }
    
    // Handle tab insertion
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = ' '.repeat(tabSize);
      
      const newContent = content.substring(0, start) + spaces + content.substring(end);
      setContent(newContent);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSize;
      }, 0);
    }
  }, [content, tabSize, onSave, handleUndo, handleRedo]);

  const handleSearch = useCallback(() => {
    if (!searchTerm) return;
    
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + searchTerm.length);
      }
    }
  }, [content, searchTerm]);

  const handleReplace = useCallback(() => {
    if (!searchTerm || !replaceTerm) return;
    
    const newContent = content.replace(new RegExp(searchTerm, 'g'), replaceTerm);
    setContent(newContent);
  }, [content, searchTerm, replaceTerm]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  const downloadFile = useCallback(() => {
    if (!file) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, file]);

  const getLineNumbers = useMemo(() => {
    if (optimizeForLowEnd && content.split('\n').length > 500) {
      return null; // Disable line numbers for large files on low-end devices
    }
    
    const lines = content.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-right pr-2 select-none" style={{ color: currentTheme.lineNumber }}>
        {index + 1}
      </div>
    ));
  }, [content, currentTheme.lineNumber, optimizeForLowEnd]);

  if (!file) {
    return (
      <div className={`flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}>
        <div className="text-center">
          <Type size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a file to start editing</p>
          <p className="text-sm mt-2">Use Ctrl+S to save, Ctrl+F to search</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm font-medium">{file.name}</span>
          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={14} />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Search (Ctrl+F)"
          >
            <Search size={14} />
          </button>
          <button
            onClick={copyToClipboard}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={downloadFile}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Download file"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={onSave}
            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-600 rounded text-blue-600 dark:text-blue-400"
            title="Save (Ctrl+S)"
          >
            <Save size={14} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <input
            type="text"
            placeholder="Replace..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Find
          </button>
          <button
            onClick={handleReplace}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Replace All
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="flex items-center gap-4 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm">Theme:</span>
            <button
              onClick={() => setLocalTheme(localTheme === 'light' ? 'dark' : 'light')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {localTheme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Font:</span>
            <input
              type="range"
              min="10"
              max="24"
              value={localFontSize}
              onChange={(e) => setLocalFontSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs w-8">{localFontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-green-500" />
            <span className="text-xs">Optimized for low-end devices</span>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        {getLineNumbers && (
          <div
            className="flex flex-col text-xs leading-5 py-4 px-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{ 
              fontSize: `${localFontSize}px`,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
            }}
          >
            {getLineNumbers}
          </div>
        )}
        
        {/* Text Area */}
        <textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className="flex-1 p-4 resize-none outline-none font-mono leading-5"
          style={{
            fontSize: `${localFontSize}px`,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            backgroundColor: currentTheme.background,
            color: currentTheme.foreground,
            tabSize,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            wordWrap: wordWrap ? 'break-word' : 'normal',
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          data-gramm="false" // Disable Grammarly
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 text-xs bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span>Lines: {content.split('\n').length}</span>
          <span>Characters: {content.length}</span>
          <span>Language: {language}</span>
        </div>
        <div className="flex items-center gap-2">
          {optimizeForLowEnd && <Smartphone size={12} className="text-green-500" />}
          <span>Encoding: UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;