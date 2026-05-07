import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(245, 168, 155, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2.5 rounded-full transition-all duration-200 z-[80] hover:scale-110"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" style={{ color: 'hsl(var(--foreground))' }} />
          </button>

          {/* Modal Content - Full Page Overlay */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full flex flex-col items-center justify-center px-6 md:px-12 relative"
          >
            {/* Spotlight Effect */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 800px 600px at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
              }}
            />

            <div className="max-w-3xl w-full relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 
                  className="text-5xl md:text-7xl font-bold font-['Crimson_Text'] mb-6"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  What is Pomodoro?
                </h2>
                <p 
                  className="font-['Outfit'] text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  A simple time management method that uses focused 25-minute work sessions followed by short breaks to boost productivity and maintain concentration.
                </p>
              </div>

              {/* How It Works - 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
                {/* Step 1 */}
                <div className="text-center">
                  <p 
                    className="font-['Outfit'] text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: 'hsl(var(--peach))' }}
                  >
                    25
                  </p>
                  <p 
                    className="font-['Outfit'] text-xl md:text-2xl font-bold mb-2"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    Work Minutes
                  </p>
                  <p 
                    className="font-['Outfit'] text-base md:text-lg"
                    style={{ color: 'hsl(var(--foreground))', opacity: 0.8 }}
                  >
                    Focus on a single task
                  </p>
                </div>

                {/* Step 2 - 5% darker green for better contrast */}
                <div className="text-center">
                  <p 
                    className="font-['Outfit'] text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: 'hsl(122, 38%, 79.8%)' }}
                  >
                    5
                  </p>
                  <p 
                    className="font-['Outfit'] text-xl md:text-2xl font-bold mb-2"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    Break Minutes
                  </p>
                  <p 
                    className="font-['Outfit'] text-base md:text-lg"
                    style={{ color: 'hsl(var(--foreground))', opacity: 0.8 }}
                  >
                    Rest and recharge
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <p 
                    className="font-['Outfit'] text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: 'hsl(var(--soft-purple))' }}
                  >
                    15
                  </p>
                  <p 
                    className="font-['Outfit'] text-xl md:text-2xl font-bold mb-2"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    Longer Break
                  </p>
                  <p 
                    className="font-['Outfit'] text-base md:text-lg"
                    style={{ color: 'hsl(var(--foreground))', opacity: 0.8 }}
                  >
                    After 4 sessions
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="text-center mb-8">
                <p 
                  className="font-['Outfit'] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <span 
                    className="font-bold text-xl md:text-2xl"
                    style={{ color: 'hsl(var(--golden-yellow))' }}
                  >
                    Why it works:
                  </span>
                  <br />
                  <span className="mt-2 inline-block">
                    Regular breaks prevent burnout, maintain focus, and help you accomplish more with less mental fatigue.
                  </span>
                </p>
              </div>

              {/* Quick Start */}
              <div className="text-center">
                <p 
                  className="font-['Outfit'] text-base"
                  style={{ color: 'hsl(var(--foreground))', opacity: 0.8 }}
                >
                  Press <kbd className="px-3 py-1 rounded bg-white text-sm font-semibold mx-1">Space</kbd> to start your first session
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;