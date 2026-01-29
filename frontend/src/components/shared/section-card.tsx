import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <div className="space-y-3 mb-8">
      {title && (
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          {Icon && <Icon className="h-5 w-5" />}
          <h3>{title}</h3>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {children}
      </div>
    </div>
  );
}