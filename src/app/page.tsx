import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center"
      style={{ backgroundColor: 'var(--color-bg-canvas)' }}
    >
      <h1
        className="text-5xl font-semibold tracking-tight"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-primary)'
        }}
      >
        Bentoo
      </h1>
      <p
        className="max-w-md text-lg text-pretty"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        A personal website builder for creatives. Drag, drop, and publish.
      </p>
      <Link
        href="/editor"
        className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96]"
        style={{
          backgroundColor: 'var(--color-accent)',
          boxShadow: 'var(--shadow-border)',
          fontFamily: 'var(--font-body)'
        }}
      >
        Open Editor
      </Link>
    </div>
  );
}
