'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Text, Container, Button, Image, Video, RawHtml } from '../selectors';
import { EditorTopbar } from './EditorTopbar';
import { createPortal } from 'react-dom';

interface CraftEditorProps {
    initialData?: string;
    onNodesChange?: (data: string) => void;
}

const Workspace = ({ 
    parsedData 
}: { 
    parsedData: any
}) => {
    return (
        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#1c1c1f]" id="craft-canvas-container">
            <div className="min-h-full overflow-hidden">
                <Frame data={parsedData}>
                    {!parsedData && (
                        <Element is={Container} padding={20} canvas>
                            <Text text="Start building. Click 'Blocks' in the top bar to add elements." />
                        </Element>
                    )}
                </Frame>
            </div>
        </main>
    );
};

const EditorWrapper = ({ 
    isFullscreen, 
    parsedData, 
    toggleFullscreen 
}: { 
    isFullscreen: boolean, 
    parsedData: any, 
    toggleFullscreen: () => void 
}) => {
    return (
        <div
            className={
                isFullscreen
                    ? 'fixed inset-0 z-9999 flex flex-col bg-[#0f0f11]'
                    : 'flex flex-col border border-border/50 rounded-xl overflow-hidden bg-[#0f0f11]'
            }
            style={isFullscreen ? undefined : { minHeight: 700 }}
        >
            <EditorTopbar 
                isFullscreen={isFullscreen} 
                onToggleFullscreen={toggleFullscreen}
            />

            <div className="flex flex-1 overflow-hidden">
                <Workspace 
                    parsedData={parsedData}
                />
            </div>
        </div>
    );
};

export const CraftEditor = ({ initialData, onNodesChange }: CraftEditorProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFullscreen]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    let parsedData = initialData;
    let isLegacy = false;

    try {
        if (initialData) {
            try {
                const obj = JSON.parse(initialData);
                if (!obj || typeof obj !== 'object' || !obj.ROOT) {
                    isLegacy = true;
                }
            } catch {
                isLegacy = true;
            }

            if (isLegacy) {
                const fallbackJSON = {
                    "ROOT": {
                        "type": { "resolvedName": "Container" },
                        "isCanvas": true,
                        "props": { "background": "transparent", "padding": 20, "flexDirection": "column", "alignItems": "flex-start", "justifyContent": "flex-start" },
                        "displayName": "Container",
                        "custom": {},
                        "hidden": false,
                        "nodes": ["node_legacy_text"],
                        "linkedNodes": {}
                    },
                    "node_legacy_text": {
                        "type": { "resolvedName": "Text" },
                        "isCanvas": false,
                        "props": { "text": initialData, "fontSize": 16, "textAlign": "left", "fontWeight": "normal", "color": "inherit" },
                        "displayName": "Text",
                        "custom": {},
                        "hidden": false,
                        "nodes": [],
                        "linkedNodes": {},
                        "parent": "ROOT"
                    }
                };
                parsedData = JSON.stringify(fallbackJSON);
            }
        }
    } catch (err) {
        console.error("Error processing CraftEditor data:", err);
        setError("Failed to initialize editor data");
    }

    const editorContent = (
        <Editor
            resolver={{ Text, Container, Button, Image, Video, RawHtml }}
            onNodesChange={(query) => {
                if (onNodesChange) {
                    try {
                        onNodesChange(query.serialize());
                    } catch (err) {
                        console.error("Error serializing editor nodes:", err);
                    }
                }
            }}
        >
            <EditorWrapper 
                isFullscreen={isFullscreen}
                parsedData={parsedData}
                toggleFullscreen={toggleFullscreen}
            />
        </Editor>
    );

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-4 text-center text-red-500">
                <div>
                    <p className="font-semibold">{error}</p>
                    <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
                </div>
            </div>
        );
    }

    if (isFullscreen && mounted) {
        return createPortal(editorContent, document.body);
    }

    return editorContent;
};
