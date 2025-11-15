'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  onCheckboxToggle?: (lineIndex: number, checked: boolean) => void;
  editable?: boolean;
}

export function MarkdownPreview({ 
  content, 
  className,
  onCheckboxToggle,
  editable = false
}: MarkdownPreviewProps) {
  // Pre-process content to find all checkbox lines and their indices
  const checkboxLines = useMemo(() => {
    const lines = content.split('\n');
    const checkboxIndices: number[] = [];
    
    lines.forEach((line, index) => {
      // Match markdown checkbox patterns: - [ ] or - [x] or * [ ] etc.
      if (line.match(/^[\s]*[-*]\s+\[[ xX]\]/)) {
        checkboxIndices.push(index);
      }
    });
    
    return checkboxIndices;
  }, [content]);

  // Track checkbox index using a closure variable
  let checkboxCounter = 0;

  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Interactive checkboxes
          input: ({ node: _node, ...props }: any) => {
            if (props.type === 'checkbox') {
              // Get the current checkbox line index
              const currentCheckboxIndex = checkboxCounter;
              const lineIndex = checkboxLines[currentCheckboxIndex];
              checkboxCounter++;
              
              // Determine if checked from props or by checking the line content
              const lines = content.split('\n');
              const line = lines[lineIndex] || '';
              const isChecked = props.checked !== undefined ? props.checked : /\[[xX]\]/.test(line);
              
              return (
                <Checkbox
                  checked={isChecked}
                  disabled={!editable || !onCheckboxToggle}
                  onCheckedChange={(checked) => {
                    if (onCheckboxToggle && editable && lineIndex !== undefined) {
                      onCheckboxToggle(lineIndex, checked === true);
                    }
                  }}
                  className="mr-2 align-middle"
                />
              );
            }
            return <input {...props} />;
          },
          // Customize heading styles
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
          ),
          // Customize list styles - remove default bullets for checkbox lists
          ul: ({ node: _node, children, ...props }: any) => {
            return (
              <ul className="list-none pl-0 my-2 space-y-1" {...props}>
                {children}
              </ul>
            );
          },
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal pl-6 my-2" {...props} />
          ),
          // Customize list items to support checkboxes
          li: ({ node: _node, children, ...props }: any) => {
            return (
              <li 
                className="my-1 flex items-start gap-2"
                {...props}
              >
                {children}
              </li>
            );
          },
          // Customize code blocks
          code: ({ node: _node, className, children, ...props }: any) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node: _node, ...props }) => (
            <pre
              className="bg-muted p-4 rounded-md overflow-x-auto my-4"
              {...props}
            />
          ),
          // Customize blockquotes
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
              {...props}
            />
          ),
          // Customize links
          a: ({ node: _node, ...props }) => (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Customize paragraphs
          p: ({ node: _node, ...props }) => (
            <p className="my-2 leading-relaxed" {...props} />
          ),
          // Customize tables
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border" {...props} />
            </div>
          ),
          th: ({ node: _node, ...props }) => (
            <th
              className="border border-border px-4 py-2 bg-muted font-semibold text-left"
              {...props}
            />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
