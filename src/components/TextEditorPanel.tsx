'use client';

import React, { useRef, useState } from 'react';

interface TextEditorPanelProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  panelId: 'panel-a' | 'panel-b';
  fontSize?: number;
}

export default function TextEditorPanel({
  title,
  placeholder,
  value,
  onChange,
  panelId,
  fontSize
}: TextEditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Statistics
  const charCount = value.length;
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
  const lineCount = value === '' ? 0 : value.split('\n').length;

  const handleClear = () => {
    onChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
      alert('Không thể tự động truy cập bộ nhớ tạm. Vui lòng nhấn CMD+V / CTRL+V để dán.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    // Simple visual feedback
    const btn = document.getElementById(`${panelId}-copy-btn`);
    if (btn) {
      const oldText = btn.innerHTML;
      btn.innerHTML = 'Đã sao chép!';
      setTimeout(() => {
        btn.innerHTML = oldText;
      }, 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="card animate-fade-in" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDragOver ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderColor: isDragOver ? 'var(--primary)' : 'var(--border-color)',
        transition: 'all var(--transition-normal)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Panel Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: panelId === 'panel-a' ? 'hsl(346, 80%, 55%)' : 'hsl(142, 70%, 45%)'
          }} />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
            {title}
          </h2>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={handlePaste} 
            className="btn btn-ghost" 
            style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
            title="Dán từ bộ nhớ tạm"
            id={`${panelId}-paste-btn`}
          >
            Dán
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="btn btn-ghost" 
            style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
            title="Tải tệp lên"
            id={`${panelId}-upload-btn`}
          >
            Tải lên
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".txt,.js,.ts,.tsx,.json,.md,.html,.css"
          />
          <button 
            onClick={handleCopy} 
            className="btn btn-ghost" 
            style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
            disabled={!value}
            id={`${panelId}-copy-btn`}
            title="Sao chép vào bộ nhớ tạm"
          >
            Sao chép
          </button>
          <button 
            onClick={handleClear} 
            className="btn btn-ghost" 
            style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px', color: 'hsl(346, 80%, 55%)' }}
            disabled={!value}
            title="Xóa văn bản"
            id={`${panelId}-clear-btn`}
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Textarea container */}
      <div style={{ flex: 1, padding: '16px', position: 'relative' }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-textarea"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            border: 'none',
            padding: 0,
            resize: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: fontSize ? `${fontSize}px` : undefined,
          }}
          id={`${panelId}-textarea`}
        />
        {isDragOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'hsla(221, 83%, 60%, 0.08)',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: '1rem',
            fontWeight: 700,
            pointerEvents: 'none',
          }}>
            Thả tệp tin vào đây...
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <span>Ký tự: <strong>{charCount}</strong></span>
        <span>Từ ngữ: <strong>{wordCount}</strong></span>
        <span>Dòng: <strong>{lineCount}</strong></span>
      </div>
    </div>
  );
}
