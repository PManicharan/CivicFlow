import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground uppercase">
          {fallback}
        </span>
      )}
    </div>
  )
);
Avatar.displayName = 'Avatar';

export { Avatar };
