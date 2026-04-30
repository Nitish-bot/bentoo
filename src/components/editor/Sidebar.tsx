'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import {
  AdjustmentsHorizontalIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Layers } from './Layers';
import { SidebarItem } from './SidebarItem';
import Tabs from '@/components/ui/Tabs';

const CustomizePanel: React.FC = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelected = query.getEvent('selected').first();
    return {
      active: currentlySelected,
      related: currentlySelected
        ? state.nodes[currentlySelected]?.related
        : null
    };
  });

  return (
    <div className="flex-1 overflow-auto">
      {active && related?.toolbar ? (
        React.createElement(related.toolbar as React.ComponentType)
      ) : (
        <div className="p-4 text-center text-xs text-text-muted">
          <p className="font-medium text-text-secondary">Click on a component to start editing.</p>
          <p className="mt-1 text-pretty">
            You could also double click on the layers below to edit their names,
            like in Photoshop
          </p>
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div
      className="flex h-full w-72 flex-col border-l"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)'
      }}
    >
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger>
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Customize
          </Tabs.Trigger>
          <Tabs.Trigger>
            <Square3Stack3DIcon className="h-4 w-4" />
            Layers
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Content>
            <SidebarItem title="Customize">
              <CustomizePanel />
            </SidebarItem>
          </Tabs.Content>
          <Tabs.Content>
            <SidebarItem title="Layers" height="100%">
              <Layers />
            </SidebarItem>
          </Tabs.Content>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};
