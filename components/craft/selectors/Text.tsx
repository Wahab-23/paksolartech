import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const TextSettings = () => {
  const { actions: { setProp }, fontSize, textAlign, fontWeight, color, tagName } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    tagName: node.data.props.tagName,
  }));

  return (
    <div className="flex items-center gap-6 overflow-visible">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Size</span>
        <Input
          type="number"
          value={fontSize || 16}
          onChange={(e) => setProp((props: any) => props.fontSize = Number(e.target.value))}
          className="h-7 w-14 border-white/10 bg-white/5 text-white text-xs px-1"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Tag</span>
        <select
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={tagName || 'p'}
          onChange={(e) => setProp((props: any) => props.tagName = e.target.value)}
        >
          <option value="p">P</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Weight</span>
        <select
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={fontWeight || 'normal'}
          onChange={(e) => setProp((props: any) => props.fontWeight = e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="300">Light</option>
          <option value="500">Medium</option>
          <option value="700">Boldest</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Align</span>
        <select
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={textAlign || 'left'}
          onChange={(e) => setProp((props: any) => props.textAlign = e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Color</span>
        <Input
          type="color"
          value={color || '#ffffff'}
          onChange={(e) => setProp((props: any) => props.color = e.target.value)}
          className="h-7 w-8 p-0.5 border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export const Text = ({ text, fontSize, textAlign, fontWeight, color, margin, tagName }: any) => {
  const { connectors: { connect, drag }, selected, actions: { setProp } } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
      className="p-1 min-h-[1em]"
      style={{
        margin: margin ? `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px` : '0',
        outline: selected && !editable ? '2px solid #3b82f6' : 'none'
      }}
    >
      <ContentEditable
        html={text || 'Empty Text'}
        disabled={!editable}
        onChange={e =>
          setProp((props: any) => props.text = e.target.value)
        }
        tagName={tagName || "p"}
        style={{
          fontSize: `${fontSize}px`,
          textAlign,
          fontWeight,
          color,
          margin: 0,
          outline: 'none'
        }}
      />
    </div>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Type your text here...',
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'normal',
    color: 'inherit',
    margin: [0, 0, 0, 0],
    tagName: 'p',
  },
  related: {
    settings: TextSettings,
  },
};
