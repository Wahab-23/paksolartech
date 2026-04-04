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
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 text-white">
        <Label>Font Size (px)</Label>
        <Input
          type="number"
          value={fontSize || 16}
          onChange={(e) => setProp((props: any) => props.fontSize = Number(e.target.value))}
          className="border-white/20 bg-[#1e1e24] text-white"
        />
      </div>
      <div className="grid gap-2 text-white">
        <Label>HTML Tag</Label>
        <select
          className="flex h-9 w-full rounded-md border border-white/20 bg-[#1e1e24] text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={tagName || 'p'}
          onChange={(e) => setProp((props: any) => props.tagName = e.target.value)}
        >
          <option value="h1">Heading 1 (h1)</option>
          <option value="h2">Heading 2 (h2)</option>
          <option value="h3">Heading 3 (h3)</option>
          <option value="h4">Heading 4 (h4)</option>
          <option value="h5">Heading 5 (h5)</option>
          <option value="h6">Heading 6 (h6)</option>
        </select>
      </div>
      <div className="grid gap-2 text-white">
        <Label>Font Weight</Label>
        <select
          className="flex h-9 w-full rounded-md border border-white/20 bg-[#1e1e24] text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={fontWeight || 'normal'}
          onChange={(e) => setProp((props: any) => props.fontWeight = e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="100">100</option>
          <option value="300">300</option>
          <option value="500">500</option>
          <option value="700">700</option>
          <option value="900">900</option>
        </select>
      </div>
      <div className="grid gap-2 text-white">
        <Label>Text Align</Label>
        <select
          className="flex h-9 w-full rounded-md border border-white/20 bg-[#1e1e24] text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={textAlign || 'left'}
          onChange={(e) => setProp((props: any) => props.textAlign = e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
      <div className="grid gap-2 text-white">
        <Label>Color</Label>
        <Input
          type="color"
          value={color || '#ffffff'}
          onChange={(e) => setProp((props: any) => props.color = e.target.value)}
          className="h-10 px-1 py-1"
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
