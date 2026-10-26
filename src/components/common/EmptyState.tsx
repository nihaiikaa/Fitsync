import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#242936] rounded-2xl bg-[#0E1015]/50">
      <div className="w-14 h-14 rounded-2xl bg-[#161920] border border-[#242936] flex items-center justify-center text-zinc-400 mb-4">
        {icon || <Inbox className="w-7 h-7 text-zinc-500" />}
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="brand" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
