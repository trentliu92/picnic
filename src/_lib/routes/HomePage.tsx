/**
 * HomePage - Main landing page for the photobooth company
 * Combines HeroVisualPanel and MediaGallery components
 * Mobile-first responsive design
 */

import { HeroVisualPanel } from '../components/HeroVisualPanel';
import { MediaGallery } from '../components/MediaGallery';

export function HomePage() {
  return (
    <main className="flex-1 bg-white">
      {/* Primary plane - Hero visual anchor */}
      <HeroVisualPanel />
      
      {/* Secondary plane - Video gallery - overlaps hero on mobile */}
      <div className="-mt-4 relative z-20 sm:-mt-8 md:mt-0">
        <MediaGallery count={8} />
      </div>
    </main>
  );
}
