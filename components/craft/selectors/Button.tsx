import React from 'react';
import { useNode } from '@craftjs/core';
import { Button as UIButton } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ButtonSettings = () => {
  const { text, href, variant, size, actions: { setProp } } = useNode((node) => ({
    text: node.data.props.text,
    href: node.data.props.href,
    variant: node.data.props.variant,
    size: node.data.props.size,
  }));

  return (
    <div className="flex items-center gap-6 overflow-visible">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Text</span>
        <Input 
          value={text || ''} 
          onChange={(e) => setProp((props: any) => props.text = e.target.value)} 
          className="h-7 w-24 border-white/10 bg-white/5 text-white text-[11px] px-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Url</span>
        <Input 
          value={href || ''} 
          onChange={(e) => setProp((props: any) => props.href = e.target.value)} 
          placeholder="https://..."
          className="h-7 w-32 border-white/10 bg-white/5 text-white text-[11px] px-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Theme</span>
        <select 
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={variant || 'default'}
          onChange={(e) => setProp((props: any) => props.variant = e.target.value)}
        >
          <option value="default">Def</option>
          <option value="secondary">Sec</option>
          <option value="destructive">Dest</option>
          <option value="outline">Out</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Size</span>
        <select 
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={size || 'default'}
          onChange={(e) => setProp((props: any) => props.size = e.target.value)}
        >
          <option value="default">Def</option>
          <option value="sm">Sm</option>
          <option value="lg">Lg</option>
          <option value="icon">Icon</option>
        </select>
      </div>
    </div>
  );
};

export const Button = ({ text, href, variant, size }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const btnProps = {
    variant: variant as any,
    size: size as any,
  };

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{
        outline: selected ? '2px solid #3b82f6' : 'none',
        display: 'inline-block'
      }}
    >
      <a href={href || '#'} target="_blank" rel="noopener noreferrer" onClick={e => e.preventDefault()}>
        <UIButton {...btnProps}>{text || 'Button Content'}</UIButton>
      </a>
    </div>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    href: '#',
    variant: 'default',
    size: 'default',
  },
  related: {
    settings: ButtonSettings,
  },
};
