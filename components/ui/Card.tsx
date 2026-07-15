// Card — Reusable card container components for the dark-theme dashboard UI
// Provides Card, CardHeader, CardTitle, CardContent, CardFooter sub-components

import { HTMLAttributes, ReactNode } from 'react';

// Card wrapper with border and hover shadow
export function Card({ children, border = '#3D3530', ...props }: HTMLAttributes<HTMLDivElement> & { border?: string }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
      style={{ backgroundColor: '#2D2620', border: `1px solid ${border}` }}
      {...props}>
      {children}
    </div>
  );
}

// Card header section with bottom margin
export function CardHeader({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mb-6" {...props}>
      {children}
    </div>
  );
}

// Card title in primary text color
export function CardTitle({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className="text-xl font-bold" style={{ color: '#F5F1ED' }} {...props}>
      {children}
    </h3>
  );
}

// Card content area — renders children as-is
export function CardContent({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

// Card footer with top border separator
export function CardFooter({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid #3D3530' }} {...props}>
      {children}
    </div>
  );
}
