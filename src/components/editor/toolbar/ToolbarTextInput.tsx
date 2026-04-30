'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ToolbarTextInputProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'color';
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
}

export const ToolbarTextInput: React.FC<ToolbarTextInputProps> = ({
  value,
  onChange,
  type = 'text',
  label,
  placeholder,
  min,
  max,
  step = 1,
  showSlider = false
}) => {
  const [internalValue, setInternalValue] = useState(String(value));

  useEffect(() => {
    setInternalValue(String(value));
  }, [value]);

  const handleChange = useCallback(
    (newVal: string) => {
      setInternalValue(newVal);
      onChange(newVal);
    },
    [onChange]
  );

  if (type === 'color') {
    return (
      <div className="flex items-center gap-2">
        {label && (
          <span className="min-w-0 flex-shrink-0 text-xs font-medium text-neutral-700">
            {label}
          </span>
        )}
        <div className="flex flex-1 items-center gap-1.5">
          <input
            type="color"
            value={internalValue}
            onChange={(e) => handleChange(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded border border-neutral-300"
          />
          <input
            type="text"
            value={internalValue}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(
              'w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800',
              'bg-white'
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="min-w-0 flex-shrink-0 text-xs font-medium text-neutral-700">
          {label}
        </span>
      )}
      <div className="flex flex-1 items-center gap-1.5">
        {showSlider && type === 'number' && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={internalValue}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1"
          />
        )}
        <input
          type={type}
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            'rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-800',
            'bg-white',
            showSlider ? 'w-14 text-center' : 'w-full'
          )}
        />
      </div>
    </div>
  );
};
