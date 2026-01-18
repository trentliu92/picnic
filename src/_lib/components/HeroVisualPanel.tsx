/**
 * HeroVisualPanel - Primary visual anchor for the homepage
 * Contains two static image placeholders representing product system presentation
 * Mobile-first responsive design
 */

type ImagePlaceholderProps = {
  label: string;
  aspectRatio: string;
  className?: string;
};

function ImagePlaceholder({ label, aspectRatio, className = '' }: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-surface-elevated sm:rounded-2xl ${className}`}
      style={{ aspectRatio }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Corner accents - smaller on mobile */}
      <div className="absolute left-2 top-2 h-4 w-4 border-l border-t border-border sm:left-3 sm:top-3 sm:h-6 sm:w-6 sm:border-l-2 sm:border-t-2" />
      <div className="absolute right-2 top-2 h-4 w-4 border-r border-t border-border sm:right-3 sm:top-3 sm:h-6 sm:w-6 sm:border-r-2 sm:border-t-2" />
      <div className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-border sm:bottom-3 sm:left-3 sm:h-6 sm:w-6 sm:border-b-2 sm:border-l-2" />
      <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-border sm:bottom-3 sm:right-3 sm:h-6 sm:w-6 sm:border-b-2 sm:border-r-2" />
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
        {/* Icon placeholder - smaller on mobile */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-muted sm:h-12 sm:w-12 sm:rounded-xl">
          <svg
            className="h-4 w-4 text-text-muted sm:h-5 sm:w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        {/* Label - smaller on mobile */}
        <span className="px-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted sm:text-xs sm:tracking-[0.2em]">
          {label}
        </span>
      </div>
    </div>
  );
}

export function HeroVisualPanel() {
  return (
    <section className="relative w-full overflow-hidden bg-surface">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-elevated opacity-50" />
      
      {/* Radial glow - smaller on mobile */}
      <div
        className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 sm:h-[600px] sm:w-[600px] md:h-[800px] md:w-[800px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />
      
      {/* Content container - mobile-first padding */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        {/* Header text - mobile-first sizing */}
        <div className="mb-8 text-center sm:mb-12 md:mb-16">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted sm:mb-3 sm:text-[11px] sm:tracking-[0.25em] md:mb-4 md:text-xs md:tracking-[0.3em]">
            Photobooth System
          </p>
          <h1
            className="text-3xl font-light tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Capture Moments
          </h1>
        </div>
        
        {/* Image placeholders - stacked on mobile, side by side on desktop */}
        <div className="flex w-full max-w-5xl flex-col gap-4 sm:gap-5 md:flex-row md:gap-6 lg:gap-8">
          {/* Primary placeholder - landscape, uses 16/10 on mobile for better fit */}
          <ImagePlaceholder
            label="Primary Hero Image"
            aspectRatio="4/3"
            className="aspect-[16/10] w-full md:aspect-[4/3] md:flex-[1.618]"
          />
          
          {/* Secondary placeholder - landscape on mobile, portrait on desktop */}
          <ImagePlaceholder
            label="Secondary Image"
            aspectRatio="3/4"
            className="aspect-[4/3] w-full md:aspect-[3/4] md:flex-1"
          />
        </div>
        
        {/* Subtle indicator - smaller margin on mobile */}
        <div className="mt-10 flex flex-col items-center gap-2 sm:mt-14 sm:gap-3 md:mt-20">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-text-muted sm:text-[9px] sm:tracking-[0.35em] md:text-[10px] md:tracking-[0.4em]">
            Scroll
          </span>
          <div className="h-6 w-px bg-gradient-to-b from-border to-transparent sm:h-7 md:h-8" />
        </div>
      </div>
    </section>
  );
}
