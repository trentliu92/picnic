/**
 * SaveToPhotosButton Component
 *
 * A mobile-first button for saving images/videos to the iOS Camera Roll.
 * Uses Web Share API when available, falls back gracefully.
 *
 * Manual Test Checklist:
 * - [ ] iPhone Safari: image opens share sheet, can save to photos
 * - [ ] iPhone Safari: video opens share sheet, can save to photos
 * - [ ] iPhone Chrome (WKWebView): should work similarly
 * - [ ] Desktop Safari: downloads file or opens in new tab
 * - [ ] Desktop Chrome: downloads file directly
 * - [ ] Loading state shows spinner while fetching
 * - [ ] Error state shows message if fetch fails
 */

import { useState, useRef, useEffect } from 'react';
import { Download, Check, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import {
  saveToPhotos,
  guessMimeTypeFromFilename,
  type SaveToPhotosResult,
} from '@/utils/saveToPhotos';

type SaveToPhotosButtonProps = {
  /** URL to the media file (image or video) */
  url: string;
  /** Filename for the downloaded file */
  filename: string;
  /** MIME type (auto-detected from filename if not provided) */
  mimeType?: string;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
};

type ButtonState = 'idle' | 'loading' | 'success' | 'hint';

export function SaveToPhotosButton({
  url,
  filename,
  mimeType,
  className,
  variant = 'default',
  size = 'xl',
}: SaveToPhotosButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const [hint, setHint] = useState<string | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  const resolvedMimeType = mimeType ?? guessMimeTypeFromFilename(filename);
  const isVideo = resolvedMimeType.startsWith('video/');

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleClick(): Promise<void> {
    // Clear any existing timeout
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setState('loading');
    setHint(null);

    try {
      const result: SaveToPhotosResult = await saveToPhotos({
        url,
        filename,
        mimeType: resolvedMimeType,
      });

      if (result.success) {
        setState('success');
        setHint(result.message);

        // Reset after 3 seconds
        resetTimeoutRef.current = window.setTimeout(() => {
          setState('idle');
          setHint(null);
          resetTimeoutRef.current = null;
        }, 3000);
      } else {
        // Share was cancelled
        setState('idle');
      }
    } catch (error) {
      console.error('Save to photos failed:', error);
      setState('hint');
      setHint('Something went wrong. Try long-pressing the media to save.');

      resetTimeoutRef.current = window.setTimeout(() => {
        setState('idle');
        setHint(null);
        resetTimeoutRef.current = null;
      }, 5000);
    }
  }

  function getButtonContent(): React.ReactNode {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader size="sm" />
            Preparing...
          </>
        );
      case 'success':
        return (
          <>
            <Check className="w-5 h-5" />
            Ready to Save
          </>
        );
      default:
        return (
          <>
            <Download className="w-5 h-5" />
            Save {isVideo ? 'Video' : 'Photo'}
          </>
        );
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleClick}
        disabled={state === 'loading'}
        variant={variant}
        size={size}
        className={`bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
      >
        {getButtonContent()}
      </Button>

      {/* Hint message - shows after share sheet opens or on fallback */}
      {hint && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom-2">
          <Share className="w-4 h-4" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}
