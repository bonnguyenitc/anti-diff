'use client';

import React, { useState } from 'react';

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
  fontSize: number;
  setFontSize: (size: number) => void;
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
  onLoadSample,
  fontSize,
  setFontSize
}: DiffControlsProps) {
  const [showSamplesDropdown, setShowSamplesDropdown] = useState(false);

  return (
    <div className="card animate-fade-in" style={{
      padding: '12px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '20px',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* 1. VIEW MODE SEGMENTED CONTROL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hiển thị
        </span>
        <div style={{ display: 'flex', gap: '2px', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '10px' }}>
          {[
            { 
              id: 'edit', 
              label: 'Bàn làm việc',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              )
            },
            { 
              id: 'split', 
              label: 'So sánh song song',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 3v18" />
                </svg>
              )
            },
            { 
              id: 'unified', 
              label: 'So sánh kết hợp',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </svg>
              )
            }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as ViewMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                backgroundColor: viewMode === mode.id ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === mode.id ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === mode.id ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title={mode.label}
              id={`view-mode-${mode.id}`}
            >
              {mode.icon}
              <span className="toolbar-text-label">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />

      {/* 2. COMPARE LEVEL SEGMENTED CONTROL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          So sánh theo
        </span>
        <div style={{ display: 'flex', gap: '2px', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '10px' }}>
          {[
            { 
              id: 'char', 
              label: 'Ký tự',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h16v3" />
                  <path d="M9 20h6" />
                  <path d="M12 4v16" />
                </svg>
              )
            },
            { 
              id: 'word', 
              label: 'Từ ngữ',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16" />
                  <path d="M4 12h10" />
                  <path d="M4 18h14" />
                </svg>
              )
            },
            { 
              id: 'line', 
              label: 'Dòng',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </svg>
              )
            }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setDiffLevel(level.id as DiffLevel)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                backgroundColor: diffLevel === level.id ? 'var(--bg-secondary)' : 'transparent',
                color: diffLevel === level.id ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: diffLevel === level.id ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title={`So sánh ở cấp độ ${level.label}`}
              id={`diff-level-${level.id}`}
            >
              {level.icon}
              <span>{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />

      {/* 3. FONT SIZE SELECTOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }} title="Cỡ chữ hiển thị">
          Cỡ chữ
        </span>
        <div style={{ display: 'flex', gap: '2px', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '10px' }}>
          {[12, 14, 16, 18].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              style={{
                padding: '6px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                backgroundColor: fontSize === size ? 'var(--bg-secondary)' : 'transparent',
                color: fontSize === size ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: fontSize === size ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              id={`font-size-${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }} />

      {/* 4. SETTINGS (PREMIUM ICON TOGGLES) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tùy chọn
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Toggle Ignore Case */}
          <button
            onClick={() => setIgnoreCase(!ignoreCase)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              height: '36px',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              backgroundColor: ignoreCase ? 'var(--diff-added-bg)' : 'var(--bg-secondary)',
              color: ignoreCase ? 'var(--diff-added-text)' : 'var(--text-secondary)',
              borderColor: ignoreCase ? 'hsla(142, 70%, 45%, 0.3)' : 'var(--border-color)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: ignoreCase ? '0 0 10px hsla(142, 70%, 45%, 0.1)' : 'none',
            }}
            title={ignoreCase ? "Đang bỏ qua chữ HOA/thường" : "Phân biệt chữ HOA/thường"}
            id="ignore-case-toggle-btn"
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '-0.05em' }}>aA</span>
            <span className="toolbar-text-label" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
              Bỏ qua HOA/thường
            </span>
          </button>

          {/* Toggle Ignore Whitespace */}
          <button
            onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              height: '36px',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              backgroundColor: ignoreWhitespace ? 'var(--diff-added-bg)' : 'var(--bg-secondary)',
              color: ignoreWhitespace ? 'var(--diff-added-text)' : 'var(--text-secondary)',
              borderColor: ignoreWhitespace ? 'hsla(142, 70%, 45%, 0.3)' : 'var(--border-color)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: ignoreWhitespace ? '0 0 10px hsla(142, 70%, 45%, 0.1)' : 'none',
            }}
            title={ignoreWhitespace ? "Đang bỏ qua khoảng trắng" : "So sánh cả khoảng trắng"}
            id="ignore-whitespace-toggle-btn"
          >
            {/* Paragraph / whitespace sign */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 9H8a4 4 0 0 0 0 8h2" />
              <path d="M12 4v16" />
              <path d="M16 4v16" />
            </svg>
            <span className="toolbar-text-label" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
              Bỏ qua khoảng trắng
            </span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', marginLeft: 'auto' }} />

      {/* 5. SAMPLE DROPDOWN MENU */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
          className="btn btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '0.78rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px var(--primary-glow)',
          }}
          id="sample-menu-dropdown-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Tải văn bản mẫu
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showSamplesDropdown ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showSamplesDropdown && (
          <>
            {/* Backdrop cover for clicking outside */}
            <div 
              onClick={() => setShowSamplesDropdown(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 998,
                backgroundColor: 'transparent',
              }}
            />
            {/* Dropdown Menu Container */}
            <div className="card" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              zIndex: 999,
              width: '180px',
              padding: '6px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn var(--transition-fast) forwards',
            }}>
              {[
                { id: 'simple', label: 'Văn bản đơn giản', desc: 'Thử nghiệm dòng cơ bản' },
                { id: 'text', label: 'Đoạn văn bản', desc: 'So sánh đoạn văn dài' },
                { id: 'code', label: 'Mã nguồn JS', desc: 'So sánh lập trình Javascript' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onLoadSample(item.id as 'code' | 'text' | 'simple');
                    setShowSamplesDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  id={`sample-item-${item.id}`}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.label}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
