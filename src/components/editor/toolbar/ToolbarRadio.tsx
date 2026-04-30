'use client';

import React from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface ToolbarRadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToolbarRadioProps {
  value: string;
  onChange: (value: string) => void;
  options: ToolbarRadioOption[];
  label?: string;
}

export const ToolbarRadio: React.FC<ToolbarRadioProps> = ({
  value,
  onChange,
  options,
  label
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="min-w-0 flex-shrink-0 text-xs font-medium text-neutral-700">
          {label}
        </span>
      )}
      <RadioGroup
        value={value}
        onChange={onChange}
        className="flex flex-1 gap-0.5 rounded border border-neutral-300 p-0.5"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center rounded px-2 py-1 text-xs text-neutral-700 transition-colors',
              'data-[checked]:bg-blue-500 data-[checked]:text-white',
              'hover:bg-neutral-100'
            )}
            title={option.label}
          >
            {option.icon ?? option.label}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
};
