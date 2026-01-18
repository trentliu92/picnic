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

        {/* Mobile menu button - can be expanded later */}
        <button 
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-elevated/60 border border-border/40 text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          aria-label="Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
