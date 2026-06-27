import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center text-muted-foreground', className)}>
      <Loader2 className={cn('animate-spin', sizes[size])} />
    </div>
  );
}
