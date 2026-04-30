'use client';

import React, { useCallback, useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';

type Corner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

const HANDLE_POSITIONS: Record<Corner, string> = {
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize',
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize'
};

interface ResizerProps {
  children: React.ReactNode;
}

export const Resizer: React.FC<ResizerProps> = ({ children }) => {
  const {
    id,
    actions: { setProp },
    dom,
    selected
  } = useNode((node) => ({
    dom: node.dom,
    selected: node.events.selected
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const dragState = useRef<{
    corner: Corner;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, corner: Corner) => {
      e.stopPropagation();
      e.preventDefault();

      if (!dom) return;

      const rect = dom.getBoundingClientRect();
      dragState.current = {
        corner,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragState.current) return;

        const { corner: c, startX, startY, startWidth, startHeight } =
          dragState.current;
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        setProp((props: Record<string, unknown>) => {
          const expandRight = c === 'top-right' || c === 'bottom-right';
          const expandDown = c === 'bottom-left' || c === 'bottom-right';

          props.width = `${Math.max(40, startWidth + (expandRight ? deltaX : -deltaX))}px`;
          props.height = `${Math.max(40, startHeight + (expandDown ? deltaY : -deltaY))}px`;
        });
      };

      const handleMouseUp = () => {
        dragState.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dom, setProp]
  );

  const showHandles = enabled && selected && id !== 'ROOT';

  return (
    <>
      {children}
      {showHandles &&
        (Object.keys(HANDLE_POSITIONS) as Corner[]).map((corner) => (
          <div
            key={corner}
            className={cn(
              'absolute z-40 h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-white',
              HANDLE_POSITIONS[corner]
            )}
            onMouseDown={(e) => handleMouseDown(e, corner)}
          />
        ))}
    </>
  );
};
