import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function DonateCTA() {
  return (
    /* Parent container to center the card on the page */
    <section className="min-h-screen w-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        /* relative is key for the absolute star background */
        className="relative w-full max-w-2xl p-18 md:p-16 bg-card rounded-lg border border-border text-center flex flex-col items-center space-y-10 shadow-sm overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-primary pointer-events-none">
          <Star size={140} strokeWidth={1.5} />
        </div>

        {/* Icon */}
        <div className="p-6 bg-primary/5 rounded-md text-primary border border-primary/10">
          <Heart size={36} strokeWidth={1.5} className="fill-primary/10" />
        </div>

        {/* Content */}
        <div className="space-y-5 z-10 max-w-md">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground font-display">
            Tracing Every Story
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-lora">
            SALT is a passion project built on the belief that everyone should have access to their history. Support our mission to digitize the past.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 z-10 pt-4">
          <div className="flex items-center gap-4 p-4 rounded-md bg-muted/50">
            <div className="w-10 h-10 rounded-sm bg-primary/5 flex items-center justify-center text-primary">
              <Globe size={18} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Digital Archive</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-md bg-muted/50">
            <div className="w-10 h-10 rounded-sm bg-primary/5 flex items-center justify-center text-primary">
              <Star size={18} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Free & Open</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full max-w-sm h-14 shadow-sm bg-foreground hover:bg-primary text-primary-foreground font-semibold rounded-md transition-all z-10">
          <Link to="/contribute" className="flex items-center justify-center gap-2.5 w-full h-full">
            <Heart size={18} strokeWidth={1.5} className="fill-primary-foreground/20" />
            <span>Support Our Work</span>
          </Link>
        </button>
      </motion.div>
    </section>
  );
}
