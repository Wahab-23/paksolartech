import React from 'react';
import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { Save, Undo, Redo } from 'lucide-react';

export const EditorTopbar = () => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 border-b border-border/50">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          type="button"
          className="h-8 w-8 p-0"
          onClick={() => actions.history.undo()} 
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          type="button"
          className="h-8 w-8 p-0"
          onClick={() => actions.history.redo()} 
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-2">Craft.js Editor</span>
      </div>
    </div>
  );
};
