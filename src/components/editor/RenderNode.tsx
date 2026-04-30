'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNode, useEditor } from '@craftjs/core';
import {
  ArrowUpIcon,
  TrashIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

const ROOT_NODE = 'ROOT';

export const RenderNode: React.FC<{ render: React.ReactElement }> = ({
  render
}) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, q) => ({
    isActive: q.getEvent('selected').contains(id)
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name:
      (node.data.custom as Record<string, string>)?.displayName ??
      node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent
  }));

  const indicatorRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const getRect = useCallback((domNode: HTMLElement | null) => {
    if (!domNode) return { top: 0, left: 0, width: 0, height: 0 };
    const r = domNode.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  }, []);

  const updatePosition = useCallback(() => {
    if (!dom) return;
    const rect = getRect(dom);

    const el = indicatorRef.current;
    if (el) {
      el.style.top = `${rect.top > 0 ? rect.top : rect.top + rect.height}px`;
      el.style.left = `${rect.left}px`;
    }

    const border = borderRef.current;
    if (border) {
      border.style.top = `${rect.top}px`;
      border.style.left = `${rect.left}px`;
      border.style.width = `${rect.width}px`;
      border.style.height = `${rect.height}px`;
    }
  }, [dom, getRect]);

  useEffect(() => {
    const renderer = document.querySelector('.craftjs-renderer');
    if (!renderer) return;

    const onScroll = () => updatePosition();
    renderer.addEventListener('scroll', onScroll);

    const observer = new ResizeObserver(() => updatePosition());
    if (dom) observer.observe(dom);

    return () => {
      renderer.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [dom, updatePosition]);

  useEffect(() => {
    updatePosition();
  }, [isActive, isHover, updatePosition]);

  const portalTarget =
    typeof document !== 'undefined'
      ? document.querySelector('.page-container')
      : null;

  const rect = dom ? getRect(dom) : { top: 0, left: 0, width: 0, height: 0 };

  return (
    <>
      {(isHover || isActive) && portalTarget
        ? ReactDOM.createPortal(
          <>
            <div
              ref={borderRef}
              className="pointer-events-none fixed z-[9998] border-2"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderColor: 'var(--color-accent)',
                boxShadow: 'var(--shadow-glow)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <div
              ref={indicatorRef}
              className={cn(
                'fixed z-[9999] flex h-7 items-center gap-1 rounded-full px-3 text-xs',
                '-translate-y-full',
                isActive ? 'text-white' : 'text-white'
              )}
              style={{
                top: rect.top > 0 ? rect.top : rect.top + rect.height,
                left: rect.left,
                backgroundColor: 'var(--color-accent)',
                boxShadow: 'var(--shadow-elevated)',
                fontFamily: 'var(--font-body)'
              }}
            >
              <span className="max-w-[120px] truncate font-medium">{name}</span>

              {moveable && (
                <button
                  type="button"
                  className="ml-1 cursor-move rounded-full p-0.5 transition-colors hover:bg-white/20"
                  ref={(ref) => {
                    if (ref) drag(ref);
                  }}
                  title="Move"
                >
                  <ArrowsPointingOutIcon className="h-3.5 w-3.5" />
                </button>
              )}

              {id !== ROOT_NODE && parent && (
                <button
                  type="button"
                  className="rounded-full p-0.5 transition-colors hover:bg-white/20"
                  onClick={() => actions.selectNode(parent)}
                  title="Select parent"
                >
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </button>
              )}

              {deletable && (
                <button
                  type="button"
                  className="rounded-full p-0.5 transition-colors hover:bg-red-400"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                  title="Delete"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </>,
          portalTarget
        )
        : null}
      {render}
    </>
  );
};
