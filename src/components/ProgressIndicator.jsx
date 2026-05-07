import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { motion } from 'framer-motion';

const ProgressIndicator = () => {
  const { sessionType, sessionCount } = useTimer();

  if (sessionType === 'rest') {
    return null;
  }

  const currentInCycle = (sessionCount % 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col items-center gap-4 mt-6"
    >
      <div className="flex gap-3 md:gap-4">
        {[0, 1, 2, 3].map((index) => {
          const isCompleted = index < currentInCycle;
          const isCurrent = index === currentInCycle;
          const isUpcoming = index > currentInCycle;

          return (
            <motion.div
              key={index}
              className="relative"
              animate={isCurrent ? {
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isCurrent ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 shadow-sm`}
                style={{
                  backgroundColor: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'transparent',
                  border: isUpcoming ? '2px solid hsl(var(--primary))' : 'none',
                  opacity: isCompleted || isCurrent ? 1 : 0.4,
                  boxShadow: isCompleted || isCurrent ? '0 2px 8px rgba(245, 168, 155, 0.4)' : 'none'
                }}
              />
            </motion.div>
          );
        })}
      </div>
      
      <motion.p 
        className="text-sm font-sans opacity-80 text-shadow-soft"
        style={{ color: 'hsl(var(--foreground))' }}
      >
        Session {currentInCycle + 1} of 4
      </motion.p>
    </motion.div>
  );
};

export default ProgressIndicator;