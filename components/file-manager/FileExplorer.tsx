'use client';

import React, { useState, useCallback } from 'react';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  Download,
  Upload,
  Search,
  FileText,
  Image,
  Code,
  Zap
} from 'lucide-react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  path: string;
  size?: number;
  modified?: Date;
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  selectedFile?: FileNode;
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (parentPath: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (file: FileNode) => void;
  onFileRename: (file: FileNode, newName: string) => void;
  onFileUpload: (files: FileList, parentPath: string) => void;
  className?: string;
}

const getFileIcon = (fileName: string, isFolder: boolean, isOpen?: boolean) => {
  if (isFolder) {
    return isOpen ? FolderOpen : Folder;
  }
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'css':
    case 'html':
    case 'json':
      return Code;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return Image;
    case 'md':
    case 'txt':
    case 'doc':
    case 'docx':
      return FileText;
    default:
      return File;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const FileTreeNode: React.FC<{
  node: FileNode;
  level: number;
  selectedFile?: FileNode;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void;
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (parentPath: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (file: FileNode) => void;
  onFileRename: (file: FileNode, newName: string) => void;
  editingFile?: string;
  setEditingFile: (id?: string) => void;
  newName: string;
  setNewName: (name: string) => void;
}> = ({
  node,
  level,
  selectedFile,
  expandedFolders,
  onToggleFolder,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  editingFile,
  setEditingFile,
  newName,
  setNewName,
}) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFile?.id === node.id;
  const isEditing = editingFile === node.id;
  const Icon = getFileIcon(node.name, isFolder, isExpanded);

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(node.id);
    } else {
      onFileSelect(node);
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onFileRename(node, newName.trim());
    }
    setEditingFile(undefined);
    setNewName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingFile(undefined);
      setNewName('');
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group ${
          isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        <Icon 
          size={16} 
          className={`text-gray-600 dark:text-gray-400 ${
            isFolder ? 'text-blue-600 dark:text-blue-400' : ''
          }`} 
        />
        
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent border border-blue-500 rounded px-1 outline-none"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-sm truncate">{node.name}</span>
        )}
        
        {node.size && !isFolder && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(node.size)}
          </span>
        )}
        
        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
          {isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const name = prompt('Enter file/folder name:');
                if (name) {
                  const type = name.includes('.') ? 'file' : 'folder';
                  onFileCreate(node.path, name, type);
                }
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <Plus size={12} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingFile(node.id);
              setNewName(node.name);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <Edit size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${node.name}?`)) {
                onFileDelete(node);
              }
            }}
            className="p-1 hover:bg-red-200 dark:hover:bg-red-600 rounded text-red-600"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
              onFileRename={onFileRename}
              editingFile={editingFile}
              setEditingFile={setEditingFile}
              newName={newName}
              setNewName={setNewName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileUpload,
  className = '',
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFile, setEditingFile] = useState<string>();
  const [newName, setNewName] = useState('');
  
  const toggleFolder = useCallback((id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  }, [expandedFolders]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files, '/');
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            File Explorer
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => {
                const name = prompt('Enter file/folder name:');
                if (name) {
                  const type = name.includes('.') ? 'file' : 'folder';
                  onFileCreate('/', name, type);
                }
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="New File/Folder"
            >
              <Plus size={14} />
            </button>
            <label className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" title="Upload Files">
              <Upload size={14} />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* File Tree */}
      <div className="max-h-96 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No files found' : 'No files yet'}
          </div>
        ) : (
          <div className="py-1">
            {filteredFiles.map((file) => (
              <FileTreeNode
                key={file.id}
                node={file}
                level={0}
                selectedFile={selectedFile}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onFileSelect={onFileSelect}
                onFileCreate={onFileCreate}
                onFileDelete={onFileDelete}
                onFileRename={onFileRename}
                editingFile={editingFile}
                setEditingFile={setEditingFile}
                newName={newName}
                setNewName={setNewName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;