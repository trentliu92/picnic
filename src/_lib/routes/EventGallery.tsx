import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getEventThumbnails, type EventThumbnail } from '../api';
import { Loader } from '@/components/ui/loader';

type ThumbnailCardProps = {
  thumbnail: EventThumbnail;
};

function ThumbnailCard({ thumbnail }: ThumbnailCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      to={`/session/${thumbnail.session_id}`}
      className="group relative block overflow-hidden rounded-2xl bg-neutral-900 shadow-lg active:scale-[0.98] transition-transform duration-150"
    >
      {isLoading && (
        <Loader className="absolute inset-0 w-full aspect-[720/1525] rounded-2xl bg-neutral-800" />
      )}
      <img
        src={thumbnail.url}
        alt="Session thumbnail"
        onLoad={() => setIsLoading(false)}
        className={`w-full aspect-[720/1525] object-cover transition-all duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } group-hover:scale-105 group-active:scale-100`}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
        <time className="text-xs text-white/80 font-medium">
          {new Date(thumbnail.created_at).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </time>
      </div>
    </Link>
  );
}

function ThumbnailSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-neutral-800">
      <Loader className="w-full aspect-[720/1525]" />
    </div>
  );
}

/** Fixed mobile-only column count */
const COLUMNS = 2;
/** Number of items to fetch per page */
const PAGE_SIZE = 12;

export default function EventGallery() {
  const { eventId } = useParams();
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  const [thumbnails, setThumbnails] = useState<EventThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    if (!eventId) return;

    let isActive = true;

    const run = async (): Promise<void> => {
      setIsLoading(true);
      setThumbnails([]);
      setNextCursor(null);
      setHasMore(true);
      setIsFetchingMore(false);

      try {
        const data = await getEventThumbnails(eventId, { limit: PAGE_SIZE });
        if (!isActive) return;
        setThumbnails(data.thumbnails);
        setNextCursor(data.next_cursor);
        setHasMore(data.has_more);
      } catch (error) {
        console.error('Failed to fetch thumbnails:', error);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [eventId]);

  // Fetch more thumbnails
  const fetchMore = useCallback(async (): Promise<void> => {
    if (!eventId || isFetchingMore || !hasMore || !nextCursor) return;

    setIsFetchingMore(true);
    try {
      const data = await getEventThumbnails(eventId, {
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      setThumbnails((prev) => [...prev, ...data.thumbnails]);
      setNextCursor(data.next_cursor);
      setHasMore(data.has_more);
    } catch (error) {
      console.error('Failed to fetch more thumbnails:', error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [eventId, isFetchingMore, hasMore, nextCursor]);

  /**
   * Sentinel placement: observe when we reach the first item of the last 2 rows.
   * With 2 columns, "last 2 rows" begins at index (len - 4).
   */
  const sentinelIndex = Math.max(0, thumbnails.length - COLUMNS * 2);

  const setLoadMoreNode = useCallback(
    (node: HTMLDivElement | null): void => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }

      if (!node) return;

      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first?.isIntersecting) {
            void fetchMore();
          }
        },
        {
          root: null,
          threshold: 0.1,
        }
      );

      intersectionObserverRef.current.observe(node);
    },
    [fetchMore]
  );

  // Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <ThumbnailSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (thumbnails.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-6">
        <p className="text-center text-neutral-400 py-12">No sessions yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6">
      <div className="grid grid-cols-2 gap-3">
        {thumbnails.map((thumb, index) => (
          <div key={thumb.session_id} className="contents">
            {index === sentinelIndex && hasMore && (
              <div ref={setLoadMoreNode} className="col-span-2 h-px" />
            )}
            <ThumbnailCard thumbnail={thumb} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isFetchingMore && (
        <div className="flex justify-center py-4">
          <Loader className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}
