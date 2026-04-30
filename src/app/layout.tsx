import type { Metadata } from 'next';
import { Nunito_Sans, Outfit } from 'next/font/google';
import './globals.css';
import React from 'react';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Bentoo — Website Builder',
  description: 'Build your personal website with drag-and-drop simplicity'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${nunitoSans.variable} ${outfit.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
