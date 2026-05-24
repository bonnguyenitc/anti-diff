'use client';

import React from 'react';
import * as diff from 'diff';

interface UnifiedDiffViewerProps {
  textA: string;
  textB: string;
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  compareLevel: 'char' | 'word' | 'line';
}

export default function UnifiedDiffViewer({
  textA,
  textB,
  ignoreCase,
  ignoreWhitespace,
  compareLevel
}: UnifiedDiffViewerProps) {
  // Get line diffs
  const diffs = diff.diffLines(textA, textB, {
    ignoreCase
  } as any) as unknown as any[];

  if (!diffs) return null;

  let lineNumA = 1;
  let lineNumB = 1;

  // We flat map over the hunks and extract individual lines with metadata
  const linesToRender: Array<{
    text: string;
    type: 'added' | 'removed' | 'normal';
    numA?: number;
    numB?: number;
    subDiff?: diff.Change[];
  }> = [];

  diffs.forEach((part: any) => {
    let lines = part.value.split('\n');
    if (lines.length > 1 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    lines.forEach((line: string) => {
      if (part.removed) {
        linesToRender.push({
          text: line,
          type: 'removed',
          numA: lineNumA++
        });
      } else if (part.added) {
        linesToRender.push({
          text: line,
          type: 'added',
          numB: lineNumB++
        });
      } else {
        linesToRender.push({
          text: line,
          type: 'normal',
          numA: lineNumA++,
          numB: lineNumB++
        });
      }
    });
  });

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '700px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-tertiary)',
        fontWeight: 700,
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
        Chế độ xem kết hợp
      </div>

      {/* Code Container */}
      <div
        className="diff-container"
        style={{
          overflow: 'auto',
          flex: 1,
          backgroundColor: 'var(--bg-secondary)',
          padding: '4px 0'
        }}
      >
        {linesToRender.map((line, idx) => {
          const isAdded = line.type === 'added';
          const isRemoved = line.type === 'removed';
          
          let rowClass = '';
          if (isAdded) rowClass = 'diff-chunk diff-added-line';
          else if (isRemoved) rowClass = 'diff-chunk diff-removed-line';
          else rowClass = 'diff-chunk';

          return (
            <div
              key={idx}
              className={rowClass}
              style={{ display: 'flex' }}
            >
              {/* Left Line Num (Original) */}
              <div style={{
                width: '45px',
                minWidth: '45px',
                color: 'var(--text-muted)',
                textAlign: 'right',
                paddingRight: '12px',
                userSelect: 'none',
                borderRight: '1px solid var(--border-color)',
                marginRight: '6px',
                fontSize: '0.75rem',
              }}>
                {line.numA || ''}
              </div>
              {/* Right Line Num (Modified) */}
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
                {line.numB || ''}
              </div>
              {/* Sign indicator */}
              <div style={{
                width: '15px',
                minWidth: '15px',
                color: isAdded ? 'var(--diff-added-text)' : isRemoved ? 'var(--diff-removed-text)' : 'var(--text-muted)',
                userSelect: 'none',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {isAdded ? '+' : isRemoved ? '-' : ' '}
              </div>
              {/* Line Text */}
              <div style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {line.text || ' '}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
