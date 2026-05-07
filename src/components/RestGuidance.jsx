import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';

const RestGuidance = () => {
  const { sessionType, breakType, timeRemaining } = useTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGuidance = () => {
    if (sessionType === 'rest') {
      if (breakType === 'long') {
        return {
          icon: <Sparkles className="w-12 h-12" style={{ color: 'hsl(var(--tertiary))' }} />,
          title: 'Long Break Time',
          suggestions: [
            'Take a walk outside',
            'Stretch your body',
            'Grab a healthy snack',
            'Meditate or practice breathing',
            'Rest your eyes and mind'
          ],
          message: 'You\'ve earned this! Take a proper break to recharge.',
          accentColor: 'hsl(var(--tertiary))',
          bgColor: 'rgba(201, 177, 232, 0.15)',
          borderColor: 'rgba(201, 177, 232, 0.3)'
        };
      } else {
        return {
          icon: <Coffee className="w-12 h-12" style={{ color: 'hsl(var(--success))' }} />,
          title: 'Short Break',
          suggestions: [
            'Stand up and stretch',
            'Grab a glass of water',
            'Look away from the screen',
            'Take a few deep breaths',
            'Walk around briefly'
          ],
          message: 'Quick break! Stay nearby and recharge.',
          accentColor: 'hsl(var(--success))',
          bgColor: 'rgba(200, 230, 201, 0.15)',
          borderColor: 'rgba(200, 230, 201, 0.3)'
        };
      }
    }
    return null;
  };

  const guidance = getGuidance();

  return (
    <AnimatePresence mode="wait">
      {guidance && (
        <motion.div
          key={breakType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mt-8 text-center max-w-md p-6 rounded-xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${guidance.borderColor}`,
            boxShadow: '0 4px 20px rgba(245, 168, 155, 0.15), 0 2px 8px rgba(212, 165, 212, 0.1)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="mb-4 inline-block"
          >
            {guidance.icon}
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-2 font-sans text-shadow-soft" style={{ color: 'hsl(var(--foreground))' }}>
            {guidance.title}
          </h3>
          
          <p className="text-base mb-4 opacity-80 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
            {guidance.message}
          </p>

          <div className="text-sm mb-4 space-y-2 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
            <p className="font-semibold">Suggested activities:</p>
            <ul className="space-y-1">
              {guidance.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: guidance.accentColor }} />
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>

          <div 
            className="text-xs opacity-70 font-sans"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Time remaining: {formatTime(timeRemaining)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RestGuidance;