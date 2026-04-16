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
    <div className="flex items-center gap-6 overflow-visible">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-white/40 uppercase">Src</span>
        <Input 
          value={src || ''} 
          onChange={(e) => setProp((props: any) => props.src = e.target.value)} 
          placeholder="Embed URL"
          className="h-7 w-48 border-white/10 bg-white/5 text-white text-[11px] px-1"
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
