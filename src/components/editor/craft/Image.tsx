'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ToolbarSection } from '../toolbar/ToolbarSection';
import { ToolbarItem } from '../toolbar/ToolbarItem';

interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: number;
  className?: string;
}

const shadowMap: Record<NonNullable<ImageProps['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

export const ImageNode: React.FC<ImageProps> & { craft?: unknown } = ({
  src = 'https://picsum.photos/seed/craft/800/400',
  alt = 'Image',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  shadow = 'none',
  margin = 0,
  className = ''
}) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <img
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      src={src}
      alt={alt}
      className={cn(
        shadowMap[shadow],
        'outline outline-1 -outline-offset-1 outline-black/10',
        className
      )}
      style={{
        width,
        height,
        objectFit,
        borderRadius,
        margin,
        maxWidth: '100%'
      }}
    />
  );
};

const ImageToolbar: React.FC = () => {
  return (
    <div>
      <ToolbarSection title="Source">
        <ToolbarItem propKey="src" label="URL" type="text" />
        <ToolbarItem propKey="alt" label="Alt Text" type="text" />
      </ToolbarSection>

      <ToolbarSection title="Size">
        <ToolbarItem propKey="width" label="Width" type="text" />
        <ToolbarItem propKey="height" label="Height" type="text" />
        <ToolbarItem
          propKey="objectFit"
          label="Fit"
          type="dropdown"
          options={[
            { value: 'cover', label: 'Cover' },
            { value: 'contain', label: 'Contain' },
            { value: 'fill', label: 'Fill' },
            { value: 'none', label: 'None' },
            { value: 'scale-down', label: 'Scale Down' }
          ]}
        />
      </ToolbarSection>

      <ToolbarSection title="Appearance">
        <ToolbarItem
          propKey="borderRadius"
          label="Radius"
          type="slider"
          min={0}
          max={48}
        />
        <ToolbarItem
          propKey="margin"
          label="Margin"
          type="slider"
          min={0}
          max={64}
        />
        <ToolbarItem
          propKey="shadow"
          label="Shadow"
          type="dropdown"
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]}
        />
      </ToolbarSection>
    </div>
  );
};

ImageNode.craft = {
  displayName: 'Image',
  props: {
    src: 'https://picsum.photos/seed/craft/800/400',
    alt: 'Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    shadow: 'none',
    margin: 0,
    className: ''
  },
  rules: {
    canDrag: () => true
  },
  related: {
    toolbar: ImageToolbar
  }
};

export default ImageNode;
