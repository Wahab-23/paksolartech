'use client';

import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Type, Layout, Image as ImageIcon, VideoIcon, MousePointerClick, Heading1, Quote, Minus } from 'lucide-react';
import { Text, Container, Image, Video, Button as CustomButton } from '../selectors';

interface BlockItemProps {
    label: string;
    icon: React.ReactNode;
    refCallback: (ref: any) => void;
    wide?: boolean;
}

const BlockItem = ({ label, icon, refCallback, wide }: BlockItemProps) => (
    <div
        ref={refCallback}
        title={`Drag to add ${label}`}
        className={`
            flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-lg
            border border-white/10 bg-white/5 text-white/60
            cursor-grab active:cursor-grabbing select-none
            hover:bg-white/10 hover:border-white/20 hover:text-white
            transition-all duration-150
            ${wide ? 'col-span-2' : ''}
        `}
    >
        <div className="h-5 w-5 shrink-0">{icon}</div>
        <span className="text-[11px] font-medium tracking-wide text-center leading-none">{label}</span>
    </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-1 mb-1 mt-3 first:mt-0">
        {children}
    </p>
);

export const Toolbox = () => {
    const { connectors: { create } } = useEditor();

    return (
        <div className="flex flex-col p-3 gap-1">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 mb-1 border-b border-white/10">
                <Layout className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span className="text-xs font-semibold text-white/70">Blocks</span>
            </div>

            <SectionLabel>Layout</SectionLabel>
            <div className="grid grid-cols-2 gap-1.5">
                <BlockItem
                    label="Container"
                    icon={<Layout className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Element canvas is={Container} className="p-20" />)}
                />
            </div>

            <SectionLabel>Text</SectionLabel>
            <div className="grid grid-cols-2 gap-1.5">
                <BlockItem
                    label="Paragraph"
                    icon={<Type className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Text text="Write your paragraph here…" fontSize={16} />)}
                />
                <BlockItem
                    label="Heading"
                    icon={<Heading1 className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Text text="Section Heading" fontSize={28} fontWeight="700" tagName="h2" />)}
                />
                <BlockItem
                    label="Quote"
                    icon={<Quote className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Text text={'\u201cThis is a blockquote.\u201d'} fontSize={18} textAlign="center" fontWeight="500" color="#94a3b8" />)}
                    wide
                />
            </div>

            <SectionLabel>Media</SectionLabel>
            <div className="grid grid-cols-2 gap-1.5">
                <BlockItem
                    label="Image"
                    icon={<ImageIcon className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Image />)}
                />
                <BlockItem
                    label="Video"
                    icon={<VideoIcon className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Video />)}
                />
            </div>

            <SectionLabel>Interactive</SectionLabel>
            <div className="grid grid-cols-2 gap-1.5">
                <BlockItem
                    label="Divider"
                    icon={<Minus className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <Element canvas is={Container} padding={0} background="transparent" className="p-20" />)}
                />
                <BlockItem
                    label="Button"
                    icon={<MousePointerClick className="h-5 w-5" />}
                    refCallback={(ref) => create(ref, <CustomButton text="Click Here" />)}
                />
            </div>

            <p className="mt-4 text-[10px] text-white/20 text-center leading-relaxed px-1">
                Drag a block onto the canvas to add it to your post
            </p>
        </div>
    );
};
