import React, { useState } from 'react';
import { X, Copy, Check, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BANKING_DETAILS = [
  { label: 'Account Holder', value: 'Ilyas Shamoon' },
  { label: 'Bank', value: 'FNB (First National Bank)' },
  { label: 'Account Number', value: '62477519840' },
  { label: 'Branch Code', value: '250655' },
  { label: 'E Wallet', value: '0847990432' },
];

interface BankingModalProps {
  onClose: () => void;
}

export default function BankingModal({ onClose }: BankingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const copyAll = () => {
    const allText = BANKING_DETAILS.map(d => `${d.label}: ${d.value}`).join('\n');
    copyToClipboard(allText, -1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Banking Details</h3>
                <p className="text-xs text-gray-400">Support heritage preservation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-3">
            {BANKING_DETAILS.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-orange-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{detail.label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{detail.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(detail.value, index)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-sm transition-all"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={copyAll}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all"
            >
              {copiedIndex === -1 ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy All Details
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
