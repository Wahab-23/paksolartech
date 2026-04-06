import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';

export const RawHtmlSettings = () => {
    const { actions: { setProp }, html } = useNode((node) => ({
        html: node.data.props.html,
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2 text-white">
                <Label>Raw HTML Content</Label>
                <textarea
                    value={html || ''}
                    onChange={(e) => setProp((props: any) => props.html = e.target.value)}
                    className="flex min-h-[150px] w-full rounded-md border border-white/20 bg-[#1e1e24] text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder={"<div>Your HTML here</div>"}
                />
            </div>
            <p className="text-xs text-white/50">
                Any valid HTML provided here will be rendered directly inside the content block. 
                Be careful when pasting external scripts.
            </p>
        </div>
    );
};

export const RawHtml = ({ html, margin }: any) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <div
            ref={(ref: any) => connect(drag(ref))}
            className="p-1 min-h-[2em]"
            style={{
                margin: margin ? `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px` : '0',
                outline: selected ? '2px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)'
            }}
        >
            {html ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
                <div className="text-white/30 text-xs text-center py-2 bg-white/5 border border-white/10 rounded">
                    [Raw HTML Block - Select to edit]
                </div>
            )}
        </div>
    );
};

RawHtml.craft = {
    displayName: 'Raw HTML',
    props: {
        html: '',
        margin: [0, 0, 0, 0],
    },
    related: {
        settings: RawHtmlSettings,
    },
};
