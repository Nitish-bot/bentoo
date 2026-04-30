'use client';

import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ToolbarSection } from '../toolbar/ToolbarSection';
import { ToolbarItem } from '../toolbar/ToolbarItem';

interface ButtonProps {
  label?: string;
  href?: string;
  target?: '_self' | '_blank';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const sizeMap: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'hover:opacity-90',
  secondary: 'hover:opacity-90',
  ghost: 'hover:opacity-80'
};

export const Button: React.FC<ButtonProps> & { craft?: unknown } = ({
  label = 'Read more',
  href = '#',
  target = '_self',
  variant = 'primary',
  size = 'md',
  borderRadius = 8,
  backgroundColor,
  textColor,
  className = ''
}) => {
  const {
    connectors: { connect, drag }
  } = useNode();
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const useCustomColors = !!backgroundColor;

  const variantStyle = (() => {
    if (useCustomColors) return {};
    switch (variant) {
      case 'primary':
        return { backgroundColor: 'var(--color-accent)', color: '#ffffff' };
      case 'secondary':
        return { backgroundColor: 'var(--color-bg-surface-active)', color: 'var(--color-text-primary)' };
      case 'ghost':
        return { backgroundColor: 'transparent', color: 'var(--color-text-primary)', boxShadow: 'var(--shadow-border)' };
      default:
        return {};
    }
  })();

  return (
    <a
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={(e) => {
        if (enabled) e.preventDefault();
      }}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96]',
        sizeMap[size],
        !useCustomColors && variantClasses[variant],
        className
      )}
      style={{
        borderRadius,
        ...(useCustomColors && {
          backgroundColor,
          color: textColor ?? '#ffffff'
        }),
        ...(!useCustomColors && variantStyle)
      }}
    >
      {label}
    </a>
  );
};

const ButtonToolbar: React.FC = () => {
  return (
    <div>
      <ToolbarSection title="Content">
        <ToolbarItem propKey="label" label="Label" type="text" />
        <ToolbarItem propKey="href" label="Link" type="text" />
        <ToolbarItem
          propKey="target"
          label="Target"
          type="dropdown"
          options={[
            { value: '_self', label: 'Self' },
            { value: '_blank', label: 'Blank' }
          ]}
        />
      </ToolbarSection>

      <ToolbarSection title="Style">
        <ToolbarItem
          propKey="variant"
          label="Variant"
          type="radio"
          options={[
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'ghost', label: 'Ghost' }
          ]}
        />
        <ToolbarItem
          propKey="size"
          label="Size"
          type="radio"
          options={[
            { value: 'sm', label: 'S' },
            { value: 'md', label: 'M' },
            { value: 'lg', label: 'L' }
          ]}
        />
        <ToolbarItem
          propKey="borderRadius"
          label="Radius"
          type="slider"
          min={0}
          max={24}
        />
      </ToolbarSection>

      <ToolbarSection title="Custom Colors" defaultOpen={false}>
        <ToolbarItem
          propKey="backgroundColor"
          label="Background"
          type="color"
        />
        <ToolbarItem propKey="textColor" label="Text" type="color" />
      </ToolbarSection>
    </div>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    label: 'Read more',
    href: '#',
    target: '_self',
    variant: 'primary',
    size: 'md',
    borderRadius: 8,
    backgroundColor: '',
    textColor: '',
    className: ''
  },
  rules: { canDrag: () => true },
  related: { toolbar: ButtonToolbar }
};

export default Button;
