'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { Settings2, Trash2, Info } from 'lucide-react';

export const SettingsPanel = () => {
    const { actions, selected, currentNodeId } = useEditor((state) => {
        const currentNodeId = state.events.selected.values().next().value;
        let selected: {
            id: string;
            name: string;
            settings: any;
            isDeletable: boolean;
        } | undefined;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId]?.data?.name || 'Element',
                settings:
                    state.nodes[currentNodeId]?.related &&
                    state.nodes[currentNodeId].related.settings,
                isDeletable: currentNodeId !== 'ROOT',
            };
        }

        return { selected, currentNodeId };
    });

    if (!selected) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Info className="h-4 w-4 text-white/30" />
                </div>
                <div>
                    <p className="text-xs font-medium text-white/40">No element selected</p>
                    <p className="text-[11px] text-white/20 mt-0.5 leading-relaxed">
                        Click an element on the canvas to edit its properties
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2.5 border-b border-white/10 bg-white/5 shrink-0 flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-white/70">Properties</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium border border-blue-500/20 truncate max-w-[80px]">
                    {selected.name}
                </span>
            </div>

            {/* Settings content */}
            <div className="flex-1 overflow-y-auto p-3 text-white/70">
                {selected.settings ? (
                    <div className="space-y-4">
                        {React.createElement(selected.settings)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <p className="text-[11px] text-white/30 text-center leading-relaxed">
                            No editable properties for this element.
                        </p>
                    </div>
                )}
            </div>

            {/* Delete */}
            {selected.isDeletable && (
                <div className="p-3 border-t border-white/10 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            if (currentNodeId) actions.delete(currentNodeId);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                            bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium
                            hover:bg-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Element
                    </button>
                </div>
            )}
        </div>
    );
};
