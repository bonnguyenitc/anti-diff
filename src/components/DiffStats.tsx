'use client';

import React from 'react';

interface DiffStatsProps {
  similarity: number;
  additionsCount: number;
  deletionsCount: number;
  statsA: { chars: number; words: number; lines: number };
  statsB: { chars: number; words: number; lines: number };
}

export default function DiffStats({
  similarity,
  additionsCount,
  deletionsCount,
  statsA,
  statsB
}: DiffStatsProps) {
  // Round to 1 decimal place
  const simPercent = Math.round(similarity * 10) / 10;

  // Determine indicator color based on similarity
  let strokeColor = 'var(--primary)';
  if (simPercent >= 90) strokeColor = 'hsl(142, 70%, 45%)';
  else if (simPercent >= 50) strokeColor = 'hsl(47, 95%, 55%)';
  else if (simPercent > 0) strokeColor = 'hsl(346, 80%, 55%)';

  // Circle progress calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (simPercent / 100) * circumference;

  return (
    <div className="card animate-fade-in" style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '20px',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      {/* Circular Progress Similarity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '70px', height: '70px' }}>
          <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="35"
              cy="35"
              r={radius}
              fill="transparent"
              stroke="var(--border-color)"
              strokeWidth="6"
            />
            {/* Foreground circle */}
            <circle
              cx="35"
              cy="35"
              r={radius}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-primary)'
          }}>
            {simPercent}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
            Độ tương đồng
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {simPercent === 100 ? 'Giống nhau 100%' : simPercent === 0 ? 'Khác nhau hoàn toàn' : 'Khớp một phần'}
          </div>
        </div>
      </div>

      {/* Changes counter */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{
          flex: 1,
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: 'var(--diff-added-bg)',
          border: '1px solid hsla(142, 70%, 45%, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--diff-added-text)', textTransform: 'uppercase' }}>Thêm vào</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--diff-added-text)' }}>+{additionsCount}</span>
        </div>
        <div style={{
          flex: 1,
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: 'var(--diff-removed-bg)',
          border: '1px solid hsla(346, 80%, 55%, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--diff-removed-text)', textTransform: 'uppercase' }}>Xóa đi</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--diff-removed-text)' }}>-{deletionsCount}</span>
        </div>
      </div>

      {/* Source Stats */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Văn bản gốc (Trái)</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Số ký tự:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsA.chars}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Số từ:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsA.words}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Số dòng:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsA.lines}</strong>
        </div>
      </div>

      {/* Target Stats */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Văn bản đã sửa (Phải)</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Số ký tự:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsB.chars}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Số từ:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsB.words}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Số dòng:</span> <strong style={{ color: 'var(--text-primary)' }}>{statsB.lines}</strong>
        </div>
      </div>
    </div>
  );
}
