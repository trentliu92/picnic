/**
 * Save to Photos Utility
 *
 * iOS Safari Caveats:
 * - No silent Camera Roll access; user must explicitly tap "Save to Photos"
 * - Web Share API with files[] works on iOS 15+ Safari
 * - Must be triggered by user gesture (click/tap handler)
 * - CORS must allow fetch; otherwise fallback to direct link
 * - Large videos may cause memory pressure; no streaming alternative on iOS web
 */

export interface SaveToPhotosOptions {
  url: string;
  filename: string;
  mimeType?: string;
}

export interface SaveToPhotosResult {
  success: boolean;
  method: 'share' | 'download' | 'fallback';
  message: string;
}

/**
 * Guesses MIME type from filename extension
 */
export function guessMimeTypeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
  };
  return mimeTypes[ext ?? ''] ?? 'application/octet-stream';
}

/**
 * Checks if Web Share API with files is supported
 */
function supportsFileShare(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'
  );
}

/**
 * Attempts to share a file via Web Share API
 * Returns true if successful, false if failed/cancelled
 */
async function tryWebShare(
  url: string,
  filename: string,
  mimeType: string
): Promise<{ success: boolean; error?: string }> {
  if (!supportsFileShare()) {
    return { success: false, error: 'Web Share API not supported' };
  }

  try {
    // Fetch the media file
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: `Fetch failed: ${response.status}` };
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: mimeType });

    // Check if we can share this file type
    if (!navigator.canShare({ files: [file] })) {
      return { success: false, error: 'Cannot share this file type' };
    }

    // Attempt the share
    await navigator.share({
      files: [file],
      title: filename,
    });

    return { success: true };
  } catch (error) {
    // User cancelled share = AbortError, not a failure
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'cancelled' };
    }
    // CORS or network error
    return { success: false, error: String(error) };
  }
}

/**
 * Attempts download via anchor tag with download attribute
 * Note: iOS Safari ignores download attribute for cross-origin URLs
 */
function tryDownloadLink(url: string, filename: string): boolean {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}

/**
 * Main function: Attempts to save media to photos
 *
 * Strategy:
 * 1. Try Web Share API with File (iOS 15+ Safari)
 * 2. Fall back to download link (works on desktop, may open in new tab on iOS)
 * 3. If all else fails, open URL directly
 *
 * @param options - URL, filename, and optional mimeType
 * @returns Result indicating method used and user message
 */
export async function saveToPhotos(
  options: SaveToPhotosOptions
): Promise<SaveToPhotosResult> {
  const { url, filename, mimeType = guessMimeTypeFromFilename(filename) } = options;

  // Attempt 1: Web Share API (preferred on iOS)
  const shareResult = await tryWebShare(url, filename, mimeType);

  if (shareResult.success) {
    return {
      success: true,
      method: 'share',
      message: 'Tap "Save to Photos" in the share sheet',
    };
  }

  // User explicitly cancelled - don't fallback
  if (shareResult.error === 'cancelled') {
    return {
      success: false,
      method: 'share',
      message: 'Share cancelled',
    };
  }

  // Attempt 2: Download link (works on desktop, opens media on iOS)
  const downloadWorked = tryDownloadLink(url, filename);

  if (downloadWorked) {
    return {
      success: true,
      method: 'download',
      message: 'Long press the image/video, then tap "Save to Photos"',
    };
  }

  // Attempt 3: Direct open as last resort
  window.open(url, '_blank');

  return {
    success: true,
    method: 'fallback',
    message: 'Tap the share icon, then "Save to Photos"',
  };
}
