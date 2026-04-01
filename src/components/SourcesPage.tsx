import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SourcesPage() {
  const navigate = useNavigate();

  const goSearch = () => {
    navigate('/');
  };

  return (
    <div className="space-y-20 md:space-y-36 pb-24 md:pb-56 px-4 md:px-8 group">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 md:space-y-12"
      >
        <div className="flex justify-center">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-[#007749] active:scale-95 transition-transform rounded-full px-8 py-3" onClick={goSearch}>
            <ArrowLeft size={16} className="mr-2" /> Back to Search
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-6xl md:text-9xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Our <span className="bg-gradient-to-r from-[#E03C31] via-[#007749] to-[#001489] bg-clip-text text-transparent italic">Sources.</span>
          </h1>
          <p className="text-2xl md:text-4xl text-muted-foreground max-w-2xl mx-auto leading-relaxed border-b-4 border-[#001489]/10 pb-14 font-medium" style={{ fontFamily: 'var(--font-lora)' }}>
            This project is made possible through the collaboration of South Africa's leading archival institutions.
          </p>
        </div>

      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 py-12 lg:py-16">
        <section className="space-y-10 md:space-y-14">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="p-4 md:p-6 bg-[#007749]/5 rounded-full text-[#007749] border-2 border-[#007749]/10 shadow-lg glow-green">
              <Book className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>UKZN Centre</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg md:text-2xl" style={{ fontFamily: 'var(--font-lora)' }}>
            For digitizing the <em className="text-[#001489] font-black italic underline decoration-[#007749]/30">Southern Africa Indian Who's Who</em>. Their dedication to archiving our history is the foundation of SALT.
          </p>
          <Button asChild className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-full shadow-[0_20px_50px_rgba(0,119,73,0.3)] hover:shadow-xl transition-all bg-[#007749] hover:bg-[#008f58] text-white border-none cursor-pointer scale-105 hover:scale-110 active:scale-95">
            <a href="https://gldc.ukzn.ac.za" target="_blank" rel="noreferrer">
              Visit GLDC
            </a>
          </Button>
        </section>

        <section className="space-y-10 md:space-y-14">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="p-4 md:p-6 bg-[#E03C31]/5 rounded-full text-[#E03C31] border-2 border-[#E03C31]/10 shadow-lg glow-red">
              <Users className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Community</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg md:text-2xl" style={{ fontFamily: 'var(--font-lora)' }}>
            To the families and individuals who continue to provide missing volumes and share their private collections to ensure the database remains growing.
          </p>
          <Button asChild className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-full shadow-[0_20px_50px_rgba(224,60,49,0.3)] hover:shadow-xl transition-all bg-[#E03C31] hover:bg-[#ff4d3d] text-white border-none cursor-pointer scale-105 hover:scale-110 active:scale-95">
            <a href="/contribute">
              Join the Effort
            </a>
          </Button>
        </section>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-[2.5rem] md:rounded-[5rem] bg-white border-4 border-border/40 p-10 md:p-36 text-center flex flex-col items-center space-y-12 md:space-y-20 shadow-[0_50px_100px_-20px_rgba(0,20,137,0.15)] mt-16 md:mt-28 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#001489]/5 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="p-8 md:p-12 bg-[#001489]/10 rounded-full text-[#001489] shadow-inner border-2 border-[#001489]/20 animate-pulse">
          <Heart className="w-12 h-12 md:w-20 md:h-20 fill-[#001489]/20" />
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 p-4">
          <h3
            className="text-3xl md:text-7xl font-black text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            A Heartfelt Thank You
          </h3>
          <p
            className="text-lg md:text-3xl text-muted-foreground max-w-xl mx-auto leading-relaxed border-b-2 border-[#007749]/10 pb-6 md:pb-8 italic"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Preserving history is a collective effort. We extend our deepest gratitude to everyone who has contributed.
          </p>
        </div>

      </motion.div>

    </div>
  );
}
