'use client';

import React, { useState, useCallback } from 'react';
import { useEditor } from '@craftjs/core';
import {
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface LayerNodeProps {
  nodeId: string;
  depth: number;
}

const LayerNode: React.FC<LayerNodeProps> = ({ nodeId, depth }) => {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);

  const { actions, node, selected, hovered, childNodes, hidden } = useEditor(
    (state, query) => {
      const nodeState = state.nodes[nodeId];
      if (!nodeState)
        return {
          node: null,
          selected: false,
          hovered: false,
          childNodes: [],
          hidden: false
        };

      const selectedIds = state.events.selected;
      const isSelected = selectedIds ? selectedIds.has(nodeId) : false;
      const hoveredId = state.events.hovered;
      const isHovered = hoveredId ? hoveredId.has(nodeId) : false;

      const linkedNodes = nodeState.data.linkedNodes
        ? Object.values(nodeState.data.linkedNodes)
        : [];
      const children = nodeState.data.nodes ?? [];

      return {
        node: nodeState,
        selected: isSelected,
        hovered: isHovered,
        childNodes: [...children, ...linkedNodes],
        hidden: !!nodeState.data.hidden
      };
    }
  );

  const displayName = node
    ? ((node.data.custom as Record<string, string>)?.displayName ??
      node.data.displayName)
    : 'Unknown';

  const handleSelect = useCallback(() => {
    actions.selectNode(nodeId);
  }, [actions, nodeId]);

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleRename = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        const newName = (e.target as HTMLInputElement).value.trim();
        if (newName && e.key === 'Enter') {
          actions.setCustom(nodeId, (custom: Record<string, string>) => {
            custom.displayName = newName;
          });
        }
        setEditing(false);
      }
    },
    [actions, nodeId]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.target.value.trim();
      if (newName) {
        actions.setCustom(nodeId, (custom: Record<string, string>) => {
          custom.displayName = newName;
        });
      }
      setEditing(false);
    },
    [actions, nodeId]
  );

  const toggleHidden = useCallback(() => {
    actions.setHidden(nodeId, !hidden);
  }, [actions, nodeId, hidden]);

  if (!node) return null;

  const hasChildren = childNodes.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 border-l-2 py-1 pr-2 text-xs',
          'transition-colors duration-150'
        )}
        style={{
          paddingLeft: depth * 16 + 4,
          borderLeftColor: selected ? 'var(--color-accent)' : 'transparent',
          backgroundColor: selected
            ? 'var(--color-accent-subtle)'
            : hovered && !selected
              ? 'var(--color-bg-surface-hover)'
              : 'transparent',
          color: selected ? 'var(--color-accent)' : 'var(--color-text-primary)'
        }}
        onClick={handleSelect}
        onDoubleClick={handleDoubleClick}
      >
        {hasChildren ? (
          <button
            type="button"
            className="flex-shrink-0 rounded p-0.5 transition-colors duration-150"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            <ChevronRightIcon
              className={cn(
                'h-3 w-3 transition-transform duration-200',
                expanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {editing ? (
          <input
            autoFocus
            defaultValue={displayName}
            className="flex-1 rounded-lg px-1 py-0.5 text-xs focus:outline-none focus:ring-2"
            style={{
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-surface)',
              boxShadow: 'var(--shadow-border)',
              '--tw-ring-color': 'var(--color-accent-subtle)'
            } as React.CSSProperties}
            onKeyDown={handleRename}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate">{displayName}</span>
        )}

        <button
          type="button"
          className="flex-shrink-0 rounded p-0.5 opacity-0 transition-all duration-150 group-hover:opacity-100"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={(e) => {
            e.stopPropagation();
            toggleHidden();
          }}
          title={hidden ? 'Show' : 'Hide'}
        >
          {hidden ? (
            <EyeSlashIcon className="h-3 w-3" />
          ) : (
            <EyeIcon className="h-3 w-3" />
          )}
        </button>
      </div>

      {hasChildren && expanded && (
        <div>
          {childNodes.map((childId) => (
            <LayerNode key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Layers: React.FC = () => {
  return (
    <div className="py-1">
      <LayerNode nodeId="ROOT" depth={0} />
    </div>
  );
};
