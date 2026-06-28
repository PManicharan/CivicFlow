import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url) && !url.includes('localhost')) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  if (url.includes('localhost')) {
    try {
      const parsed = new URL(url);
      return `${API_URL}${parsed.pathname}`;
    } catch {
      return url;
    }
  }
  return url;
}

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const resolvedSrc = resolveImageUrl(src);

  if (!resolvedSrc || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/20 border border-dashed border-border/50 text-muted-foreground ${className || ''}`}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium uppercase tracking-wider">No Evidence Preview</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt || "Evidence"}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
