import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ImageSettings = () => {
  const { src, alt, width, height, objectFit, borderRadius, actions: { setProp } } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    objectFit: node.data.props.objectFit,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-4 text-white/80">
      <div className="grid gap-2">
        <Label>Image URL (src)</Label>
        <Input
          value={src || ''}
          onChange={(e) => setProp((props: any) => props.src = e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="grid gap-2">
        <Label>Alt Text</Label>
        <Input
          value={alt || ''}
          onChange={(e) => setProp((props: any) => props.alt = e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Width</Label>
          <Input
            value={width || ''}
            onChange={(e) => setProp((props: any) => props.width = e.target.value)}
            placeholder="100% or 400px"
          />
        </div>
        <div className="grid gap-2">
          <Label>Height</Label>
          <Input
            value={height || ''}
            onChange={(e) => setProp((props: any) => props.height = e.target.value)}
            placeholder="auto or 300px"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Object Fit</Label>
        <select
          className="flex h-9 w-full rounded-md border border-white/20 bg-[#1e1e24] text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={objectFit || 'cover'}
          onChange={(e) => setProp((props: any) => props.objectFit = e.target.value)}
        >
          <option value="fill">Fill</option>
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="none">None</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Border Radius (px)</Label>
        <Input
          type="number"
          value={borderRadius || 0}
          onChange={(e) => setProp((props: any) => props.borderRadius = Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export const Image = ({ src, alt, width, height, objectFit, borderRadius }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{
        outline: selected ? '2px solid #3b82f6' : 'none',
        display: 'inline-block',
        width: typeof width === 'number' ? `${width}px` : width || '100%',
        maxWidth: '100%'
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Image'}
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height || 'auto',
            objectFit,
            borderRadius: `${borderRadius}px`,
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#1f2937', // gray-800
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af', // gray-400
            borderRadius: `${borderRadius}px`,
          }}
        >
          No Image Provided
        </div>
      )}
    </div>
  );
};

Image.craft = {
  displayName: 'Image',
  props: {
    src: '',
    alt: 'Blog Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 8,
  },
  related: {
    settings: ImageSettings,
  },
};
