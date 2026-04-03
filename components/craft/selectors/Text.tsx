import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const TextSettings = () => {
  const { actions: { setProp }, fontSize, textAlign, fontWeight, color } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>Font Size (px)</Label>
        <Input 
          type="number" 
          value={fontSize || 16} 
          onChange={(e) => setProp((props: any) => props.fontSize = Number(e.target.value))} 
        />
      </div>
      <div className="grid gap-2">
        <Label>Font Weight</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="grid gap-2">
        <Label>Text Align</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={textAlign || 'left'}
          onChange={(e) => setProp((props: any) => props.textAlign = e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
      <div className="grid gap-2">
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

export const Text = ({ text, fontSize, textAlign, fontWeight, color, margin }: any) => {
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
        tagName="p"
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
  },
  related: {
    settings: TextSettings,
  },
};
