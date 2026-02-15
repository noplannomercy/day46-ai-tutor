'use client';

import { InlineMath, BlockMath } from 'react-katex';

interface KaTeXRendererProps {
  content: string;
}

export function KaTeXRenderer({ content }: KaTeXRendererProps) {
  // Parse content for LaTeX patterns
  // Inline: \\( formula \\)
  // Block: \\[ formula \\]

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Regex to match both inline and block math
  const regex = /\\(\()(.*?)\\(\))|\\(\[)(.*?)\\(\])/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the math
    if (match.index > lastIndex) {
      const text = content.substring(lastIndex, match.index);
      parts.push(<span key={`text-${key++}`}>{text}</span>);
    }

    // Determine if inline or block
    const isInline = match[1] === '(';
    const formula = isInline ? match[2] : match[5];

    try {
      if (isInline) {
        parts.push(<InlineMath key={`math-${key++}`} math={formula} />);
      } else {
        parts.push(
          <div key={`math-${key++}`} className="my-2">
            <BlockMath math={formula} />
          </div>
        );
      }
    } catch (error) {
      // If KaTeX fails, render as plain text
      parts.push(
        <span key={`error-${key++}`} className="text-red-500">
          {isInline ? `\\(${formula}\\)` : `\\[${formula}\\]`}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(<span key={`text-${key++}`}>{content.substring(lastIndex)}</span>);
  }

  return <div className="whitespace-pre-wrap">{parts}</div>;
}
