import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, BookMarked, Library, Heart, Users, Mail, MessageCircle, ExternalLink, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import BankingModal from './BankingModal';

interface AboutPageProps {
  onClose: () => void;
  onViewSource: () => void;
}

const GITHUB_URL = 'https://github.com/rt8digital/Sugarcane-Search';
const PAYPAL_URL = 'https://paypal.me/a7rium';
const WHATSAPP_URL = 'https://wa.me/27847990432';
const EMAIL = 'ilyas@rt8.co.za';

export default function AboutPage({ onClose, onViewSource }: AboutPageProps) {
  const [showBanking, setShowBanking] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#fafafa] overflow-y-auto"
    >
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onViewSource}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Source
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            About <span className="text-orange-600 italic">SALT.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed border-b-2 border-orange-100 pb-8">
            A digital heritage search engine for South Africa&apos;s diverse community
          </p>
        </motion.header>

        {/* What is SALT / Why We Built This */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <BookOpen className="w-5 h-5" />
              </div>
              What is SALT?
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                SALT is a historical search engine that makes it easy to explore the lives of South Africa&apos;s community through decades of biographical records from public sources.
              </p>
              <p>
                These digitized records offer a fast, full-text search across multiple editions of the <em className="text-orange-600 font-semibold">Indian Who&apos;s Who</em> directories - the Original compilation credits of these initial data sources belongs to the UKZN - University of KwaZulu-Natal.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <Clock className="w-5 h-5" />
              </div>
              Why We Built This
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                For many South Africans of migrant descent, tracing family history is a profound journey. Traditional archival research is often locked away behind institutions and paywalls.
              </p>
              <p>
                SALT democratizes this access, allowing anyone with an internet connection to research these public archives and connect the branches of their family tree. If this project has helped you in any way, kindly consider contributing to it - my banking details are the bottom of this page :)
              </p>
            </div>
          </motion.section>
        </div>

        {/* The Meaning Behind SALT */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Heart className="w-5 h-5" />
            </div>
            The Meaning Behind the Name
          </h2>
          <p className="text-gray-600 leading-relaxed">
            SALT is an acronym for &ldquo;South African Lineage Tracer&rdquo; &mdash; salt as a spice is also used to <strong>preserve food</strong>, which reflects our mission to preserve historical data for future generations. I built this application to be 100% free to use and access with no intention of ad revenue.
          </p>
        </motion.section>

        {/* Data Sources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mt-1">Archive Volumes Currently Indexed</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Who's Who (1936-37)", desc: "The earliest known edition documenting a pioneering era." },
                { title: "South African Indian (1940)", desc: "Including trade directories and commercial history." },
                { title: "South African Indian (1960)", desc: "Comprehensive mid-century archival update." },
                { title: "Southern Africa Indian (1971-72)", desc: "The final and most complete edition stored locally." },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-orange-500" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 italic text-center border-t border-gray-100 pt-4">
              Original documents graciously provided for research by the <strong className="text-orange-600">UKZN Gandhi-Luthuli Documentation Centre</strong>, while these documents are in the public domain, the digitization (OCR) and processing efforts to make them searchable on this platform were done by me. I am committed to expanding our indexed archives as we continue to discover and process more historical records.
            </p>
          </div>
        </motion.section>

        {/* Forever Free */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Forever Free</h2>
              <p className="text-gray-600 leading-relaxed mt-2">
                We will never charge access to this site. We use an open source development stack while ensuring your privacy is respected. All processing is done in your browser, all storage is saved in your browser. You are only processing the frontend from our servers when you use this site.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Open Source */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Open Source</h2>
              <p className="text-gray-600 leading-relaxed mt-2">
                While we do not charge for access, we do ask for public contributions to assist with the time spent searching for historical documents, processing them to be OCR-capable PDFs, scraping the OCR text into searchable data, and maintaining / updating our records. Look for this project on GitHub if you want to access the data sources or contribute to them directly.
                <br/>
                Disclaimer: While i have made the most efforts to ensure that every Page is indexed, Converting scanned images to OCR is not perfect, and some pages may be missing or have incomplete data. If you find any issues or want to contribute to this project, please reach out to me via email or WhatsApp.
              </p>
              <button
                onClick={onViewSource}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all"
              >
                <ExternalLink className="w-4 h-4" /> View on GitHub
              </button>
            </div>
          </div>
        </motion.section>

        {/* Help Us Grow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-8 md:p-12 bg-white border border-gray-100 rounded-3xl shadow-sm text-center"
        >
          <div className="p-4 bg-orange-50 rounded-full text-orange-600 w-fit mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Help Us Grow</h3>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mt-3 border-b border-gray-100 pb-6">
            Do you have any old books, documents, photos or any other historical data that could assist others? Reach out to us on how you can contribute to this project.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <a
              href={`mailto:${EMAIL}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-200 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-all"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </motion.section>

        {/* Banking Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Support Heritage</h2>
              <p className="text-gray-600 leading-relaxed mt-2">
                SALT is a passion project built on the belief that everyone should have access to their history. Support our mission to digitize the past.
              </p>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => setShowBanking(true)}
                  className="w-full px-5 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all text-left"
                >
                  View Banking Details
                </button>
                <a
                  href={PAYPAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all text-center"
                >
                  Donate via PayPal
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Banking Modal */}
        {showBanking && <BankingModal onClose={() => setShowBanking(false)} />}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            South African Lineage Tracer &middot; Preserving history and making archival records accessible.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
