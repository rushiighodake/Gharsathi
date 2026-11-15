import { useState } from 'react';
import { Wrench } from 'lucide-react';
import { APP_IMAGES } from '../lib/assets';
import type { HomeServiceItem } from '../types/community';

interface ServiceImageProps {
  imageKey: HomeServiceItem['imageKey'] | 'rohit' | 'handyman';
  alt: string;
  className?: string;
}

export function ServiceImage({ imageKey, alt, className = 'h-16 w-16 rounded-xl object-cover' }: ServiceImageProps) {
  const [failed, setFailed] = useState(false);

  const src =
    imageKey === 'rohit'
      ? APP_IMAGES.rohitPortrait
      : imageKey === 'handyman'
      ? APP_IMAGES.handymanHero
      : APP_IMAGES[imageKey] ?? APP_IMAGES.plumbing;

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 ${className}`}
        aria-label={alt}
      >
        <Wrench className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
