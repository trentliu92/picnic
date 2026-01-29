import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getEventThumbnails, type EventThumbnail } from '../api';
import { Loader } from '@/components/ui/loader';

/** Number of columns based on screen width */
function useColumnCount(): number {
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 2;
    if (window.innerWidth >= 1024) return 5; // lg
    if (window.innerWidth >= 768) return 4; // md
    return 2;
  });

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) setColumns(5);
      else if (window.innerWidth >= 768) setColumns(4);
      else setColumns(2);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}

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
        <Loader className="absolute inset-0 w-full aspect-[3/4] rounded-2xl bg-neutral-800" />
      )}
      <img
        src={thumbnail.url}
        alt="Session thumbnail"
        onLoad={() => setIsLoading(false)}
        className={`w-full aspect-[3/4] object-cover transition-all duration-300 ${
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
      <Loader className="w-full aspect-[3/4]" />
    </div>
  );
}

/** Gap between grid items in pixels */
const GAP = 12;
/** How many rows before the end to trigger loading more */
const LOAD_MORE_THRESHOLD = 3;
/** Number of items to fetch per page */
const PAGE_SIZE = 10;

export default function EventGallery() {
  const { eventId } = useParams();
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();

  const [thumbnails, setThumbnails] = useState<EventThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const hasFetchedForCurrentDataRef = useRef(false);

  // Initial fetch
  useEffect(() => {
    if (!eventId) return;

    setIsLoading(true);
    setThumbnails([]);
    setNextCursor(null);
    setHasMore(true);
    setIsFetchingMore(false);
    hasFetchedForCurrentDataRef.current = false;

    getEventThumbnails(eventId, { limit: PAGE_SIZE })
      .then((data) => {
        setThumbnails(data.thumbnails);
        setNextCursor(data.next_cursor);
        setHasMore(data.has_more);
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  // Fetch more thumbnails
  const fetchMore = useCallback(async (): Promise<void> => {
    if (!eventId || isFetchingMore || !hasMore || !nextCursor || hasFetchedForCurrentDataRef.current) return;

    hasFetchedForCurrentDataRef.current = true;
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
      hasFetchedForCurrentDataRef.current = false; // Reset on error
    } finally {
      setIsFetchingMore(false);
    }
  }, [eventId, isFetchingMore, hasMore, nextCursor]);

  // Calculate row count (thumbnails are arranged in rows of `columns` items)
  const rowCount = Math.ceil(thumbnails.length / columns);

  // Reset the fetch guard when new data arrives
  useEffect(() => {
    hasFetchedForCurrentDataRef.current = false;
  }, [thumbnails.length]);

  // Estimate row height based on container width
  const estimateRowHeight = useCallback((): number => {
    if (!parentRef.current) return 200;
    const containerWidth = parentRef.current.offsetWidth;
    const itemWidth = (containerWidth - GAP * (columns - 1)) / columns;
    // Aspect ratio is 3:4, so height = width * (4/3)
    return itemWidth * (4 / 3) + GAP;
  }, [columns]);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateRowHeight,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();

  // Check if we need to load more when scrolling near the end
  useEffect(() => {
    if (!virtualRows.length || !hasMore || hasFetchedForCurrentDataRef.current) return;

    const lastVirtualRow = virtualRows[virtualRows.length - 1];
    if (lastVirtualRow && lastVirtualRow.index >= rowCount - LOAD_MORE_THRESHOLD) {
      hasFetchedForCurrentDataRef.current = true;
      fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualRows, rowCount, hasMore]);

  // Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-6">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }, (_, i) => (
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
    <div
      ref={parentRef}
      className="min-h-screen bg-neutral-950 px-4 py-6 overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const startIndex = rowIndex * columns;
          const rowThumbnails = thumbnails.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
              >
                {rowThumbnails.map((thumb) => (
                  <ThumbnailCard key={thumb.session_id} thumbnail={thumb} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator at the bottom */}
      {isFetchingMore && (
        <div className="flex justify-center py-4">
          <Loader className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}
