'use client';

import React from 'react';
import { useEditor, useNode } from '@craftjs/core';

export const SettingsPanel: React.FC = () => {
  const { selected, actions } = useEditor((state, query) => {
    const currentlySelected = state.events.selected;
    let selectedNodeId: string | null = null;
    if (currentlySelected && currentlySelected.size > 0) {
      selectedNodeId = Array.from(currentlySelected)[0] ?? null;
    }

    let settings: React.ReactNode = null;
    if (selectedNodeId) {
      const node = state.nodes[selectedNodeId];
      const relatedSettings = node?.related?.settings as
        | React.ComponentType
        | undefined;
      if (relatedSettings) {
        settings = React.createElement(relatedSettings);
      }
    }

    return {
      selectedNodeId,
      settings,
      enabled: state.options.enabled
    } as any;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-3 py-2 text-sm font-medium">Settings</div>
      <div className="flex-1 overflow-auto">
        {selected.settings ? (
          <div>{selected.settings}</div>
        ) : (
          <div className="p-3 text-sm text-neutral-500">
            Select an element to edit its settings.
          </div>
        )}
      </div>
      <div className="border-t p-2">
        <button
          className="w-full rounded-md border px-2 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          onClick={() => actions.clearEvents()}
        >
          Deselect
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
