'use client';

import React from 'react';

interface DiffStatsProps {
  additionsCount: number;
  deletionsCount: number;
  statsA: { chars: number; words: number; lines: number };
  statsB: { chars: number; words: number; lines: number };
}

export default function DiffStats({
  additionsCount,
  deletionsCount,
  statsA,
  statsB
}: DiffStatsProps) {
  return (
    <div className="card animate-fade-in" style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '20px',
      alignItems: 'center',
      marginBottom: '20px',
    }}>

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
