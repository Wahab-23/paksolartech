'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Text, Container, Button, Image, Video } from '../selectors';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { EditorTopbar } from './EditorTopbar';
import { createPortal } from 'react-dom';

interface CraftEditorProps {
    initialData?: string;
    onNodesChange?: (data: string) => void;
}

export const CraftEditor = ({ initialData, onNodesChange }: CraftEditorProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    const editorContent = (
        <Editor
            resolver={{ Text, Container, Button, Image, Video }}
            onNodesChange={(query) => {
                if (onNodesChange) {
                    onNodesChange(query.serialize());
                }
            }}
        >
            <div
                className={
                    isFullscreen
                        ? 'fixed inset-0 z-[9999] flex flex-col bg-[#0f0f11]'
                        : 'flex flex-col border border-border/50 rounded-xl overflow-hidden bg-[#0f0f11]'
                }
                style={isFullscreen ? undefined : { minHeight: 700 }}
            >
                {/* ── Top Bar ── */}
                <EditorTopbar isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />

                {/* ── Body ── */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Toolbox Panel */}
                    <aside className="w-[220px] shrink-0 border-r border-white/10 bg-[#18181b] flex flex-col overflow-y-auto">
                        <Toolbox />
                    </aside>

                    {/* Canvas */}
                    <main className="flex-1 overflow-y-auto" id="craft-canvas-container">
                        <div className="bg-white dark:bg-[#1c1c1f] min-h-full overflow-hidden">
                            <Frame data={parsedData}>
                                {!parsedData && (
                                    <Element is={Container} padding={20} canvas>
                                        <Text text="Start building your blog post. Drag blocks from the left panel." />
                                    </Element>
                                )}
                            </Frame>
                        </div>
                    </main>

                    {/* Right Settings Panel */}
                    <aside className="w-[280px] shrink-0 border-l border-white/10 bg-[#18181b] flex flex-col overflow-hidden">
                        <SettingsPanel />
                    </aside>
                </div>
            </div>
        </Editor>
    );

    if (isFullscreen && mounted) {
        return createPortal(editorContent, document.body);
    }

    return editorContent;
};
