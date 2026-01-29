import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback, type RefObject } from 'react';
import { getSessionStrips, type SessionStripsResponse, type Strip } from '../api';
import { SaveToPhotosButton } from '@/components/SaveToPhotosButton';
import { Loader } from '@/components/ui/loader';

/** Width of each carousel item as a percentage of container */
const ITEM_WIDTH_PERCENT = 0.8;

/** Gap compensation for scroll calculation */
const SCROLL_WIDTH_PERCENT = 0.80;


/**
 * Sorts strips to show strip videos first, then strip photos
 */
function sortStrips(strips: Strip[]): Strip[] {
  return [...strips].sort((a, b) => {
    if (a.kind === 'strip_video' && b.kind !== 'strip_video') return -1;
    if (a.kind !== 'strip_video' && b.kind === 'strip_video') return 1;
    return 0;
  });
}

/**
 * Returns CSS mask gradient for inactive carousel items
 */
function getMaskGradient(isToRight: boolean): string {
  const direction = isToRight ? 'to right' : 'to left';
  return `linear-gradient(${direction}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`;
}

/**
 * Custom hook to handle video autoplay on mobile Safari
 */
function useVideoAutoplay(isActive: boolean): RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Programmatically play - required for mobile Safari
      video.play().catch(() => {
        // Autoplay was prevented - this is expected in some cases
      });
    } else {
      video.pause();
    }
  }, [isActive]);

  return videoRef;
}

type CarouselItemProps = {
  strip: Strip;
  isActive: boolean;
  isToRight: boolean;
};

function CarouselItem({ strip, isActive, isToRight }: CarouselItemProps) {
  const [isLoading, setIsLoading] = useState(true);
  const maskGradient = getMaskGradient(isToRight);
  const maskStyle = isActive ? {} : { maskImage: maskGradient, WebkitMaskImage: maskGradient };
  const videoRef = useVideoAutoplay(isActive);

  return (
    <div
      className="flex-shrink-0 snap-center transition-all duration-300 relative max-w-[250px]"
      style={{ width: `${ITEM_WIDTH_PERCENT * 100}%`, ...maskStyle }}
    >
      {isLoading && (
        <Loader className="absolute inset-0 w-full aspect-[2/3] rounded-2xl bg-neutral-800" />
      )}
      {strip.kind === 'strip_video' ? (
        <video
          ref={videoRef}
          src={strip.url}
          poster={strip.poster_url ?? undefined}
          playsInline
          preload="auto"
          autoPlay
          loop
          muted
          onCanPlay={() => setIsLoading(false)}
          className={`w-full h-auto rounded-2xl shadow-lg transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <img
          src={strip.url}
          alt="Photo strip"
          onLoad={() => setIsLoading(false)}
          className={`w-full h-auto rounded-2xl shadow-lg transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
}

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
};

function PaginationDots({ count, activeIndex, onDotClick }: PaginationDotsProps) {
  if (count <= 1) return null;

  return (
    <div className="flex justify-center gap-2 py-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 rounded-full transition-all duration-200 ${
            index === activeIndex
              ? 'bg-primary w-4'
              : 'bg-gray-300 hover:bg-gray-400 w-2'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function SessionGallery() {
  const { sessionId } = useParams();
  const [stripsData, setStripsData] = useState<SessionStripsResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    getSessionStrips(sessionId).then(setStripsData);
  }, [sessionId]);

  const sortedStrips = stripsData ? sortStrips(stripsData.strips) : [];
  const currentStrip = sortedStrips[activeIndex];

  const handleScroll = useCallback((): void => {
    if (!carouselRef.current) return;
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const itemWidth = offsetWidth * SCROLL_WIDTH_PERCENT;
    setActiveIndex(Math.round(scrollLeft / itemWidth));
  }, []);

  const scrollToIndex = useCallback((index: number): void => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: index * carouselRef.current.offsetWidth * SCROLL_WIDTH_PERCENT,
      behavior: 'smooth',
    });
  }, []);

  if (!stripsData) {
    return <Loader className="py-16" />;
  }

  // Generate filename from strip path
  const getFilename = (strip: Strip): string => {
    const ext = strip.kind === 'strip_video' ? 'mp4' : 'jpg';
    const basename = strip.path.split('/').pop()?.split('.')[0] ?? 'media';
    return `${basename}.${ext}`;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pl-4 pr-16 py-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedStrips.map((strip, index) => (
          <CarouselItem
            key={strip.path}
            strip={strip}
            isActive={index === activeIndex}
            isToRight={index > activeIndex}
          />
        ))}
      </div>

      <PaginationDots
        count={sortedStrips.length}
        activeIndex={activeIndex}
        onDotClick={scrollToIndex}
      />

      {currentStrip && (
        <div className="pt-2 pb-6">
          <SaveToPhotosButton
            url={currentStrip.url}
            filename={getFilename(currentStrip)}
            mimeType={currentStrip.kind === 'strip_video' ? 'video/mp4' : 'image/jpeg'}
          />
        </div>
      )}
    </div>
  );
}
