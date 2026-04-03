import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ContainerSettings = () => {
  const { background, padding, flexDirection, alignItems, justifyContent, actions: { setProp } } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>Background Color</Label>
        <Input 
          type="color" 
          value={background || 'transparent'} 
          onChange={(e) => setProp((props: any) => props.background = e.target.value)} 
          className="h-10 px-1 py-1"
        />
        <div className="flex gap-2 mt-1">
           <button type="button" onClick={() => setProp((p: any) => p.background = 'transparent')} className="text-xs text-muted-foreground hover:underline">Clear Background</button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Padding (px)</Label>
        <Input 
          type="number" 
          value={padding || 0} 
          onChange={(e) => setProp((props: any) => props.padding = Number(e.target.value))} 
        />
      </div>
      <div className="grid gap-2">
        <Label>Direction</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={flexDirection || 'column'}
          onChange={(e) => setProp((props: any) => props.flexDirection = e.target.value)}
        >
          <option value="column">Column</option>
          <option value="row">Row</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Align Items</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={alignItems || 'flex-start'}
          onChange={(e) => setProp((props: any) => props.alignItems = e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Justify Content</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={justifyContent || 'flex-start'}
          onChange={(e) => setProp((props: any) => props.justifyContent = e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
        </select>
      </div>
    </div>
  );
};

export const Container = ({ background, padding, flexDirection, alignItems, justifyContent, children }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{
        background: background === 'transparent' ? undefined : background,
        padding: `${padding}px`,
        display: 'flex',
        flexDirection,
        alignItems,
        justifyContent,
        outline: selected ? '2px solid #3b82f6' : '1px dashed rgba(255,255,255,0.2)',
        outlineOffset: '-1px',
        minHeight: '50px',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: 'transparent',
    padding: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: ContainerSettings,
  },
};
