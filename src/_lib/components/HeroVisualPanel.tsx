/**
 * HeroVisualPanel - Primary visual anchor for the homepage
 * Contains two static image placeholders representing product system presentation
 * Mobile-first responsive design
 */

import samplePhoto from '../../assets/sample_photo.png';
import { MediaCard } from './MediaCard';

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
      
      {/* Content container - mobile covers most of viewport, desktop centers */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-12 md:min-h-[100svh] md:justify-center md:py-24">
        
        {/* Primary media - full width on mobile */}
        <div className="relative w-full max-w-5xl">
          <MediaCard
            src={samplePhoto}
            alt="Primary Hero Image"
            type="image"
            aspectRatio="aspect-[1/3]"
          />
        </div>
      </div>
    </section>
  );
}
