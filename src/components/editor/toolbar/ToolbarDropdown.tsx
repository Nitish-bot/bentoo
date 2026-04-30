'use client';

import React from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface ToolbarDropdownOption {
  value: string;
  label: string;
}

interface ToolbarDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: ToolbarDropdownOption[];
  label?: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  value,
  onChange,
  options,
  label
}) => {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="min-w-0 flex-shrink-0 text-xs font-medium text-neutral-700">
          {label}
        </span>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative flex-1">
          <ListboxButton
            className={cn(
              'relative w-full cursor-pointer rounded border border-neutral-300 py-1 pr-7 pl-2 text-left text-xs text-neutral-800',
              'bg-white'
            )}
          >
            <span className="block truncate">{selected?.label ?? value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
              <ChevronUpDownIcon className="h-3.5 w-3.5 text-neutral-400" />
            </span>
          </ListboxButton>
          <ListboxOptions
            anchor="bottom start"
            className={cn(
              'z-50 max-h-40 w-[var(--button-width)] overflow-auto rounded border border-neutral-200 py-1 text-xs text-neutral-800 shadow-lg',
              'bg-white'
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={cn(
                  'relative cursor-pointer py-1 pr-2 pl-7 select-none',
                  'data-[focus]:bg-blue-50'
                )}
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={cn(
                        'block truncate',
                        isSelected && 'font-medium'
                      )}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-1.5">
                        <CheckIcon className="h-3.5 w-3.5 text-blue-500" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};
