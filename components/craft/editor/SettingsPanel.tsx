import React from 'react';
import { useEditor } from '@craftjs/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export const SettingsPanel = () => {
  const { actions, selected, currentNodeId } = useEditor((state) => {
    const currentNodeId = state.events.selected.values().next().value;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: currentNodeId !== 'ROOT',
      };
    }

    return {
      selected,
      currentNodeId
    };
  });

  if (!selected) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <p className="text-sm">Select an element on the canvas to customize its settings.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Selected</h3>
            <Badge variant="secondary">{selected.name}</Badge>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {selected.settings ? (
          React.createElement(selected.settings)
        ) : (
          <p className="text-sm text-muted-foreground text-center mt-4">This element has no accessible settings.</p>
        )}
      </div>
      {selected.isDeletable && (
        <div className="p-4 border-t border-border/50 bg-muted/20">
          <Button 
            variant="destructive" 
            className="w-full gap-2" 
            size="sm"
            onClick={() => {
              if (currentNodeId) {
                actions.delete(currentNodeId);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Element
          </Button>
        </div>
      )}
    </div>
  );
};
