/**
 * HeroVisualPanel - Primary visual anchor for the homepage
 * Contains two static image placeholders representing product system presentation
 * Mobile-first responsive design
 */

import heroVideo from '../../assets/picnic-hero-video-2.mp4';
import { MediaCard } from './MediaCard';

export function HeroVisualPanel() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <MediaCard
          src={heroVideo}
          alt="Primary Hero Video"
          type="video"
          aspectRatio="aspect-[9/16]"
        />
        <div className="text-primary text-7xl font-light tracking-widest uppercase absolute bottom-0 left-0 w-full px-8 py-4">
        Never miss a moment
      </div>
    </section>
  );
}
