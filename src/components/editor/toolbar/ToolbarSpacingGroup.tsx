'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface ToolbarSpacingGroupProps {
  label: string;
  prefix: string;
  max?: number;
}

const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const;
const SIDE_LABELS: Record<(typeof SIDES)[number], string> = {
  Top: 'T',
  Right: 'R',
  Bottom: 'B',
  Left: 'L'
};

interface SpacingInputProps {
  side: (typeof SIDES)[number];
  propKey: string;
  max: number;
}

const SpacingInput: React.FC<SpacingInputProps> = ({ side, propKey, max }) => {
  const {
    actions: { setProp },
    value
  } = useNode((node) => ({
    value: (node.data.props as Record<string, number>)[propKey] ?? 0
  }));

  const [internal, setInternal] = useState(String(value));

  useEffect(() => {
    setInternal(String(value));
  }, [value]);

  const commit = useCallback(
    (v: string) => {
      const num = Math.max(0, Math.min(max, Number(v) || 0));
      setInternal(String(num));
      setProp((props: Record<string, unknown>) => {
        props[propKey] = num;
      });
    },
    [max, propKey, setProp]
  );

  return (
    <div className="flex items-center gap-1">
      <span
        className="w-3 text-[10px] font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {SIDE_LABELS[side]}
      </span>
      <input
        type="number"
        min={0}
        max={max}
        value={internal}
        onChange={(e) => {
          setInternal(e.target.value);
          commit(e.target.value);
        }}
        onBlur={() => commit(internal)}
        className={cn(
          'w-12 rounded-lg px-1.5 py-0.5 text-center text-xs transition-[box-shadow] duration-150',
          'focus:outline-none focus:ring-2'
        )}
        style={{
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-surface)',
          boxShadow: 'var(--shadow-border)',
          '--tw-ring-color': 'var(--color-accent-subtle)'
        } as React.CSSProperties}
      />
    </div>
  );
};

export const ToolbarSpacingGroup: React.FC<ToolbarSpacingGroupProps> = ({
  label,
  prefix,
  max = 64
}) => {
  return (
    <div className="space-y-1.5">
      <span
        className="text-xs font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <SpacingInput side="Top" propKey={`${prefix}Top`} max={max} />
        <div className="flex items-center gap-3">
          <SpacingInput side="Left" propKey={`${prefix}Left`} max={max} />
          <div
            className="h-5 w-5 rounded-md border border-dashed"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <SpacingInput side="Right" propKey={`${prefix}Right`} max={max} />
        </div>
        <SpacingInput side="Bottom" propKey={`${prefix}Bottom`} max={max} />
      </div>
    </div>
  );
};
