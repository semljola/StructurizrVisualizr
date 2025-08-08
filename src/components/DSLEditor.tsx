import React, { useState } from 'react';
import { Download, Upload, Copy, Check } from 'lucide-react';


interface DSLEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors: string[];
  onExport?: () => void;
  onImport?: (file: File) => void;
}

export const DSLEditor: React.FC<DSLEditorProps> = ({
  value,
  onChange,
  errors,
  onExport,
  onImport
}) => {
  const [copied, setCopied] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      const blob = new Blob([value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'c4-model.dsl';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">DSL Editor</h3>
          {errors.length > 0 && (
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200"
            >
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          
          <label className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer" title="Import DSL file">
            <Upload size={16} />
            <input
              type="file"
              accept=".dsl,.txt"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleExport}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Export DSL file"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Error Panel */}
      {showErrors && errors.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Errors:</h4>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-auto min-h-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm leading-relaxed border-0 resize-none focus:ring-0 focus:outline-none bg-transparent"
          placeholder="Enter your Structurizr DSL here..."
          spellCheck={false}
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span>
            {value.split('\n').length} lines, {value.length} characters
          </span>
          <span>
            Press Ctrl+S to save, Ctrl+Z to undo
          </span>
        </div>
      </div>
    </div>
  );
};
