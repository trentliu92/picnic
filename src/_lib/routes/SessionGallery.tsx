import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getSessionManifest, type SessionManifest, type Asset } from '../api';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Width of each carousel item as a percentage of container */
const ITEM_WIDTH_PERCENT = 0.8;

/** Gap compensation for scroll calculation */
const SCROLL_WIDTH_PERCENT = 0.80;

/**
 * Downloads a media file from a URL
 */
async function downloadMedia(src: string, type: 'video' | 'photo'): Promise<void> {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = type === 'video' ? `video-${Date.now()}.mp4` : `photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

/**
 * Filters and sorts assets to show strip videos first, then strip photos
 */
function getStripAssets(assets: Asset[]): Asset[] {
  return assets
    .filter((a) => a.type === 'strip_video' || a.type === 'strip_photo')
    .sort((a, b) => {
      if (a.type === 'strip_video' && b.type !== 'strip_video') return -1;
      if (a.type !== 'strip_video' && b.type === 'strip_video') return 1;
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

type CarouselItemProps = {
  asset: Asset;
  isActive: boolean;
  isToRight: boolean;
};

function CarouselItem({ asset, isActive, isToRight }: CarouselItemProps) {
  const maskGradient = getMaskGradient(isToRight);
  const maskStyle = isActive ? {} : { maskImage: maskGradient, WebkitMaskImage: maskGradient };

  return (
    <div
      className="flex-shrink-0 snap-center transition-all duration-300"
      style={{ width: `${ITEM_WIDTH_PERCENT * 100}%`, ...maskStyle }}
    >
      {asset.type === 'strip_video' ? (
        <video
          src={asset.src}
          poster={asset.poster ?? undefined}
          playsInline
          preload="metadata"
          autoPlay
          loop
          muted
          className="w-full h-auto rounded-2xl shadow-lg"
        />
      ) : (
        <img
          src={asset.src}
          alt="Photo strip"
          className="w-full h-auto rounded-2xl shadow-lg"
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
  const [manifest, setManifest] = useState<SessionManifest | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    getSessionManifest(sessionId).then(setManifest);
  }, [sessionId]);

  const stripAssets = manifest ? getStripAssets(manifest.assets) : [];
  const currentAsset = stripAssets[activeIndex];

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

  const handleDownload = (): void => {
    if (!currentAsset) return;
    const type = currentAsset.type === 'strip_video' ? 'video' : 'photo';
    downloadMedia(currentAsset.src, type);
  };

  if (!manifest) {
    return <p className="text-center py-8">Loading…</p>;
  }

  const isVideo = currentAsset?.type === 'strip_video';

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4 py-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stripAssets.map((asset, index) => (
          <CarouselItem
            key={index}
            asset={asset}
            isActive={index === activeIndex}
            isToRight={index > activeIndex}
          />
        ))}
      </div>

      <PaginationDots
        count={stripAssets.length}
        activeIndex={activeIndex}
        onDotClick={scrollToIndex}
      />

      {currentAsset && (
        <div className="flex w-full justify-center items-center py-6">
          <Button onClick={handleDownload} variant="secondary" size="xl">
            <DownloadIcon className="w-5 h-5 text-black" />
            Download {isVideo ? 'Video' : 'Photo'}
          </Button>
        </div>
      )}
    </div>
  );
}
