'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Toolbox } from './Toolbox';
import { Sidebar } from './Sidebar';

interface ViewportProps {
  children: React.ReactNode;
}

export const Viewport: React.FC<ViewportProps> = ({ children }) => {
  const { enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  return (
    <div className="page-container flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        {enabled && <Toolbox />}
        <div
          className="craftjs-renderer min-w-0 flex-1 overflow-auto p-6 transition-colors"
          style={{ backgroundColor: 'var(--color-bg-canvas)' }}
          ref={(ref) => {
            if (ref) connectors.select(connectors.hover(ref, ''), '');
          }}
        >
          <div
            className={cn(
              'mx-auto grid min-h-[70vh] max-w-3xl [&>div]:min-h-full',
              enabled && 'rounded-xl'
            )}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              boxShadow: 'var(--shadow-elevated)'
            }}
          >
            {children}
          </div>
        </div>
        {enabled && <Sidebar />}
      </div>
    </div>
  );
};
