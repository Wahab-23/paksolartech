import React from 'react';
import { useNode } from '@craftjs/core';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const VideoSettings = () => {
  const { src, width, height, borderRadius, actions: { setProp } } = useNode((node) => ({
    src: node.data.props.src,
    width: node.data.props.width,
    height: node.data.props.height,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>YouTube / Vimeo Embed URL</Label>
        <Input 
          value={src || ''} 
          onChange={(e) => setProp((props: any) => props.src = e.target.value)} 
          placeholder="https://www.youtube.com/embed/..."
        />
        <p className="text-xs text-muted-foreground">Make sure to use the embed URL, not the watch URL.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Width</Label>
          <Input 
            value={width || ''} 
            onChange={(e) => setProp((props: any) => props.width = e.target.value)} 
            placeholder="100% or 560px"
          />
        </div>
        <div className="grid gap-2">
          <Label>Height</Label>
          <Input 
            value={height || ''} 
            onChange={(e) => setProp((props: any) => props.height = e.target.value)} 
            placeholder="315px"
          />
        </div>
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

export const Video = ({ src, width, height, borderRadius }: any) => {
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
        <iframe
          width="100%"
          height={typeof height === 'number' ? `${height}px` : height || '315px'}
          src={src}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: `${borderRadius}px`, display: 'block', backgroundColor: '#000' }}
        />
      ) : (
        <div 
          style={{
            width: '100%',
            height: '315px',
            backgroundColor: '#1f2937', // gray-800
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af', // gray-400
            borderRadius: `${borderRadius}px`,
          }}
        >
          No Video Provided (Please add an embed URL)
        </div>
      )}
    </div>
  );
};

Video.craft = {
  displayName: 'Video',
  props: {
    src: '',
    width: '100%',
    height: '315px',
    borderRadius: 12,
  },
  related: {
    settings: VideoSettings,
  },
};
