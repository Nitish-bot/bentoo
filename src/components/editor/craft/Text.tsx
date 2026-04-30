'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ToolbarSection } from '../toolbar/ToolbarSection';
import { ToolbarItem } from '../toolbar/ToolbarItem';

interface TextProps {
  text?: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  lineHeight?: number;
  letterSpacing?: number;
  className?: string;
}

export const Text: React.FC<TextProps> & { craft?: unknown } = ({
  text = 'Edit me',
  tag = 'p',
  fontSize = 16,
  fontWeight = '400',
  textAlign = 'left',
  color = '#1a1a1a',
  lineHeight = 1.5,
  letterSpacing = 0,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLElement | null>(null);

  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected
  } = useNode((node) => ({ selected: node.events.selected }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const handleDoubleClick = useCallback(() => {
    if (enabled) setIsEditing(true);
  }, [enabled]);

  const handleBlur = useCallback(() => {
    const el = editableRef.current;
    if (el) {
      const newText = el.textContent ?? '';
      setProp((props: Record<string, unknown>) => {
        props.text = newText;
      });
    }
    setIsEditing(false);
  }, [setProp]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBlur();
      }
    },
    [handleBlur]
  );

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={(ref: HTMLElement | null) => {
        if (ref) {
          editableRef.current = ref;
          if (!isEditing) connect(drag(ref));
        }
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        isEditing && 'cursor-text outline-none',
        className
      )}
      style={{
        fontSize,
        fontWeight,
        textAlign,
        color,
        lineHeight,
        letterSpacing
      }}
    >
      {text}
    </Tag>
  );
};

const TextToolbar: React.FC = () => {
  return (
    <div>
      <ToolbarSection title="Content">
        <ToolbarItem propKey="text" label="Text" type="text" />
        <ToolbarItem
          propKey="tag"
          label="Tag"
          type="dropdown"
          options={[
            { value: 'p', label: 'Paragraph' },
            { value: 'h1', label: 'Heading 1' },
            { value: 'h2', label: 'Heading 2' },
            { value: 'h3', label: 'Heading 3' },
            { value: 'h4', label: 'Heading 4' },
            { value: 'h5', label: 'Heading 5' },
            { value: 'h6', label: 'Heading 6' },
            { value: 'span', label: 'Span' },
            { value: 'div', label: 'Div' }
          ]}
        />
      </ToolbarSection>

      <ToolbarSection title="Typography">
        <ToolbarItem
          propKey="fontSize"
          label="Size"
          type="slider"
          min={10}
          max={96}
        />
        <ToolbarItem
          propKey="fontWeight"
          label="Weight"
          type="dropdown"
          options={[
            { value: '300', label: 'Light' },
            { value: '400', label: 'Regular' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi Bold' },
            { value: '700', label: 'Bold' },
            { value: '800', label: 'Extra Bold' }
          ]}
        />
        <ToolbarItem
          propKey="textAlign"
          label="Align"
          type="radio"
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
            { value: 'justify', label: 'Justify' }
          ]}
        />
        <ToolbarItem
          propKey="lineHeight"
          label="Line H"
          type="slider"
          min={0.8}
          max={3}
          step={0.1}
        />
        <ToolbarItem
          propKey="letterSpacing"
          label="Spacing"
          type="slider"
          min={-2}
          max={10}
          step={0.5}
        />
      </ToolbarSection>

      <ToolbarSection title="Color">
        <ToolbarItem propKey="color" label="Color" type="color" />
      </ToolbarSection>
    </div>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Edit me',
    tag: 'p',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    color: '#1a1a1a',
    lineHeight: 1.5,
    letterSpacing: 0,
    className: ''
  },
  rules: {
    canDrag: () => true
  },
  related: {
    toolbar: TextToolbar
  }
};

export default Text;
