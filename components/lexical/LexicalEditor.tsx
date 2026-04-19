'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { EditorState, $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { useCallback, useEffect, useRef, forwardRef } from 'react';
import { Toolbar } from './Toolbar';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export interface LexicalEditorRef {
  getContent: () => string;
}

interface LexicalEditorProps {
  initialContent?: string;
  placeholder?: string;
}

const editorConfig = {
  namespace: 'PakSolarTechEditor',
  theme: {
    H1: 'text-2xl font-bold mb-4',
    H2: 'text-xl font-bold mb-3',
    H3: 'text-lg font-bold mb-2',
    H4: 'text-base font-bold mb-1',
    H5: 'text-sm font-bold mb-1',
    H6: 'text-xs font-bold mb-1',
    paragraph: 'text-base leading-relaxed text-gray-800 dark:text-gray-200 mb-2',
    list: {
      nested: {
        listitem: 'ml-8',
      },
      ol: 'list-decimal ml-6 mb-2',
      ul: 'list-disc ml-6 mb-2',
      listitem: 'mb-1',
    },
    link: 'text-primary hover:underline cursor-pointer',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
    },
  },
  onError: (error: Error) => {
    console.error('Lexical editor error:', error);
  },
  nodes: [ListNode, ListItemNode, LinkNode],
};

const InitializeEditorContent = ({
  initialContent,
}: {
  initialContent?: string;
}) => {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editor || isInitialized.current || !initialContent?.trim()) return;

    try {
      // Try to parse as JSON first (Lexical format)
      const parsed = JSON.parse(initialContent);
      if (parsed && parsed.root) {
        editor.setEditorState(editor.parseEditorState(parsed));
        isInitialized.current = true;
        return;
      }
    } catch (e) {
      // JSON parse failed, treat as plain text
    }

    // Fallback: treat as plain text and create basic editor state
    try {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        // Split by newlines and create paragraphs
        const lines = initialContent.split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(line));
            root.append(paragraph);
          }
        });
      });
      isInitialized.current = true;
    } catch (e) {
      console.error('Failed to set initial content:', e);
    }
  }, [editor, initialContent]);

  return null;
};

const LexicalEditorContent = forwardRef<LexicalEditorRef, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      if (ref && 'current' in ref) {
        ref.current = {
          getContent: () => {
            let jsonString = '';
            editor.getEditorState().read(() => {
              jsonString = JSON.stringify(editor.getEditorState().toJSON());
            });
            return jsonString;
          }
        };
      }
    }, [editor, ref]);

    return (
      <div className="flex flex-col gap-4">
        <Toolbar />
        <div className="relative rounded-lg border border-input bg-background text-foreground shadow-sm">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative min-h-96 max-h-96 w-full resize-none overflow-auto p-4 text-base outline-none" />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-4 text-muted-foreground">
                {placeholder || 'Start typing your content...'}
              </div>
            }
            ErrorBoundary={() => <div className="text-red-500 p-4">An error occurred in the editor</div>}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
      </div>
    );
  }
);

LexicalEditorContent.displayName = 'LexicalEditorContent';

export const LexicalEditor = forwardRef<LexicalEditorRef, LexicalEditorProps>(
  ({ initialContent = '', placeholder = 'Start typing your content...' }, ref) => {
    return (
      <LexicalComposer initialConfig={editorConfig}>
        <InitializeEditorContent initialContent={initialContent} />
        <LexicalEditorContent ref={ref} placeholder={placeholder} />
      </LexicalComposer>
    );
  }
);

LexicalEditor.displayName = 'LexicalEditor';
