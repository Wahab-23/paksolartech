import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Text, Container, Button, Image, Video } from '../selectors';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { EditorTopbar } from './EditorTopbar';

interface CraftEditorProps {
    initialData?: string;
    onNodesChange?: (data: string) => void;
}

export const CraftEditor = ({ initialData, onNodesChange }: CraftEditorProps) => {
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

    return (
        <Editor 
            resolver={{ Text, Container, Button, Image, Video }}
            onNodesChange={(query) => {
                if (onNodesChange) {
                    onNodesChange(query.serialize());
                }
            }}
        >
           <div className="flex flex-col min-h-[700px] border border-border/50 rounded-xl overflow-hidden bg-background">
               <EditorTopbar />
               <div className="flex flex-1 overflow-hidden" style={{ height: '700px' }}>
                   {/* Main Canvas */}
                   <div className="flex-1 bg-[#09090b] overflow-y-auto p-4 md:p-8" id="craft-canvas-container">
                       <div className="mx-auto max-w-4xl bg-background min-h-full rounded-xl shadow-sm border border-border/30 overflow-hidden">
                           <Frame data={parsedData}>
                               {!parsedData && (
                               <Element is={Container} padding={20} canvas>
                                   <Text text="Welcome to Craft.js Editor! Drag items from the sidebar to begin." />
                               </Element>
                               )}
                           </Frame>
                       </div>
                   </div>
                   {/* Sidebar */}
                   <div className="w-[320px] border-l border-border/50 bg-card/50 flex flex-col h-full shrink-0">
                       <div className="flex-1 overflow-y-auto border-b border-border/50" style={{ maxHeight: '40%' }}>
                           <Toolbox />
                       </div>
                       <div className="flex-1 overflow-y-auto bg-muted/10 relative">
                           <SettingsPanel />
                       </div>
                   </div>
               </div>
           </div>
        </Editor>
    );
};
