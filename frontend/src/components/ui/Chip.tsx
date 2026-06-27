import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void;
  variant?: 'default' | 'outline';
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, children, onRemove, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
          variant === 'default' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border border-border text-foreground',
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = 'Chip';

export { Chip };
