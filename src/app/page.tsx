'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import DiffControls from '../components/DiffControls';
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Editors Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
                height: '380px',
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

              {/* Real-time Diff Preview */}
              <SplitDiffViewer
                textA={textA}
                textB={textB}
                ignoreCase={ignoreCase}
                ignoreWhitespace={ignoreWhitespace}
                compareLevel={diffLevel}
                fontSize={fontSize}
                height="450px"
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
              height="calc(100vh - 190px)"
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
              height="calc(100vh - 190px)"
            />
          )}
        </div>
      </main>


    </div>
  );
}
