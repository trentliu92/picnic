/**
 * Header - Mobile-first navigation header with logo
 * Sticky navigation that appears on all routes
 */

import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-surface/80 border-b border-border/50">
      <nav className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo - links to home */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80 active:opacity-60"
        >
          <img 
            src={logo} 
            alt="Picnic" 
            className="h-12 w-auto sm:h-12"
          />
        </Link>
      </nav>
    </header>
  );
}
