import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-end justify-between rounded-lg mb-6 ${className}`}>
      {children}
    </div>
  );
}