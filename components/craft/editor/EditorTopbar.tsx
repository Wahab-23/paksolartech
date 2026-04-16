'use client';
import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import {
    Undo2, Redo2, Maximize2, Minimize2, Eye, EyeOff,
    Code2, LayoutTemplate, Pencil, Type, Heading1, 
    Quote, Minus, Code, Image as ImageIcon, 
    VideoIcon, MousePointerClick, Save, Trash2, Settings2
} from 'lucide-react';
import { Text, Container, Image, Video, Button as CustomButton, RawHtml } from '../selectors';

interface EditorTopbarProps {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

export const EditorTopbar = ({ 
    isFullscreen, 
    onToggleFullscreen 
}: EditorTopbarProps) => {
    const { actions, query, canUndo, canRedo, enabled, selected } = useEditor((state, query) => {
        const selectedId = state.events.selected.values().next().value;
        return {
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
            enabled: state.options.enabled,
            selected: selectedId ? {
                id: selectedId,
                name: state.nodes[selectedId]?.data?.name,
                settings: state.nodes[selectedId]?.related && state.nodes[selectedId].related.settings,
                isDeletable: selectedId !== 'ROOT'
            } : null
        };
    });

    const ActionBtn = ({
        onClick,
        disabled,
        title,
        children,
        active,
        variant = 'default'
    }: {
        onClick: () => void;
        disabled?: boolean;
        title: string;
        children: React.ReactNode;
        active?: boolean;
        variant?: 'default' | 'danger' | 'success';
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                inline-flex items-center justify-center h-8 px-2 rounded-md text-sm transition-all gap-1.5
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                ${active ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-white/60 border border-transparent'}
                ${variant === 'danger' ? 'hover:bg-red-500/20 hover:text-red-400' : ''}
                ${variant === 'success' ? 'hover:bg-green-500/20 hover:text-green-400' : ''}
            `}
        >
            {children}
        </button>
    );

    const BlockBtn = ({
        label,
        icon,
        refCallback,
        onClick
    }: {
        label: string;
        icon: React.ReactNode;
        refCallback: (ref: any) => void;
        onClick: () => void;
    }) => (
        <div
            ref={refCallback}
            onClick={onClick}
            title={`Click to add or drag to place: ${label}`}
            className="group flex flex-col items-center justify-center h-10 w-12 rounded-md border border-white/5 bg-white/[0.03] hover:bg-blue-500/15 hover:border-blue-500/40 transition-all cursor-pointer select-none text-white/30 hover:text-blue-400 shrink-0"
        >
            <div className="h-4 w-4 mb-0.5 group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-[8px] font-bold uppercase tracking-tighter text-center leading-none">
                {label}
            </span>
        </div>
    );

    const Divider = () => <div className="w-px h-6 bg-white/10 mx-2" />;

    const { connectors: { create } } = useEditor();

    const addBlock = (component: React.ReactElement) => {
        // Find parent: if current selection is a container, add to it. Otherwise add to ROOT.
        let parentId = 'ROOT';
        if (selected?.id) {
            const node = query.node(selected.id).get();
            if (node.data.isCanvas) {
                parentId = selected.id;
            } else if (node.data.parent) {
                parentId = node.data.parent;
            }
        }
        const nodeTree = query.parseReactElement(component).toNodeTree();
        actions.add(nodeTree as any, parentId);
    };

    return (
        <div className="flex flex-col bg-[#111114] border-b border-white/10 shrink-0">
            {/* ROW 1: ACTIONS */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5 mr-3 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                        <LayoutTemplate className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">Editor</span>
                    </div>

                    <Divider />

                    <ActionBtn onClick={() => actions.history.undo()} disabled={!canUndo} title="Undo">
                        <Undo2 className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => actions.history.redo()} disabled={!canRedo} title="Redo">
                        <Redo2 className="h-3.5 w-3.5" />
                    </ActionBtn>

                    <Divider />

                    <ActionBtn
                        onClick={() => actions.setOptions(options => { options.enabled = !options.enabled; })}
                        title={enabled ? 'Switch to Preview' : 'Switch to Edit'}
                        active={!enabled}
                    >
                        {enabled ? <Eye className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                        <span className="text-[10px] font-semibold">{enabled ? 'Preview' : 'Edit'}</span>
                    </ActionBtn>
                </div>

                <div className="flex items-center gap-2">
                    {selected && selected.isDeletable && (
                        <ActionBtn 
                            onClick={() => actions.delete(selected.id)} 
                            variant="danger" 
                            title="Delete Selected Element"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="text-[10px]">Delete</span>
                        </ActionBtn>
                    )}
                    
                    <Divider />
                    
                    <ActionBtn onClick={onToggleFullscreen} title="Fullscreen">
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </ActionBtn>

                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20">
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* ROW 2: BLOCKS */}
            {enabled && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#18181b] overflow-x-auto no-scrollbar">
                    <span className="text-[9px] font-black text-white/20 uppercase vertical-lr tracking-tighter mr-1 rotate-180">Blocks</span>
                    
                    <BlockBtn 
                        label="Box" icon={<LayoutTemplate className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Element canvas is={Container} className="p-20" />)}
                        onClick={() => addBlock(<Element canvas is={Container} className="p-20" />)}
                    />
                    <BlockBtn 
                        label="Text" icon={<Type className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Text text="Paragraph text..." fontSize={16} />)}
                        onClick={() => addBlock(<Text text="Paragraph text..." fontSize={16} />)}
                    />
                    <BlockBtn 
                        label="Heading" icon={<Heading1 className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Text text="New Heading" fontSize={28} fontWeight="700" tagName="h2" />)}
                        onClick={() => addBlock(<Text text="New Heading" fontSize={28} fontWeight="700" tagName="h2" />)}
                    />
                    <BlockBtn 
                        label="Image" icon={<ImageIcon className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Image />)}
                        onClick={() => addBlock(<Image />)}
                    />
                    <BlockBtn 
                        label="Button" icon={<MousePointerClick className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <CustomButton text="Click Me" />)}
                        onClick={() => addBlock(<CustomButton text="Click Me" />)}
                    />
                    <BlockBtn 
                        label="Video" icon={<VideoIcon className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Video />)}
                        onClick={() => addBlock(<Video />)}
                    />
                    <BlockBtn 
                        label="Divider" icon={<Minus className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Element canvas is={Container} padding={0} background="#88888833" className="w-full h-px" />)}
                        onClick={() => addBlock(<Element canvas is={Container} padding={0} background="#88888833" className="w-full h-px" />)}
                    />
                    <BlockBtn 
                        label="Quote" icon={<Quote className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <Text text='“Incredible quote here”' fontSize={20} textAlign="center" color="#94a3b8" />)}
                        onClick={() => addBlock(<Text text='“Incredible quote here”' fontSize={20} textAlign="center" color="#94a3b8" />)}
                    />
                    <BlockBtn 
                        label="HTML" icon={<Code className="h-4 w-4" />} 
                        refCallback={(ref) => create(ref, <RawHtml />)}
                        onClick={() => addBlock(<RawHtml />)}
                    />
                </div>
            )}
            {/* ROW 3: PROPERTIES (DYNAMIC) */}
            {enabled && selected && (
                <div className="flex items-center gap-4 px-3 py-2 bg-[#1c1c21] border-t border-white/5 animate-in slide-in-from-top duration-200">
                    <div className="flex items-center gap-2 pr-3 border-r border-white/10 shrink-0">
                        <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Settings2 className="h-3 w-3 text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter leading-none">Properties</span>
                            <span className="text-[10px] font-semibold text-blue-300 truncate max-w-[80px]">
                                {selected.name}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                        {selected.settings ? (
                            <div className="flex items-center gap-6">
                                {React.createElement(selected.settings)}
                            </div>
                        ) : (
                            <span className="text-[10px] text-white/20 italic">No editable properties for this element</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
