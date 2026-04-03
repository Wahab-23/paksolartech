import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { Type, Layout, Image as ImageIcon, Youtube, MousePointerClick } from 'lucide-react';
import { Text, Container, Image, Video, Button as CustomButton } from '../selectors';

export const Toolbox = () => {
  const { connectors: { create } } = useEditor();

  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Drag to add</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="flex flex-col h-auto py-3 px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
          ref={(ref: any) => create(ref, <Element canvas is={Container} padding={20} />)}
        >
          <Layout className="h-5 w-5" />
          <span className="text-xs">Container</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col h-auto py-3 px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
          ref={(ref: any) => create(ref, <Text text="New Text Block" fontSize={16} />)}
        >
          <Type className="h-5 w-5" />
          <span className="text-xs">Text</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col h-auto py-3 px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
          ref={(ref: any) => create(ref, <Image />)}
        >
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs">Image</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col h-auto py-3 px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
          ref={(ref: any) => create(ref, <Video />)}
        >
          <Youtube className="h-5 w-5" />
          <span className="text-xs">Video</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col h-auto py-3 px-2 gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors col-span-2"
          ref={(ref: any) => create(ref, <CustomButton text="Click Here" />)}
        >
          <MousePointerClick className="h-5 w-5" />
          <span className="text-xs">Button</span>
        </Button>
      </div>
    </div>
  );
};
