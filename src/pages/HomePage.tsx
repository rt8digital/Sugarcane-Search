import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, Users, MapPin, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const categories = [
    { icon: Users, label: 'Surnames', color: 'bg-blue-100 text-blue-600' },
    { icon: MapPin, label: 'Regions', color: 'bg-green-100 text-green-600' },
    { icon: BookOpen, label: 'Archives', color: 'bg-amber-100 text-amber-600' },
    { icon: History, label: 'Oral History', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-white to-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl text-center"
      >
        <div className="mb-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-white text-5xl font-display font-bold">S</span>
          </div>
          <h1 className="text-6xl font-display font-bold tracking-tight text-slate-900 mb-4">
            SALT
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            South African Lineage Tracer
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group mb-16">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-7 w-7 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for ancestors, surnames, or historical records..."
            className="w-full pl-16 pr-10 py-8 bg-white border-2 border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-2xl font-medium"
          />
          <button 
            type="submit"
            className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-md text-lg"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center p-6 bg-white border-2 border-slate-100 rounded-2xl hover:shadow-lg hover:border-slate-200 transition-all group"
            >
              <div className={`p-4 rounded-xl mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-8 w-8" />
              </div>
              <span className="text-base font-bold text-slate-700">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <footer className="absolute bottom-8 text-slate-400 text-sm">
        &copy; 2026 SALT Heritage Project. All rights reserved.
      </footer>
    </div>
  );
}
