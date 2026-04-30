'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { ToolbarTextInput } from './ToolbarTextInput';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarRadio } from './ToolbarRadio';
import { cn } from '@/lib/utils';

type ToolbarItemType =
  | 'text'
  | 'number'
  | 'color'
  | 'slider'
  | 'dropdown'
  | 'radio'
  | 'switch';

interface ToolbarItemBaseProps {
  propKey: string;
  label: string;
  index?: number;
}

interface ToolbarItemTextProps extends ToolbarItemBaseProps {
  type: 'text' | 'number' | 'color';
  min?: number;
  max?: number;
  step?: number;
}

interface ToolbarItemSliderProps extends ToolbarItemBaseProps {
  type: 'slider';
  min?: number;
  max?: number;
  step?: number;
}

interface ToolbarItemDropdownProps extends ToolbarItemBaseProps {
  type: 'dropdown';
  options: { value: string; label: string }[];
}

interface ToolbarItemRadioProps extends ToolbarItemBaseProps {
  type: 'radio';
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

interface ToolbarItemSwitchProps extends ToolbarItemBaseProps {
  type: 'switch';
}

type ToolbarItemProps =
  | ToolbarItemTextProps
  | ToolbarItemSliderProps
  | ToolbarItemDropdownProps
  | ToolbarItemRadioProps
  | ToolbarItemSwitchProps;

export const ToolbarItem: React.FC<ToolbarItemProps> = (props) => {
  const { propKey, label, type, index } = props;

  const {
    actions: { setProp },
    propValue
  } = useNode((node) => ({
    propValue:
      index !== undefined
        ? (node.data.props as Record<string, unknown[]>)[propKey]?.[index]
        : (node.data.props as Record<string, unknown>)[propKey]
  }));

  const value = propValue ?? '';

  const handleChange = (newValue: string) => {
    setProp((nodeProps: Record<string, unknown>) => {
      if (index !== undefined) {
        const arr = [...((nodeProps[propKey] as unknown[]) ?? [])];
        arr[index] =
          type === 'number' || type === 'slider' ? Number(newValue) : newValue;
        nodeProps[propKey] = arr;
      } else {
        nodeProps[propKey] =
          type === 'number' || type === 'slider' ? Number(newValue) : newValue;
      }
    });
  };

  switch (type) {
  case 'text':
  case 'number':
  case 'color':
    return (
      <ToolbarTextInput
        label={label}
        type={type}
        value={String(value)}
        onChange={handleChange}
        min={'min' in props ? props.min : undefined}
        max={'max' in props ? props.max : undefined}
        step={'step' in props ? props.step : undefined}
      />
    );
  case 'slider':
    return (
      <ToolbarTextInput
        label={label}
        type="number"
        value={String(value)}
        onChange={handleChange}
        showSlider
        min={'min' in props ? props.min : 0}
        max={'max' in props ? props.max : 100}
        step={'step' in props ? props.step : 1}
      />
    );
  case 'dropdown':
    return (
      <ToolbarDropdown
        label={label}
        value={String(value)}
        onChange={handleChange}
        options={'options' in props ? props.options : []}
      />
    );
  case 'radio':
    return (
      <ToolbarRadio
        label={label}
        value={String(value)}
        onChange={handleChange}
        options={'options' in props ? props.options : []}
      />
    );
  case 'switch':
    return (
      <div className="flex items-center gap-2">
        <span
          className="min-w-0 flex-shrink-0 text-xs font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => handleChange(value ? '' : 'true')}
          className={cn(
            'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors'
          )}
          style={{
            backgroundColor: value ? 'var(--color-accent)' : 'var(--color-border-hover)'
          }}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 rounded-full bg-white transition-transform',
              value ? 'translate-x-4' : 'translate-x-0'
            )}
            style={{ boxShadow: 'var(--shadow-border)' }}
          />
        </button>
      </div>
    );
  default:
    return null;
  }
};
