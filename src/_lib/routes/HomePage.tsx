/**
 * HomePage - Main landing page for the photobooth company
 * Combines HeroVisualPanel and MediaGallery components
 */

import { HeroVisualPanel } from '../components/HeroVisualPanel';
import { MediaGallery } from '../components/MediaGallery';

export function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Primary plane - Hero visual anchor */}
      <HeroVisualPanel />
      
      {/* Secondary plane - Video gallery */}
      <MediaGallery count={8} />
      
      {/* Footer spacer */}
      <footer className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted/40">
            Layout Prototype — Media Placeholders Only
          </p>
        </div>
      </footer>
    </main>
  );
}
