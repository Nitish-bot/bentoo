'use client';

import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  height?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  height = 'auto'
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border-b border-neutral-200">
          <DisclosureButton
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium',
              'text-neutral-700 hover:bg-neutral-50'
            )}
          >
            {icon && <span className="h-4 w-4 flex-shrink-0">{icon}</span>}
            <span className="flex-1">{title}</span>
            <ChevronRightIcon
              className={cn(
                'h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200',
                open && 'rotate-90'
              )}
            />
          </DisclosureButton>
          <DisclosurePanel
            className="overflow-auto"
            style={{ maxHeight: height !== 'auto' ? height : undefined }}
          >
            {children}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
