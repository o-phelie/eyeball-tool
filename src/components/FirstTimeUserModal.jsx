import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Timer, Coffee, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FirstTimeUserModal = ({ isOpen, onClose }) => {
  const handleGetStarted = () => {
    localStorage.setItem('firstTimeUserSeen', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 modal-backdrop"
            style={{
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(245, 168, 155, 0.2)'
            }}
            onClick={handleGetStarted}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              className="w-full max-w-[600px] rounded-2xl shadow-2xl p-6 md:p-8 relative pointer-events-auto"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 168, 155, 0.3)',
                boxShadow: '0 8px 32px rgba(245, 168, 155, 0.25), 0 4px 16px rgba(212, 165, 212, 0.2)'
              }}
            >
              <button
                onClick={handleGetStarted}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-70 transition-all duration-200 z-10"
                aria-label="Close welcome modal"
              >
                <X className="w-5 h-5" style={{ color: 'hsl(var(--foreground))' }} />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(245, 168, 155, 0.2)' }}>
                  <Timer className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                
                <div className="flex-1 pr-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 font-sans text-shadow-soft" style={{ color: 'hsl(var(--foreground))' }}>
                    What is Pomodoro?
                  </h2>
                  
                  <div className="space-y-4 mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.15)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                        <p className="font-sans text-sm md:text-base font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                          A Simple Time Management Method
                        </p>
                      </div>
                      <p className="font-sans text-sm leading-relaxed opacity-80" style={{ color: 'hsl(var(--foreground))' }}>
                        The Pomodoro Technique is a productivity method that helps you work smarter, not harder. It's designed to keep you focused and energized throughout your day!
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="font-sans text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                        How it works:
                      </p>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(245, 168, 155, 0.2)' }}>
                          <Timer className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                        </div>
                        <div>
                          <p className="font-sans text-sm md:text-base font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                            1. Work for 25 minutes
                          </p>
                          <p className="font-sans text-xs opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
                            Focus on a single task without distractions
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(200, 230, 201, 0.3)' }}>
                          <Coffee className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} />
                        </div>
                        <div>
                          <p className="font-sans text-sm md:text-base font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                            2. Take a 5-minute break
                          </p>
                          <p className="font-sans text-xs opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
                            Step away, stretch, hydrate, or relax
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(201, 177, 232, 0.3)' }}>
                          <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--tertiary))' }} />
                        </div>
                        <div>
                          <p className="font-sans text-sm md:text-base font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                            3. After 4 sessions, take a longer 15-minute break
                          </p>
                          <p className="font-sans text-xs opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
                            Recharge fully before starting a new cycle
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 216, 155, 0.2)' }}>
                      <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Why it helps you focus:
                      </p>
                      <ul className="space-y-1.5 text-xs md:text-sm opacity-80 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                        <li>✨ <strong>Manageable chunks:</strong> 25 minutes feels doable, not overwhelming</li>
                        <li>⚡ <strong>Stay fresh:</strong> Regular breaks prevent burnout and mental fatigue</li>
                        <li>🎯 <strong>Beat procrastination:</strong> Knowing a break is coming makes it easier to start</li>
                        <li>🧠 <strong>Boost productivity:</strong> Your brain works better with focused intervals</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'rgba(212, 165, 212, 0.15)' }}>
                    <p className="font-sans text-xs font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>
                      💡 Quick Tip:
                    </p>
                    <p className="font-sans text-xs opacity-80" style={{ color: 'hsl(var(--foreground))' }}>
                      Press <kbd className="px-1.5 py-0.5 rounded bg-white shadow-sm text-xs">Space</kbd> to start your first session. You've got this!
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleGetStarted}
                    className="rounded-lg px-6 py-2 font-sans font-medium transition-all duration-200 hover:scale-105 w-full md:w-auto"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                      color: 'hsl(var(--primary-foreground))',
                      border: 'none'
                    }}
                  >
                    Let's Get Started!
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FirstTimeUserModal;