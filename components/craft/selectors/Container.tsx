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
    <div className="flex items-center gap-6 overflow-visible">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Bg</span>
        <div className="flex items-center gap-1">
          <Input 
            type="color" 
            value={background || '#ffffff'} 
            onChange={(e) => setProp((props: any) => props.background = e.target.value)} 
            className="h-7 w-8 p-0.5 border-none bg-transparent"
          />
          <button 
            type="button" 
            onClick={() => setProp((p: any) => p.background = 'transparent')} 
            className="text-[9px] text-white/40 hover:text-white"
            title="Clear Background"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Pad</span>
        <Input 
          type="number" 
          value={padding || 0} 
          onChange={(e) => setProp((props: any) => props.padding = Number(e.target.value))} 
          className="h-7 w-12 border-white/10 bg-white/5 text-white text-xs px-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Dir</span>
        <select 
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={flexDirection || 'column'}
          onChange={(e) => setProp((props: any) => props.flexDirection = e.target.value)}
        >
          <option value="column">Col</option>
          <option value="row">Row</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Align</span>
        <select 
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={alignItems || 'flex-start'}
          onChange={(e) => setProp((props: any) => props.alignItems = e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Justify</span>
        <select 
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={justifyContent || 'flex-start'}
          onChange={(e) => setProp((props: any) => props.justifyContent = e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Betw</option>
          <option value="space-around">Around</option>
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
