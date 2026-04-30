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
        <span
          className="min-w-0 flex-shrink-0 text-xs font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
      )}
      <RadioGroup
        value={value}
        onChange={onChange}
        className="flex flex-1 gap-0.5 rounded-lg p-0.5"
        style={{
          backgroundColor: 'var(--color-bg-surface-active)',
          boxShadow: 'var(--shadow-border)'
        }}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className={cn(
              'relative flex flex-1 cursor-pointer items-center justify-center rounded-md px-2 py-1 text-xs transition-all duration-150',
              'text-[var(--color-text-secondary)] data-[checked]:text-white'
            )}
            title={option.label}
          >
            {({ checked }) => (
              <>
                <span
                  className={cn(
                    'absolute inset-0 rounded-md transition-colors duration-150',
                    checked ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
                <span className={cn('relative z-10', checked && 'font-medium')}>
                  {option.icon ?? option.label}
                </span>
              </>
            )}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
};
