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
    <div className="flex items-center gap-6 overflow-visible">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Src</span>
        <Input
          value={src || ''}
          onChange={(e) => setProp((props: any) => props.src = e.target.value)}
          placeholder="URL"
          className="h-7 w-32 border-white/10 bg-white/5 text-white text-[11px] px-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Alt</span>
        <Input
          value={alt || ''}
          onChange={(e) => setProp((props: any) => props.alt = e.target.value)}
          placeholder="Alt"
          className="h-7 w-20 border-white/10 bg-white/5 text-white text-[11px] px-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Size</span>
        <div className="flex items-center gap-1">
          <Input
            value={width || ''}
            onChange={(e) => setProp((props: any) => props.width = e.target.value)}
            placeholder="W"
            className="h-7 w-12 border-white/10 bg-white/5 text-white text-[11px] px-1 text-center"
          />
          <Input
            value={height || ''}
            onChange={(e) => setProp((props: any) => props.height = e.target.value)}
            placeholder="H"
            className="h-7 w-12 border-white/10 bg-white/5 text-white text-[11px] px-1 text-center"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Fit</span>
        <select
          className="h-7 rounded border border-white/10 bg-white/5 text-white px-1 text-[11px] focus:outline-none"
          value={objectFit || 'cover'}
          onChange={(e) => setProp((props: any) => props.objectFit = e.target.value)}
        >
          <option value="fill">Fill</option>
          <option value="contain">Cont</option>
          <option value="cover">Cov</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Rad</span>
        <Input
          type="number"
          value={borderRadius || 0}
          onChange={(e) => setProp((props: any) => props.borderRadius = Number(e.target.value))}
          className="h-7 w-12 border-white/10 bg-white/5 text-white text-xs px-1 text-center"
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
