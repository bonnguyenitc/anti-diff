'use client';

import React from 'react';

type DiffLevel = 'char' | 'word' | 'line';
type ViewMode = 'edit' | 'split' | 'unified';

interface DiffControlsProps {
  diffLevel: DiffLevel;
  setDiffLevel: (level: DiffLevel) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  ignoreCase: boolean;
  setIgnoreCase: (val: boolean) => void;
  ignoreWhitespace: boolean;
  setIgnoreWhitespace: (val: boolean) => void;
  onLoadSample: (type: 'code' | 'text' | 'simple') => void;
}

export default function DiffControls({
  diffLevel,
  setDiffLevel,
  viewMode,
  setViewMode,
  ignoreCase,
  setIgnoreCase,
  ignoreWhitespace,
  setIgnoreWhitespace,
  onLoadSample
}: DiffControlsProps) {
  return (
    <div className="card animate-fade-in" style={{
      padding: '16px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      {/* Comparison Level */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Mức độ so sánh
        </span>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
          {(['char', 'word', 'line'] as DiffLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setDiffLevel(level)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                backgroundColor: diffLevel === level ? 'var(--bg-secondary)' : 'transparent',
                color: diffLevel === level ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: diffLevel === level ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              id={`diff-level-${level}`}
            >
              {level === 'char' ? 'Ký tự' : level === 'word' ? 'Từ ngữ' : 'Dòng'}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Chế độ hiển thị
        </span>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
          {[
            { id: 'edit', label: 'Nhập liệu' },
            { id: 'split', label: 'So sánh song song' },
            { id: 'unified', label: 'So sánh kết hợp' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as ViewMode)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                backgroundColor: viewMode === mode.id ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === mode.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === mode.id ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              id={`view-mode-${mode.id}`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '4px',
              accentColor: 'var(--primary)',
              cursor: 'pointer',
            }}
            id="ignore-case-checkbox"
          />
          Bỏ qua chữ hoa/thường
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '4px',
              accentColor: 'var(--primary)',
              cursor: 'pointer',
            }}
            id="ignore-whitespace-checkbox"
          />
          Bỏ qua khoảng trắng
        </label>
      </div>

      {/* Load Samples */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Tải văn bản mẫu
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onLoadSample('simple')} className="btn" style={{ padding: '6px 12px', fontSize: '0.78rem' }} id="sample-simple-btn">
            Văn bản đơn giản
          </button>
          <button onClick={() => onLoadSample('text')} className="btn" style={{ padding: '6px 12px', fontSize: '0.78rem' }} id="sample-text-btn">
            Đoạn văn bản
          </button>
          <button onClick={() => onLoadSample('code')} className="btn" style={{ padding: '6px 12px', fontSize: '0.78rem' }} id="sample-code-btn">
            Mã nguồn JS
          </button>
        </div>
      </div>
    </div>
  );
}
