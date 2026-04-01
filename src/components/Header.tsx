import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { path: '/', label: 'Search' },
  { path: '/about', label: 'About' },
  { path: '/sources', label: 'Sources' },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-100 w-full bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container-botanical h-20 flex items-center justify-between">
        {/* Logo - Left */}
        <Link
          to="/"
          className="flex flex-col group justify-center"
          aria-label="SALT Home"
        >
          <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors font-display">
            SALT
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Lineage Tracer
          </span>
        </Link>

        {/* Navigation - Right */}
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-5 py-2.5 text-sm font-bold transition-all duration-200 rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Support Button */}
          <Button
            variant="accent"
            size="lg"
            className="ml-2"
            asChild
          >
            <Link to="/contribute">
              <Heart size={18} strokeWidth={2} className="fill-accent-foreground/20" />
              <span className="hidden sm:inline">Support</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
