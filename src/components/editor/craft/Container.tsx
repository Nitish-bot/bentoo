'use client';

import React from 'react';
import { Element, useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ToolbarSection } from '../toolbar/ToolbarSection';
import { ToolbarItem } from '../toolbar/ToolbarItem';
import { ToolbarSpacingGroup } from '../toolbar/ToolbarSpacingGroup';
import { Resizer } from './Resizer';

interface ContainerProps {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  width?: string;
  height?: string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  direction?: 'row' | 'col';
  gap?: number;
  className?: string;
  children?: React.ReactNode;
}

const alignMap: Record<NonNullable<ContainerProps['alignItems']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
};

const justifyMap: Record<
  NonNullable<ContainerProps['justifyContent']>,
  string
> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around'
};

const shadowMap: Record<NonNullable<ContainerProps['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

export const Container: React.FC<ContainerProps> & { craft?: unknown } = ({
  paddingTop = 16,
  paddingRight = 16,
  paddingBottom = 16,
  paddingLeft = 16,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  backgroundColor = '#ffffff',
  borderRadius = 0,
  borderWidth = 0,
  borderColor = 'var(--color-border)',
  shadow = 'none',
  width = 'auto',
  height = 'auto',
  alignItems = 'stretch',
  justifyContent = 'start',
  direction = 'col',
  gap = 0,
  className = '',
  children
}) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={cn(
        'relative flex min-h-[40px]',
        direction === 'row' ? 'flex-row' : 'flex-col',
        alignMap[alignItems],
        justifyMap[justifyContent],
        shadowMap[shadow],
        className
      )}
      style={{
        backgroundColor,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        borderRadius: borderRadius > 0 ? borderRadius : undefined,
        borderWidth: borderWidth > 0 ? borderWidth : undefined,
        borderColor: borderWidth > 0 ? borderColor : undefined,
        borderStyle: borderWidth > 0 ? 'solid' : undefined,
        width: width !== 'auto' ? width : undefined,
        height: height !== 'auto' ? height : undefined,
        gap
      }}
    >
      <Resizer>{children}</Resizer>
    </div>
  );
};

const ContainerToolbar: React.FC = () => {
  return (
    <div>
      <ToolbarSection title="Layout">
        <ToolbarItem
          propKey="direction"
          label="Direction"
          type="radio"
          options={[
            { value: 'col', label: 'Column' },
            { value: 'row', label: 'Row' }
          ]}
        />
        <ToolbarItem
          propKey="alignItems"
          label="Align"
          type="dropdown"
          options={[
            { value: 'start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'End' },
            { value: 'stretch', label: 'Stretch' }
          ]}
        />
        <ToolbarItem
          propKey="justifyContent"
          label="Justify"
          type="dropdown"
          options={[
            { value: 'start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'End' },
            { value: 'between', label: 'Between' },
            { value: 'around', label: 'Around' }
          ]}
        />
        <ToolbarItem propKey="gap" label="Gap" type="slider" min={0} max={64} />
      </ToolbarSection>

      <ToolbarSection title="Spacing">
        <ToolbarSpacingGroup label="Padding" prefix="padding" max={64} />
        <ToolbarSpacingGroup label="Margin" prefix="margin" max={64} />
      </ToolbarSection>

      <ToolbarSection title="Size">
        <ToolbarItem propKey="width" label="Width" type="text" />
        <ToolbarItem propKey="height" label="Height" type="text" />
      </ToolbarSection>

      <ToolbarSection title="Appearance">
        <ToolbarItem
          propKey="backgroundColor"
          label="Background"
          type="color"
        />
        <ToolbarItem
          propKey="borderRadius"
          label="Radius"
          type="slider"
          min={0}
          max={48}
        />
        <ToolbarItem
          propKey="borderWidth"
          label="Border"
          type="slider"
          min={0}
          max={8}
        />
        <ToolbarItem propKey="borderColor" label="Border Color" type="color" />
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

Container.craft = {
  displayName: 'Container',
  props: {
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'var(--color-border)',
    shadow: 'none',
    width: 'auto',
    height: 'auto',
    alignItems: 'stretch',
    justifyContent: 'start',
    direction: 'col',
    gap: 0,
    className: ''
  },
  rules: {
    canDrag: () => true,
    canDrop: (target: unknown) => !!target
  },
  related: {
    toolbar: ContainerToolbar
  }
};

export const ContainerCanvas: React.FC<React.PropsWithChildren> = ({
  children
}) => (
  <Element is={Container} canvas>
    {children}
  </Element>
);

export default Container;
