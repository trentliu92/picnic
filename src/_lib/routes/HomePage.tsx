/**
 * HomePage - Main landing page for the photobooth company
 * Combines HeroVisualPanel and MediaGallery components
 * Mobile-first responsive design
 */

import { HeroVisualPanel } from '../components/HeroVisualPanel';

export function HomePage() {
  return (
    <main className="flex-1 bg-background relative">
      {/* Primary plane - Hero visual anchor */}
      <HeroVisualPanel />
    </main>
  );
}
