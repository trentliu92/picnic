/**
 * HeroVisualPanel - Primary visual anchor for the homepage
 * Contains two static image placeholders representing product system presentation
 */

type ImagePlaceholderProps = {
  label: string;
  aspectRatio: string;
  className?: string;
};

function ImagePlaceholder({ label, aspectRatio, className = '' }: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-surface-elevated ${className}`}
      style={{ aspectRatio }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Corner accents */}
      <div className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-border" />
      <div className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-border" />
      <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-border" />
      <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-border" />
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {/* Icon placeholder */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-muted">
          <svg
            className="h-5 w-5 text-text-muted"
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
        
        {/* Label */}
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}

export function HeroVisualPanel() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-surface">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-elevated opacity-50" />
      
      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24">
        {/* Header text */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
            Photobooth System
          </p>
          <h1
            className="text-5xl font-light tracking-tight text-text-primary md:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Capture Moments
          </h1>
        </div>
        
        {/* Image placeholders - Product system presentation */}
        <div className="flex w-full max-w-5xl flex-col gap-6 md:flex-row md:gap-8">
          {/* Primary placeholder - larger */}
          <ImagePlaceholder
            label="Primary Hero Image"
            aspectRatio="4/3"
            className="flex-[1.618]"
          />
          
          {/* Secondary placeholder - portrait orientation */}
          <ImagePlaceholder
            label="Secondary Image"
            aspectRatio="3/4"
            className="flex-1"
          />
        </div>
        
        {/* Subtle indicator */}
        <div className="mt-20 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-muted">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-border to-transparent" />
        </div>
      </div>
    </section>
  );
}
