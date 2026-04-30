'use client';

import React from 'react';
import { Element, useEditor } from '@craftjs/core';
import {
  Bars3BottomLeftIcon,
  CursorArrowRaysIcon,
  PhotoIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Container from './craft/Container';
import Text from './craft/Text';
import ImageNode from './craft/Image';
import Button from './craft/Button';

interface ToolboxItemProps {
  label: string;
  icon: React.ReactNode;
  onRef: (ref: HTMLButtonElement | null) => void;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ label, icon, onRef }) => (
  <button
    type="button"
    ref={onRef}
    className={cn(
      'flex cursor-move flex-col items-center justify-center gap-1.5 rounded-lg p-3',
      'transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96]'
    )}
    title={label}
    style={{
      color: 'var(--color-text-muted)',
      backgroundColor: 'var(--color-bg-surface)',
      boxShadow: 'var(--shadow-border)'
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-border-hover)';
      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-border)';
      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
    }}
  >
    <span className="h-6 w-6">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export const Toolbox: React.FC = () => {
  const {
    connectors: { create }
  } = useEditor();

  return (
    <div
      className="flex w-20 flex-col border-r"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="px-2 py-3">
        <p
          className="mb-2 text-center text-[10px] font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Drag
        </p>
        <div className="flex flex-col gap-2">
          <ToolboxItem
            label="Container"
            icon={<RectangleGroupIcon />}
            onRef={(ref) => {
              if (ref) {
                create(
                  ref,
                  <Element
                    is={Container}
                    paddingTop={16}
                    paddingRight={16}
                    paddingBottom={16}
                    paddingLeft={16}
                    canvas
                  />
                );
              }
            }}
          />
          <ToolboxItem
            label="Text"
            icon={<Bars3BottomLeftIcon />}
            onRef={(ref) => {
              if (ref) {
                create(ref, <Text text="New text" />);
              }
            }}
          />
          <ToolboxItem
            label="Image"
            icon={<PhotoIcon />}
            onRef={(ref) => {
              if (ref) {
                create(ref, <ImageNode />);
              }
            }}
          />
          <ToolboxItem
            label="Button"
            icon={<CursorArrowRaysIcon />}
            onRef={(ref) => {
              if (ref) {
                create(ref, <Button />);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
