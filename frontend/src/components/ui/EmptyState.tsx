import type { ReactNode } from 'react';
import { FileSearch } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = <FileSearch className="w-12 h-12 text-muted-foreground/50" />
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px] bg-muted/5 border border-dashed border-border rounded-2xl"
    >
      <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="shadow-subtle hover:shadow-md transition-all hover:-translate-y-0.5">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
