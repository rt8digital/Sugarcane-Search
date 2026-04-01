import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Library, Heart, Users, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ContributePage() {
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


        <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 p-4">
          <h1 className="text-4xl md:text-9xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Support <span className="bg-gradient-to-r from-[#E03C31] via-[#007749] to-[#001489] bg-clip-text text-transparent italic">Heritage.</span>
          </h1>
          <p className="text-lg md:text-3xl text-muted-foreground max-w-2xl mx-auto leading-relaxed border-b-4 border-[#007749]/10 pb-10 md:pb-14 underline decoration-[#FFB81C]/30 decoration-8" style={{ fontFamily: 'var(--font-lora)' }}>
            SALT is an independent initiative aimed at ensuring the digital preservation of historical data. SALT is an acronym for "South African Lineage Tracer" - SALT as a spice is also used to Preserve Food, hence the name. I built this application to be 100% Free to use and access with no intention of AD revenue, to help us maintain this project, we are asking the public to contribute to it, whether through donations, volunteering time to help with the compiling of new documents or historical data or by providing us with missing volumes or any data that could help others connect the dots of their family history.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 py-12 lg:py-16">
        <section className="space-y-10 md:space-y-14">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="p-4 md:p-6 bg-[#001489]/5 rounded-full text-[#001489] border-2 border-[#001489]/10 shadow-lg glow-blue">
              <Library className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Forever Free, Forever Private</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg md:text-2xl" style={{ fontFamily: 'var(--font-lora)' }}>
            We will never charge access to this site, we use an open source development stack while ensuring your privacy when using this site is respected, all processing is done on your browser, all storage is saved in your browser, you are only processing the frontend from our servers when you use this site.
          </p>
          <Button asChild className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-full shadow-[0_20px_50px_rgba(0,119,73,0.3)] hover:shadow-xl transition-all bg-[#007749] hover:bg-[#008f58] text-white border-none cursor-pointer scale-105 hover:scale-110 active:scale-95">
            <a href="#banking" onClick={(e) => { e.preventDefault(); alert("Ilyas Shamoon | FNB | Acc: 62477519840 | Brance Code: 250655 | E WALLET: 0847990432"); }}>
              View Banking Details
            </a>
          </Button>
        </section>

        <section className="space-y-10 md:space-y-14">
          <div className="flex items-center gap-6 md:gap-8">
            <div className="p-4 md:p-6 bg-[#E03C31]/5 rounded-full text-[#E03C31] border-2 border-[#E03C31]/10 shadow-lg glow-red">
              <Heart className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>100% Open Source</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg md:text-2xl" style={{ fontFamily: 'var(--font-lora)' }}>
            While we do not charge access, we do ask for public contributions to assist with the time spent searching for historical documents, processing them to be OCR capable PDF's, scraping the OCR text into searchable data and maintaining / updating our records, kindly look for this project on github if you want to access the data sources directly, SCRAPING THIS SITE DIRECTLY IS PROHIBITED.
          </p>
          <Button asChild className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-full shadow-[0_20px_50px_rgba(0,20,137,0.3)] hover:shadow-xl transition-all bg-[#001489] hover:bg-[#0025a1] text-white border-none cursor-pointer scale-105 hover:scale-110 active:scale-95">
            <a href="https://paypal.me/a7rium" target="_blank" rel="noreferrer">
              Donate via PayPal
            </a>
          </Button>
        </section>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2.5rem] md:rounded-[5rem] bg-white border-4 border-border/40 p-10 md:p-36 text-center flex flex-col items-center space-y-12 md:space-y-20 shadow-[0_48px_80px_-24px_rgba(0,119,73,0.2)] mt-16 md:mt-28 relative overflow-hidden"
      >
        {/* Subtle Decorative Yellow Circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB81C]/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="p-8 md:p-12 bg-[#FFB81C]/10 rounded-full text-[#FFB81C] shadow-inner border-2 border-[#FFB81C]/20 animate-pulse">
          <Users className="w-12 h-12 md:w-20 md:h-20" />
        </div>

        <div className="space-y-6 md:space-y-8">
          <h3 className="text-3xl md:text-7xl font-black text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Help Us Grow!</h3>
          <p className="text-lg md:text-3xl text-muted-foreground max-w-xl mx-auto leading-relaxed border-b-2 border-[#007749]/10 pb-6 md:pb-8 italic font-medium" style={{ fontFamily: 'var(--font-lora)' }}>
            Do you have any old books, documents, photos or any other historical data that could assist others? Reach out to us on how you can contribute to this project.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 w-full max-w-lg">
          <Button asChild variant="outline" className="flex-1 h-16 md:h-18 text-lg font-black rounded-full border-4 border-[#007749]/40 text-[#007749] hover:bg-[#007749]/5 transition-all cursor-pointer hover:border-[#007749] shadow-md">
            <a href="mailto:ilyas@rt8.co.za" className="flex items-center justify-center gap-4">
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
              Email
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-16 md:h-18 text-lg font-black rounded-full border-4 border-[#001489]/40 text-[#001489] hover:bg-[#001489]/5 transition-all cursor-pointer hover:border-[#001489] shadow-md">
            <a href="https://wa.me/27847990432" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-4">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              WhatsApp
            </a>
          </Button>
        </div>
      </motion.div>

    </div>
  );
}
