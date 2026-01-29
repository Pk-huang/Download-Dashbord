import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  secondary_title?: string;
}

export function PageHeader({ title, icon: Icon, secondary_title }: PageHeaderProps) {
  return (
    <div className="flex flex-col pb-4 mb-6">
      <div className="flex items-center">
        {Icon && <Icon className="h-6 w-6 mr-2" />}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <h2 className="text-xl font-bold mt-3">{secondary_title}</h2>
    </div>
  );
}