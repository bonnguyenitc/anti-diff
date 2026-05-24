import * as diff from 'diff';

export interface DiffLine {
  text: string;
  type: 'added' | 'removed' | 'normal' | 'empty';
  lineNumber?: number;
  words?: diff.Change[]; // For word-level or char-level inline highlights
}

export interface AlignedRow {
  left: DiffLine;
  right: DiffLine;
}

export function computeAlignedDiff(
  textA: string,
  textB: string,
  ignoreCase: boolean,
  ignoreWhitespace: boolean,
  compareLevel: 'char' | 'word' | 'line'
): AlignedRow[] {
  // Get line-level diff using jsdiff
  // Note: jsdiff does not have a direct ignoreWhitespace option for diffLines,
  // but it does have ignoreWhitespace parameter for diffWords and diffChars.
  // We can pass options to diffLines:
  const diffs = diff.diffLines(textA, textB, {
    ignoreCase,
  } as any) as unknown as any[];

  if (!diffs) return [];

  const rows: AlignedRow[] = [];
  let lineNumA = 1;
  let lineNumB = 1;

  let pendingRemoved: string[] = [];
  let pendingAdded: string[] = [];

  const flushPending = () => {
    const maxLen = Math.max(pendingRemoved.length, pendingAdded.length);
    for (let i = 0; i < maxLen; i++) {
      const remText = pendingRemoved[i];
      const addText = pendingAdded[i];

      const left: DiffLine = remText !== undefined
        ? { text: remText, type: 'removed', lineNumber: lineNumA++ }
        : { text: '', type: 'empty' };

      const right: DiffLine = addText !== undefined
        ? { text: addText, type: 'added', lineNumber: lineNumB++ }
        : { text: '', type: 'empty' };

      // If we have both a removed line and an added line, compute sub-line highlights
      if (remText !== undefined && addText !== undefined && compareLevel !== 'line') {
        const textToCompareA = ignoreCase ? remText.toLowerCase() : remText;
        const textToCompareB = ignoreCase ? addText.toLowerCase() : addText;

        if (compareLevel === 'word') {
          // Word diff
          const subDiff = diff.diffWords(remText, addText, { ignoreCase } as any) as unknown as any[];
          if (subDiff) {
            left.words = subDiff.filter(p => !p.added);
            right.words = subDiff.filter(p => !p.removed);
          }
        } else if (compareLevel === 'char') {
          // Character diff
          const subDiff = diff.diffChars(remText, addText, { ignoreCase } as any) as unknown as any[];
          if (subDiff) {
            left.words = subDiff.filter(p => !p.added);
            right.words = subDiff.filter(p => !p.removed);
          }
        }
      }

      rows.push({ left, right });
    }
    pendingRemoved = [];
    pendingAdded = [];
  };

  for (const part of diffs) {
    let lines = part.value.split('\n');
    
    // If the last line is empty and part ends with \n, remove it
    if (lines.length > 1 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    if (part.removed) {
      pendingRemoved.push(...lines);
    } else if (part.added) {
      pendingAdded.push(...lines);
    } else {
      // First, flush any pending added/removed lines
      flushPending();
      // Then add the identical lines
      for (const line of lines) {
        rows.push({
          left: { text: line, type: 'normal', lineNumber: lineNumA++ },
          right: { text: line, type: 'normal', lineNumber: lineNumB++ }
        });
      }
    }
  }

  // Flush remaining pending lines
  flushPending();

  return rows;
}
