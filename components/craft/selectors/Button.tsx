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
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>Button Text</Label>
        <Input 
          value={text || ''} 
          onChange={(e) => setProp((props: any) => props.text = e.target.value)} 
        />
      </div>
      <div className="grid gap-2">
        <Label>Link URL</Label>
        <Input 
          value={href || ''} 
          onChange={(e) => setProp((props: any) => props.href = e.target.value)} 
          placeholder="https://..."
        />
      </div>
      <div className="grid gap-2">
        <Label>Variant</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={variant || 'default'}
          onChange={(e) => setProp((props: any) => props.variant = e.target.value)}
        >
          <option value="default">Default</option>
          <option value="secondary">Secondary</option>
          <option value="destructive">Destructive</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Size</Label>
        <select 
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={size || 'default'}
          onChange={(e) => setProp((props: any) => props.size = e.target.value)}
        >
          <option value="default">Default</option>
          <option value="sm">Small</option>
          <option value="lg">Large</option>
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
