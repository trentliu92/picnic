/**
 * MediaGallery - Secondary plane showcasing photobooth output
 * Renders an array of video placeholders in a horizontal scrolling layout
 * Mobile-first responsive design
 */

type VideoPlaceholderProps = {
  index: number;
};

function VideoPlaceholder({ index }: VideoPlaceholderProps) {
  return (
    <div className="group relative flex-shrink-0">
      {/* Video frame container - responsive width */}
      <div
        className="relative w-[176px] ... sm:w-[220px] md:w-[260px] overflow-hidden rounded-lg border border-border bg-surface-elevated transition-all duration-300 group-hover:border-text-muted/30 sm:w-[240px] sm:rounded-xl md:w-[280px]"
        style={{ aspectRatio: '4 / 3' }}
      >
        {/* Scanline effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
        
        {/* Play button indicator - smaller on mobile */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-muted/80 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 md:h-14 md:w-14">
            <svg
              className="ml-0.5 h-4 w-4 text-text-muted sm:ml-1 sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Corner frame markers */}
        <div className="absolute left-1.5 top-1.5 h-3 w-3 border-l border-t border-text-muted/20 sm:left-2 sm:top-2 sm:h-4 sm:w-4" />
        <div className="absolute right-1.5 top-1.5 h-3 w-3 border-r border-t border-text-muted/20 sm:right-2 sm:top-2 sm:h-4 sm:w-4" />
        <div className="absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-text-muted/20 sm:bottom-2 sm:left-2 sm:h-4 sm:w-4" />
        <div className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-text-muted/20 sm:bottom-2 sm:right-2 sm:h-4 sm:w-4" />
        
        {/* Video metadata placeholder - responsive padding */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-wider text-text-muted/60 sm:text-[9px] md:text-[10px]">
              Video {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[8px] text-text-muted/40 sm:text-[9px] md:text-[10px]">
              0:00
            </span>
          </div>
        </div>
        
        {/* Recording indicator dot - responsive positioning */}
        <div className="absolute right-2 top-2 flex items-center gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
          <div className="h-1 w-1 rounded-full bg-red-500/60 sm:h-1.5 sm:w-1.5" />
          <span className="font-mono text-[6px] uppercase text-text-muted/40 sm:text-[7px] md:text-[8px]">
            REC
          </span>
        </div>
      </div>
    </div>
  );
}

type MediaGalleryProps = {
  count?: number;
};

export function MediaGallery({ count = 8 }: MediaGalleryProps) {
  const placeholders = Array.from({ length: count }, (_, i) => i);
  
  return (
    <section className="relative w-full bg-surface-elevated py-6">

      {/* Horizontal scrolling gallery */}
      <div className="relative">
        {/* Fade edges - smaller on mobile */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-6 bg-gradient-to-r from-surface-elevated to-transparent sm:w-8 md:w-12" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-6 bg-gradient-to-r from-transparent to-surface-elevated sm:w-8 md:w-12" />
        
        {/* Scrollable container - responsive gap and padding */}
        <div
          className="flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 md:gap-5 md:pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Left spacer for centering on large screens */}
          <div className="hidden w-[calc((100vw-1280px)/2)] flex-shrink-0 lg:block" />
          
          {placeholders.map((index) => (
            <VideoPlaceholder key={index} index={index} />
          ))}
          
          {/* Right spacer */}
          <div className="hidden w-[calc((100vw-1280px)/2)] flex-shrink-0 lg:block" />
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="mt-4 flex justify-center sm:mt-6 md:hidden">
        <div className="flex gap-1 sm:gap-1.5">
          {placeholders.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full transition-all sm:h-1 ${
                i === 0 ? 'w-4 bg-text-muted sm:w-6' : 'w-0.5 bg-border sm:w-1'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
