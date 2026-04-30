'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { enabled, canUndo, canRedo, actions, query } = useEditor(
    (state, q) => ({
      enabled: state.options.enabled,
      canUndo: q.history.canUndo(),
      canRedo: q.history.canRedo()
    })
  );

  const handleSave = () => {
    const json = query.serialize();
    try {
      localStorage.setItem('craft:bentoo:json', json);
    } catch {
      /* noop */
    }
  };

  const handleLoad = () => {
    try {
      const json = localStorage.getItem('craft:bentoo:json');
      if (json) {
        actions.deserialize(json);
      }
    } catch {
      /* noop */
    }
  };

  return (
    <div
      className="flex h-12 items-center justify-between px-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-border)'
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Bentoo Editor
        </span>

        {enabled && (
          <div
            className="flex items-center gap-1 pl-3"
            style={{ borderLeft: '1px solid var(--color-border)' }}
          >
            <HeaderButton
              onClick={() => actions.history.undo()}
              disabled={!canUndo}
              title="Undo"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </HeaderButton>
            <HeaderButton
              onClick={() => actions.history.redo()}
              disabled={!canRedo}
              title="Redo"
            >
              <ArrowUturnRightIcon className="h-4 w-4" />
            </HeaderButton>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {enabled && (
          <>
            <HeaderButton onClick={handleLoad} title="Load">
              <ArrowUpTrayIcon className="h-4 w-4" />
              <span>Load</span>
            </HeaderButton>
            <HeaderButton onClick={handleSave} title="Save">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Save</span>
            </HeaderButton>
          </>
        )}
        <button
          type="button"
          onClick={() =>
            actions.setOptions((options) => (options.enabled = !enabled))
          }
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
            'transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96]',
            enabled
              ? 'text-white'
              : 'text-white'
          )}
          style={{
            backgroundColor: enabled ? 'var(--color-accent)' : 'var(--color-accent-hover)',
            boxShadow: enabled ? 'var(--shadow-border-hover)' : 'var(--shadow-border)'
          }}
        >
          {enabled ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Finish Editing
            </>
          ) : (
            <>
              <PencilSquareIcon className="h-4 w-4" />
              Edit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const HeaderButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium',
      'transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96]',
      disabled && 'cursor-not-allowed opacity-40'
    )}
    style={{
      color: 'var(--color-text-secondary)',
      backgroundColor: 'var(--color-bg-surface)',
      boxShadow: 'var(--shadow-border)'
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-border-hover)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
      }
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-border)';
      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
    }}
  >
    {children}
  </button>
);
