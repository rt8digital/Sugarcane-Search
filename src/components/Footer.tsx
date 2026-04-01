import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex justify-center px-8 md:px-12 pb-16 md:pb-24 pt-16 md:pt-24 relative z-10">
      <div className="w-full max-w-5xl bg-card/70 backdrop-blur-md border border-border rounded-[2rem] md:rounded-[2.5rem] p-10 md:p-20 flex flex-col items-center space-y-16 md:space-y-24 text-center shadow-sm relative overflow-hidden">
        {/* Decorative Rainbow Line (SA Flag Colors) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-sa-red" />
          <div className="flex-1 bg-sa-green" />
          <div className="flex-1 bg-sa-yellow" />
          <div className="flex-1 bg-sa-blue" />
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6 pt-8">
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
              SALT
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary mt-2">
              South African Lineage Tracer
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 pt-8 md:pt-12">
          <Link
            to="/sources"
            className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-all duration-200"
          >
            Archive Sources
          </Link>

          <Button variant="link" asChild className="text-[12px] uppercase tracking-[0.15em]">
            <Link to="/contribute" className="flex items-center text-accent hover:text-accent/80">
              <Heart className="mr-2 h-4 w-4 fill-accent/20" strokeWidth={1.5} />
              Contribute
            </Link>
          </Button>
        </div>

        {/* Attribution & Contact Section */}
        <div className="flex flex-col items-center space-y-12 md:space-y-16 pt-16 md:pt-24 border-t border-border w-full max-w-2xl">
          <div className="flex flex-col items-center space-y-10 md:space-y-14">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="opacity-50">By</span>
                <a
                  href="https://rt8.co.za"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline transition-all duration-200"
                >
                  Rotate Group (Pty) Ltd
                </a>
              </p>
              <span className="hidden md:inline w-1.5 h-1.5 rounded-sm bg-sa-yellow/40" />
              <p className="opacity-60">Created by Ilyas Shamoon</p>
            </div>

            <div className="flex items-center gap-12 md:gap-16 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 p-6 border border-border rounded-md bg-card/50">
              <a
                href="mailto:ilyas@rt8.co.za"
                className="flex items-center hover:text-primary transition-colors duration-200"
              >
                <Mail className="mr-2.5 h-4 w-4" strokeWidth={1.5} />
                Email
              </a>
              <span className="hidden md:inline w-px h-4 bg-border" />
              <a
                href="https://wa.me/27847990432"
                target="_blank"
                rel="noreferrer"
                className="flex items-center hover:text-primary transition-colors duration-200"
              >
                <MessageCircle className="mr-2.5 h-4 w-4" strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground/40 border-t border-border pt-10 md:pt-16 w-full">
            &copy; {currentYear} SALT Archive &bull; All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
