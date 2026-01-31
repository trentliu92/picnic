/**
 * Header - Mobile-first navigation header with logo and hamburger menu
 * Sticky navigation that appears on all routes
 */

import { Link } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';
import logo from '../../assets/logo.png';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80">
      <nav className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
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

        {/* Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-muted/50 active:bg-muted"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6 text-primary" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right"
            className="bg-black/70 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            <SheetHeader className="pb-4">
              <SheetTitle className="text-primary tracking-widest uppercase text-sm font-light">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-8">
              <SheetClose asChild>
                <Link
                  to="/"
                  className="group relative py-4 px-4 text-primary font-light tracking-wide transition-all duration-300 hover:text-primary hover:bg-primary/5 hover:pl-6 text-xl"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-2" />
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/frames"
                  className="group relative py-4 px-4 text-primary font-light tracking-wide transition-all duration-300 hover:text-primary hover:bg-primary/5 hover:pl-6 text-xl"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-2" />
                  Frames
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/event/1"
                  className="group relative py-4 px-4 text-primary font-light tracking-wide transition-all duration-300 hover:text-primary hover:bg-primary/5 hover:pl-6 text-xl"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-2" />
                  Gallery
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
