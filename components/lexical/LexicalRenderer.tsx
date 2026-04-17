'use client';

import React, { useMemo } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { createEditor } from 'lexical';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';

interface LexicalRendererProps {
  data: string;
}

export const LexicalRenderer = ({ data }: LexicalRendererProps) => {
  const html = useMemo(() => {
    try {
      // Try parsing as JSON (Lexical format)
      const parsed = JSON.parse(data);

      if (parsed && parsed.root) {
        // Create a temporary editor instance to convert to HTML
        const editor = createEditor({
          nodes: [ListNode, ListItemNode, LinkNode],
        });

        let htmlOutput = '';
        editor.update(() => {
          const editorState = editor.parseEditorState(parsed);
          htmlOutput = $generateHtmlFromNodes(editor, null);
        });

        return htmlOutput || data;
      }
    } catch {
      // If parsing fails, assume it's plain text or HTML
      if (data && data.trim().startsWith('<')) {
        return data;
      }
    }

    // Fallback: wrap plain text in paragraphs
    return `<p>${data?.replace(/\n/g, '</p><p>') || ''}</p>`;
  }, [data]);

  return (
    <div
      className="prose prose-invert max-w-none prose-a:text-primary prose-a:hover:underline prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:ml-6 prose-ol:ml-6 prose-li:marker:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
