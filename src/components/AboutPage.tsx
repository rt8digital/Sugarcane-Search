import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Heart, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const AboutPage = () => {
  const navigate = useNavigate();

  const goSearch = () => {
    navigate('/');
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24 md:pb-32 px-4 md:px-8 group">

      <div className="flex justify-start">
        <Button variant="ghost" className="text-muted-foreground hover:text-[#007749] active:scale-95 transition-transform rounded-full px-8 py-3" onClick={goSearch}>
          <ArrowLeft size={16} className="mr-2" /> Back to Search
        </Button>
      </div>

      <header className="text-center space-y-6 md:space-y-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-7xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          About <span className="bg-gradient-to-r from-[#E03C31] via-[#007749] to-[#001489] bg-clip-text text-transparent italic">SALT.</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed border-b-2 border-[#007749]/10 pb-8 md:pb-10 font-medium" style={{ fontFamily: 'var(--font-lora)' }}>
          A digital heritage search engine for South Africa's Indian community
        </p>
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-8 lg:py-10">
        <section className="space-y-10">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-4">
            <div className="p-4 bg-[#007749]/5 rounded-full text-[#007749] border border-[#007749]/10">
              <BookOpen size={28} />
            </div>
            What is SALT?
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg" style={{ fontFamily: 'var(--font-lora)' }}>
            <p>
              SALT is a historical search engine that makes it easy to explore the lives of South Africa's Indian community through decades of biographical records.
            </p>
            <p>
              These digitized records offer a fast, full-text search across multiple editions of the <em className="text-[#001489] font-black italic">Indian Who's Who</em> directories.
            </p>
          </div>
        </section>

        <section className="space-y-10">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-4">
            <div className="p-4 bg-[#E03C31]/5 rounded-full text-[#E03C31] border border-[#E03C31]/10">
              <Clock size={28} />
            </div>
            Why We Built This
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg" style={{ fontFamily: 'var(--font-lora)' }}>
            <p>
              For many South Africans of Indian descent, tracing family history is a profound journey. Traditional archival research is often locked away.
            </p>
            <p>
              SALT democratizes this access, allowing anyone with an internet connection to discover and connect with their heritage.
            </p>
          </div>
        </section>
      </div>

      {/* Data Sources Component - Straight text in a large box (Box UI) */}
      <div className="bg-white border-2 border-border/60 p-8 md:p-20 shadow-2xl relative overflow-hidden group/box">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E03C31] via-[#007749] to-[#001489] opacity-80" />

        <div className="space-y-10 md:space-y-14">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Data Sources</h2>
            <p className="text-[#007749] uppercase tracking-[0.4em] text-[10px] font-black opacity-60">Archive Volumes currently indexed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-10">
            {[
              { title: "Who's Who (1936-37)", desc: "The earliest known edition documenting a pioneering era." },
              { title: "South African Indian (1940)", desc: "Including trade directories and commercial history." },
              { title: "South African Indian (1960)", desc: "Comprehensive mid-century archival update." },
              { title: "Southern Africa Indian (1971-72)", desc: "The final and most complete edition stored locally." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 py-5 border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors px-2">
                <h3 className="font-black text-lg text-foreground flex items-center gap-3">
                  <BookMarked size={16} className="text-[#001489]" />
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium" style={{ fontFamily: 'var(--font-lora)' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground italic font-medium pt-6 border-t border-border/20">
            Original documents graciously provided for research by the <strong className="text-[#001489] font-black">UKZN Gandhi-Luthuli Documentation Centre</strong>
          </p>
        </div>
      </div>

      <div className="text-center pt-12 md:pt-20">
        <Heart size={32} className="mx-auto text-[#E03C31]/20 fill-[#E03C31]/5" />
      </div>

    </div>
  );
};
