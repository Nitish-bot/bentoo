'use client';

import React from 'react';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react';
import { cn } from '@/lib/utils';

interface TabsProps {
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> & {
  List: typeof TabListComponent;
  Trigger: typeof TabTrigger;
  Panels: typeof TabPanelsComponent;
  Content: typeof TabContent;
} = ({ children, defaultIndex, onChange }) => {
  return (
    <TabGroup defaultIndex={defaultIndex} onChange={onChange}>
      {children}
    </TabGroup>
  );
};

const TabListComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <TabList
      className={cn(
        'flex border-b',
        className
      )}
      style={{ borderColor: 'var(--color-border)' }}
    >
      {children}
    </TabList>
  );
};

const TabTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Tab
      className={cn(
        'relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium outline-none',
        'text-text-secondary hover:text-text-primary',
        'transition-colors duration-150 ease-out',
        'data-[selected]:text-accent',
        className
      )}
    >
      {({ selected }) => (
        <>
          <span className="relative z-10">{children}</span>
          {selected && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          )}
        </>
      )}
    </Tab>
  );
};

const TabPanelsComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <TabPanels className={cn('flex min-h-0 flex-1 flex-col overflow-auto', className)}>
      {children}
    </TabPanels>
  );
};

const TabContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <TabPanel className={cn('flex flex-1 flex-col', className)}>
      {children}
    </TabPanel>
  );
};

Tabs.List = TabListComponent;
Tabs.Trigger = TabTrigger;
Tabs.Panels = TabPanelsComponent;
Tabs.Content = TabContent;

export default Tabs;
