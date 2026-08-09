import React from 'react';
import { motion } from 'framer-motion';

// Reusing the SleekPlane SVG for consistency
const LoadingPlane = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
  </svg>
);

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        
        {/* Trailing Tail (Rotating Gradient Ring) */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-green/80 border-r-brand-green/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Static Circle for structure */}
        <div className="absolute inset-4 rounded-full border border-gray-100" />

        {/* Flying Plane Container - Rotates with the ring */}
        <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
             {/* Plane Icon - Offset to sit on the ring */}
             {/* Rotated 90deg to align with the tangent of the circle's motion (which is clockwise) */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoadingPlane className="w-8 h-8 text-brand-navy transform rotate-90" />
             </div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-brand-navy tracking-tight">
            Long Vacation<span className="text-brand-green">.</span>
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-2 animate-pulse">Taking off...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;