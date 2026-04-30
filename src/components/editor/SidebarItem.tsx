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
        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
          <DisclosureButton
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium',
              'transition-colors duration-150'
            )}
            style={{
              color: 'var(--color-text-secondary)'
            }}
          >
            {icon && <span className="h-4 w-4 flex-shrink-0">{icon}</span>}
            <span className="flex-1">{title}</span>
            <ChevronRightIcon
              className={cn(
                'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                open && 'rotate-90'
              )}
              style={{ color: 'var(--color-text-muted)' }}
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
