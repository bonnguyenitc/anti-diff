'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DiffControls from '../components/DiffControls';
import DiffStats from '../components/DiffStats';
import TextEditorPanel from '../components/TextEditorPanel';
import SplitDiffViewer from '../components/SplitDiffViewer';
import UnifiedDiffViewer from '../components/UnifiedDiffViewer';
import * as diff from 'diff';

type DiffLevel = 'char' | 'word' | 'line';
type ViewMode = 'edit' | 'split' | 'unified';

const SAMPLES = {
  simple: {
    a: `Chào mừng bạn đến với công cụ so sánh văn bản Antigravity Diff.
Đây là một bài thử nghiệm so sánh văn bản đơn giản.
Các dòng giống nhau sẽ hiển thị màu chữ bình thường.
Các dòng khác biệt sẽ được làm nổi bật bằng màu đỏ và xanh lá.`,
    b: `Chào bạn! Chào mừng đến với công cụ so sánh văn bản Antigravity Diff.
Đây là bài thử nghiệm so sánh văn bản đơn giản.
Các dòng giống nhau sẽ hiển thị màu chữ bình thường.
Các dòng khác biệt sẽ được làm nổi bật bằng màu đỏ và xanh lá để dễ quan sát.
Đây là một dòng mới được thêm vào ở phiên bản đã chỉnh sửa!`
  },
  text: {
    a: `Thuật toán so sánh Myers là một thuật toán nhanh và hiệu quả để tìm chuỗi con chung dài nhất của hai chuỗi. Nó được sử dụng rộng rãi trong các hệ thống quản lý phiên bản như Git để tính toán sự khác biệt giữa các phiên bản tệp tin.

Công cụ này cung cấp khả năng trực quan hóa các thay đổi trong thời gian thực, làm nổi bật phần thêm vào bằng màu xanh lá và phần bị xóa bằng màu đỏ. Hãy thử thay đổi một số từ ở đây để xem nó hoạt động như thế nào.`,
    b: `Thuật toán so sánh Myers là một phương pháp cực kỳ nhanh chóng và hiệu quả để tìm kiếm chuỗi con chung dài nhất (LCS) giữa hai văn bản đầu vào. Nó được dùng rộng rãi trong các công cụ quản lý phiên bản như Git để tính toán sự khác khác biệt giữa các lần sửa đổi tệp tin.

Công cụ của chúng tôi cung cấp giao diện trực quan hóa các thay đổi trực tiếp theo thời gian thực, làm nổi bật văn bản được thêm vào bằng màu xanh lá và văn bản bị xóa bằng màu đỏ. Hãy cùng xem công cụ này hoạt động hiệu quả thế nào trên các đoạn văn bản!`
  },
  code: {
    a: `function calculateTotal(items, taxRate) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price;
  }
  
  const tax = subtotal * taxRate;
  return subtotal + tax;
}

// Print total of some items
console.log("Total:", calculateTotal([{price: 10}, {price: 20}], 0.1));`,
    b: `// Calculates the total cost of items with tax rate applied
function calculateTotal(items, taxRate = 0.08) {
  if (!items || items.length === 0) return 0;
  
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  
  return {
    subtotal,
    tax,
    total: subtotal + tax
  };
}

// Print invoice summary
console.log("Invoice Summary:", calculateTotal([{price: 15}, {price: 25}]));`
  }
};

export default function Home() {
  const [textA, setTextA] = useState(SAMPLES.simple.a);
  const [textB, setTextB] = useState(SAMPLES.simple.b);
  const [diffLevel, setDiffLevel] = useState<DiffLevel>('word');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);

  // Stats State
  const [similarity, setSimilarity] = useState(100);
  const [additionsCount, setAdditionsCount] = useState(0);
  const [deletionsCount, setDeletionsCount] = useState(0);
  const [statsA, setStatsA] = useState({ chars: 0, words: 0, lines: 0 });
  const [statsB, setStatsB] = useState({ chars: 0, words: 0, lines: 0 });

  // Recalculate stats when text or configurations change
  useEffect(() => {
    // 1. Text A Stats
    const charsA = textA.length;
    const wordsA = textA.trim() === '' ? 0 : textA.trim().split(/\s+/).length;
    const linesA = textA === '' ? 0 : textA.split('\n').length;
    setStatsA({ chars: charsA, words: wordsA, lines: linesA });

    // 2. Text B Stats
    const charsB = textB.length;
    const wordsB = textB.trim() === '' ? 0 : textB.trim().split(/\s+/).length;
    const linesB = textB === '' ? 0 : textB.split('\n').length;
    setStatsB({ chars: charsB, words: wordsB, lines: linesB });

    // 3. Diff and Similarity calculations
    let addCount = 0;
    let delCount = 0;
    let matchChars = 0;

    const opt: any = { ignoreCase };

    if (diffLevel === 'char') {
      const parts = diff.diffChars(textA, textB, opt) as unknown as any[];
      parts?.forEach((p) => {
        if (p.added) addCount += p.value.length;
        else if (p.removed) delCount += p.value.length;
        else matchChars += p.value.length;
      });
    } else if (diffLevel === 'word') {
      const parts = diff.diffWords(textA, textB, opt) as unknown as any[];
      parts?.forEach((p) => {
        const count = p.value.trim().split(/\s+/).filter(Boolean).length;
        if (p.added) addCount += count;
        else if (p.removed) delCount += count;
        else matchChars += p.value.length; // still base similarity on characters for accuracy
      });
    } else { // line level
      const parts = diff.diffLines(textA, textB, opt) as unknown as any[];
      parts?.forEach((p) => {
        let lines = p.value.split('\n');
        if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
        const count = lines.length;

        if (p.added) addCount += count;
        else if (p.removed) delCount += count;
      });
    }

    // Similarity is always best calculated using Character LCS for exact percentage
    const charParts = diff.diffChars(textA, textB, opt) as unknown as any[];
    const commonChars = charParts ? charParts.reduce((sum, p) => (!p.added && !p.removed) ? sum + p.value.length : sum, 0) : 0;
    const maxChars = Math.max(textA.length, textB.length);
    const simScore = maxChars > 0 ? (commonChars / maxChars) * 100 : 100;

    setSimilarity(simScore);
    setAdditionsCount(addCount);
    setDeletionsCount(delCount);
  }, [textA, textB, diffLevel, ignoreCase, ignoreWhitespace]);

  const handleLoadSample = (type: 'code' | 'text' | 'simple') => {
    setTextA(SAMPLES[type].a);
    setTextB(SAMPLES[type].b);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{
        flex: 1,
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Statistics Dashboard */}
        <DiffStats
          similarity={similarity}
          additionsCount={additionsCount}
          deletionsCount={deletionsCount}
          statsA={statsA}
          statsB={statsB}
        />

        {/* Toolbar controls */}
        <DiffControls
          diffLevel={diffLevel}
          setDiffLevel={setDiffLevel}
          viewMode={viewMode}
          setViewMode={setViewMode}
          ignoreCase={ignoreCase}
          setIgnoreCase={setIgnoreCase}
          ignoreWhitespace={ignoreWhitespace}
          setIgnoreWhitespace={setIgnoreWhitespace}
          onLoadSample={handleLoadSample}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />

        {/* Main interactive panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {viewMode === 'edit' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              height: '700px',
            }}>
              <TextEditorPanel
                title="Văn bản gốc (Nguồn A)"
                placeholder="Nhập hoặc dán văn bản gốc vào đây..."
                value={textA}
                onChange={setTextA}
                panelId="panel-a"
                fontSize={fontSize}
              />
              <TextEditorPanel
                title="Văn bản đã sửa (Nguồn B)"
                placeholder="Nhập hoặc dán văn bản đã sửa vào đây để so sánh..."
                value={textB}
                onChange={setTextB}
                panelId="panel-b"
                fontSize={fontSize}
              />
            </div>
          )}

          {viewMode === 'split' && (
            <SplitDiffViewer
              textA={textA}
              textB={textB}
              ignoreCase={ignoreCase}
              ignoreWhitespace={ignoreWhitespace}
              compareLevel={diffLevel}
              fontSize={fontSize}
            />
          )}

          {viewMode === 'unified' && (
            <UnifiedDiffViewer
              textA={textA}
              textB={textB}
              ignoreCase={ignoreCase}
              ignoreWhitespace={ignoreWhitespace}
              compareLevel={diffLevel}
              fontSize={fontSize}
            />
          )}
        </div>
      </main>

      <footer style={{
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        marginTop: '40px'
      }}>
        © {new Date().getFullYear()} Antigravity Diff. Công cụ so sánh văn bản thời gian thực, trực quan và hiện đại.
      </footer>
    </div>
  );
}
