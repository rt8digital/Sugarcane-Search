import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="w-full flex-1 flex flex-col items-center"
      style={{ isolation: 'isolate' }}
      {...props}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col px-6">
        {children}
      </div>
    </motion.div>
  );
};
