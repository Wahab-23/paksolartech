'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import {
    Undo2, Redo2, Maximize2, Minimize2, Eye, EyeOff,
    Code2, LayoutTemplate, Pencil, AlignLeft
} from 'lucide-react';

interface EditorTopbarProps {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

export const EditorTopbar = ({ isFullscreen, onToggleFullscreen }: EditorTopbarProps) => {
    const { actions, query, canUndo, canRedo, enabled } = useEditor((state, query) => ({
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo(),
        enabled: state.options.enabled,
    }));

    const TopBtn = ({
        onClick,
        disabled,
        title,
        children,
        active,
    }: {
        onClick: () => void;
        disabled?: boolean;
        title: string;
        children: React.ReactNode;
        active?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-all
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                ${active ? 'bg-white/15 text-blue-400' : 'text-white/60'}
            `}
        >
            {children}
        </button>
    );

    const Divider = () => <div className="w-px h-5 bg-white/10 mx-1" />;

    return (
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1f] border-b border-white/10 shrink-0">
            {/* Left – Brand & Mode */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                    <LayoutTemplate className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-white/80 tracking-wide">Visual Editor</span>
                </div>

                <Divider />

                {/* Edit / Preview toggle */}
                <TopBtn
                    onClick={() => actions.setOptions(options => { options.enabled = !options.enabled; })}
                    title={enabled ? 'Switch to Preview' : 'Switch to Edit'}
                    active={enabled}
                >
                    {enabled ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </TopBtn>

                <Divider />

                <TopBtn onClick={() => actions.history.undo()} disabled={!canUndo} title="Undo (Ctrl+Z)">
                    <Undo2 className="h-3.5 w-3.5" />
                </TopBtn>
                <TopBtn onClick={() => actions.history.redo()} disabled={!canRedo} title="Redo (Ctrl+Y)">
                    <Redo2 className="h-3.5 w-3.5" />
                </TopBtn>

                <Divider />

                {/* View/Copy Code */}
                <TopBtn 
                    onClick={() => {
                        const data = query.serialize();
                        navigator.clipboard.writeText(data);
                        alert("Editor state JSON copied to clipboard!");
                    }} 
                    title="Copy Editor Code"
                >
                    <Code2 className="h-3.5 w-3.5" />
                </TopBtn>
            </div>

            {/* Centre – status */}
            <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[11px] text-white/40 font-medium">
                    {enabled ? 'Editing' : 'Preview'}
                </span>
            </div>

            {/* Right – Fullscreen */}
            <div className="flex items-center gap-1">
                <TopBtn onClick={onToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                    {isFullscreen
                        ? <Minimize2 className="h-3.5 w-3.5" />
                        : <Maximize2 className="h-3.5 w-3.5" />
                    }
                </TopBtn>
            </div>
        </div>
    );
};
