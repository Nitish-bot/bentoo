'use client';

import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface ToolbarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  title,
  children,
  defaultOpen = true
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border-b border-neutral-200">
          <DisclosureButton
            className={cn(
              'flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase',
              'text-neutral-600 hover:text-neutral-800'
            )}
          >
            {title}
            <ChevronRightIcon
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                open && 'rotate-90'
              )}
            />
          </DisclosureButton>
          <DisclosurePanel className="px-4 pb-3">
            <div className="space-y-2">{children}</div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
