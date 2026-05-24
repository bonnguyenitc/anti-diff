'use client';

import React, { useRef, useEffect } from 'react';
import * as diff from 'diff';
import { computeAlignedDiff, AlignedRow, DiffLine } from '../utils/diffHelper';

interface SplitDiffViewerProps {
  textA: string;
  textB: string;
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  compareLevel: 'char' | 'word' | 'line';
  fontSize?: number;
  height?: string;
}

export default function SplitDiffViewer({
  textA,
  textB,
  ignoreCase,
  ignoreWhitespace,
  compareLevel,
  fontSize,
  height = '700px'
}: SplitDiffViewerProps) {
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const leftHeaderRef = useRef<HTMLDivElement>(null);
  const rightHeaderRef = useRef<HTMLDivElement>(null);

  const rows = computeAlignedDiff(textA, textB, ignoreCase, ignoreWhitespace, compareLevel);

  // Synchronized Scrolling
  useEffect(() => {
    const leftPane = leftPaneRef.current;
    const rightPane = rightPaneRef.current;
    if (!leftPane || !rightPane) return;

    let activePane: 'left' | 'right' | null = null;

    const handleLeftScroll = () => {
      if (activePane === null) activePane = 'left';
      if (activePane === 'left') {
        rightPane.scrollTop = leftPane.scrollTop;
        rightPane.scrollLeft = leftPane.scrollLeft;
      }
    };

    const handleRightScroll = () => {
      if (activePane === null) activePane = 'right';
      if (activePane === 'right') {
        leftPane.scrollTop = rightPane.scrollTop;
        leftPane.scrollLeft = rightPane.scrollLeft;
      }
    };

    const handleTouchStartLeft = () => { activePane = 'left'; };
    const handleTouchStartRight = () => { activePane = 'right'; };
    const handleMouseOverLeft = () => { activePane = 'left'; };
    const handleMouseOverRight = () => { activePane = 'right'; };

    leftPane.addEventListener('scroll', handleLeftScroll, { passive: true });
    rightPane.addEventListener('scroll', handleRightScroll, { passive: true });
    leftPane.addEventListener('touchstart', handleTouchStartLeft, { passive: true });
    rightPane.addEventListener('touchstart', handleTouchStartRight, { passive: true });
    leftPane.addEventListener('mouseover', handleMouseOverLeft, { passive: true });
    rightPane.addEventListener('mouseover', handleMouseOverRight, { passive: true });

    return () => {
      leftPane.removeEventListener('scroll', handleLeftScroll);
      rightPane.removeEventListener('scroll', handleRightScroll);
      leftPane.removeEventListener('touchstart', handleTouchStartLeft);
      rightPane.removeEventListener('touchstart', handleTouchStartRight);
      leftPane.removeEventListener('mouseover', handleMouseOverLeft);
      rightPane.removeEventListener('mouseover', handleMouseOverRight);
    };
  }, [rows]);

  const renderLineContent = (line: DiffLine) => {
    if (line.type === 'empty') {
      return <div style={{ height: '100%', color: 'var(--text-muted)' }}>&nbsp;</div>;
    }

    if (line.words && line.words.length > 0) {
      return (
        <>
          {line.words.map((part, idx) => {
            if (part.added) {
              return (
                <span key={idx} className="diff-added-inline">
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span key={idx} className="diff-removed-inline">
                  {part.value}
                </span>
              );
            }
            return <span key={idx}>{part.value}</span>;
          })}
        </>
      );
    }

    return line.text || ' ';
  };

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: height,
      overflow: 'hidden',
    }}>
      {/* Pane headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-tertiary)',
        fontWeight: 700,
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        userSelect: 'none'
      }}>
        <div ref={leftHeaderRef} style={{ padding: '10px 16px', borderRight: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(346, 80%, 55%)' }} />
          Văn bản gốc
        </div>
        <div ref={rightHeaderRef} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(142, 70%, 45%)' }} />
          Văn bản đã sửa
        </div>
      </div>

      {/* Pane Contents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Left Side (Original) */}
        <div
          ref={leftPaneRef}
          className="diff-container"
          style={{
            overflow: 'auto',
            height: '100%',
            borderRight: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: fontSize ? `${fontSize}px` : undefined,
          }}
        >
          {rows.map((row, idx) => {
            const isRemoved = row.left.type === 'removed';
            const isEmpty = row.left.type === 'empty';
            
            return (
              <div
                key={idx}
                className={isRemoved ? 'diff-chunk diff-removed-line' : 'diff-chunk'}
                style={{
                  display: 'flex',
                  backgroundColor: isEmpty ? 'var(--bg-tertiary)' : undefined,
                  opacity: isEmpty ? 0.35 : 1,
                }}
              >
                {/* Line number */}
                <div style={{
                  width: '45px',
                  minWidth: '45px',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  paddingRight: '12px',
                  userSelect: 'none',
                  borderRight: '1px solid var(--border-color)',
                  marginRight: '12px',
                  fontSize: '0.75rem',
                }}>
                  {row.left.lineNumber || ''}
                </div>
                {/* Sign indicator */}
                <div style={{
                  width: '15px',
                  minWidth: '15px',
                  color: isRemoved ? 'var(--diff-removed-text)' : 'var(--text-muted)',
                  userSelect: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {isRemoved ? '-' : ' '}
                </div>
                {/* Text Content */}
                <div style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {renderLineContent(row.left)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side (Modified) */}
        <div
          ref={rightPaneRef}
          className="diff-container"
          style={{
            overflow: 'auto',
            height: '100%',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: fontSize ? `${fontSize}px` : undefined,
          }}
        >
          {rows.map((row, idx) => {
            const isAdded = row.right.type === 'added';
            const isEmpty = row.right.type === 'empty';

            return (
              <div
                key={idx}
                className={isAdded ? 'diff-chunk diff-added-line' : 'diff-chunk'}
                style={{
                  display: 'flex',
                  backgroundColor: isEmpty ? 'var(--bg-tertiary)' : undefined,
                  opacity: isEmpty ? 0.35 : 1,
                }}
              >
                {/* Line number */}
                <div style={{
                  width: '45px',
                  minWidth: '45px',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  paddingRight: '12px',
                  userSelect: 'none',
                  borderRight: '1px solid var(--border-color)',
                  marginRight: '12px',
                  fontSize: '0.75rem',
                }}>
                  {row.right.lineNumber || ''}
                </div>
                {/* Sign indicator */}
                <div style={{
                  width: '15px',
                  minWidth: '15px',
                  color: isAdded ? 'var(--diff-added-text)' : 'var(--text-muted)',
                  userSelect: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {isAdded ? '+' : ' '}
                </div>
                {/* Text Content */}
                <div style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {renderLineContent(row.right)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
