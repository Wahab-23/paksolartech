import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';

export const RawHtmlSettings = () => {
    const { actions: { setProp }, html } = useNode((node) => ({
        html: node.data.props.html,
    }));

  return (
    <div className="flex items-center gap-6 overflow-visible w-full">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[10px] font-bold text-white/40 uppercase shrink-0">Content</span>
        <textarea
          value={html || ''}
          onChange={(e) => setProp((props: any) => props.html = e.target.value)}
          className="flex h-9 min-h-[36px] flex-1 rounded border border-white/10 bg-white/5 text-white p-1 text-[11px] focus:outline-none font-mono resize-none"
          placeholder={"<div>Your HTML...</div>"}
        />
      </div>
      <p className="text-[9px] text-white/20 italic max-w-[150px] leading-tight shrink-0">
        Directly renders provided markup.
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
