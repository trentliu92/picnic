import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventThumbnails, type EventThumbnailsResponse, type EventThumbnail } from '../api';
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

export default function EventGallery() {
  const { eventId } = useParams();
  const [data, setData] = useState<EventThumbnailsResponse | null>(null);

  useEffect(() => {
    if (!eventId) return;
    getEventThumbnails(eventId).then(setData);
  }, [eventId]);

  const thumbnails = data?.thumbnails ?? [];

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {data === null ? (
          // Loading skeletons
          Array.from({ length: 6 }, (_, i) => <ThumbnailSkeleton key={i} />)
        ) : thumbnails.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400 py-12">
            No sessions yet
          </p>
        ) : (
          thumbnails.map((thumb) => (
            <ThumbnailCard key={thumb.session_id} thumbnail={thumb} />
          ))
        )}
      </div>
    </div>
  );
}
