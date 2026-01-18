/**
 * MediaGallery - Secondary plane showcasing photobooth output
 * Renders an array of video placeholders in a horizontal scrolling layout
 */

type VideoPlaceholderProps = {
  index: number;
};

function VideoPlaceholder({ index }: VideoPlaceholderProps) {
  return (
    <div className="group relative flex-shrink-0">
      {/* Video frame container */}
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-300 group-hover:border-text-muted/30"
        style={{ width: '280px', aspectRatio: '9/16' }}
      >
        {/* Scanline effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
        
        {/* Play button indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-muted/80 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg
              className="ml-1 h-5 w-5 text-text-muted"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Corner frame markers */}
        <div className="absolute left-2 top-2 h-4 w-4 border-l border-t border-text-muted/20" />
        <div className="absolute right-2 top-2 h-4 w-4 border-r border-t border-text-muted/20" />
        <div className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-text-muted/20" />
        <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-text-muted/20" />
        
        {/* Video metadata placeholder */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted/60">
              Video {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] text-text-muted/40">
              0:00
            </span>
          </div>
        </div>
        
        {/* Recording indicator dot */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
          <span className="font-mono text-[8px] uppercase text-text-muted/40">
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
    <section className="relative w-full bg-surface-elevated py-24">
      {/* Section header */}
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-text-muted">
              Gallery
            </p>
            <h2
              className="text-3xl font-light tracking-tight text-text-primary md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Recent Captures
            </h2>
          </div>
          
          {/* Navigation hints */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-text-muted/40"
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-text-muted/40"
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Horizontal scrolling gallery */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-surface-elevated to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-surface-elevated to-transparent" />
        
        {/* Scrollable container */}
        <div
          className="flex gap-5 overflow-x-auto px-6 pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Left spacer for centering */}
          <div className="w-[calc((100vw-1280px)/2)] flex-shrink-0 max-lg:hidden" />
          
          {placeholders.map((index) => (
            <VideoPlaceholder key={index} index={index} />
          ))}
          
          {/* Right spacer */}
          <div className="w-[calc((100vw-1280px)/2)] flex-shrink-0 max-lg:hidden" />
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="mt-8 flex justify-center md:hidden">
        <div className="flex gap-1.5">
          {placeholders.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === 0 ? 'w-6 bg-text-muted' : 'w-1 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
