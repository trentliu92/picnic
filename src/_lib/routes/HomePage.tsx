/**
 * HomePage - Main landing page for the photobooth company
 * Combines HeroVisualPanel and MediaGallery components
 * Mobile-first responsive design
 */

import { HeroVisualPanel } from '../components/HeroVisualPanel';
import { MediaGallery } from '../components/MediaGallery';

export function HomePage() {
  return (
    <main className="min-h-[100svh] bg-surface relative">
      {/* Primary plane - Hero visual anchor */}
      <div>
        <HeroVisualPanel />
      </div>
      
      {/* Secondary plane - Video gallery */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <MediaGallery count={8} />
      </div>
    </main>
  );
}
