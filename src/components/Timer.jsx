import React, { useEffect } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timer = () => {
  const {
    sessionType,
    sessionCount,
    currentTheme,
    timeRemaining,
    isRunning,
    breakType,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    start,
    pause,
    resume,
    reset,
    skipSession,
    getSessionLabel
  } = useTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeColors = () => {
    if (currentTheme === 'work') {
      return {
        bg: 'rgba(245, 168, 155, 0.15)',
        text: 'hsl(25 20% 20%)',
        accent: 'hsl(10 82% 78%)',
        border: 'rgba(245, 168, 155, 0.3)'
      };
    } else {
      return {
        bg: 'rgba(200, 230, 201, 0.15)',
        text: 'hsl(25 20% 20%)',
        accent: 'hsl(266 56% 80%)',
        border: 'rgba(200, 230, 201, 0.3)'
      };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          pause();
        } else {
          const initialDuration = sessionType === 'work'
            ? workDuration * 60
            : (breakType === 'long' ? longBreakDuration * 60 : shortBreakDuration * 60);

          if (timeRemaining === initialDuration) {
            start();
          } else {
            resume();
          }
        }
      } else if (e.code === 'KeyR') {
        reset();
      } else if (e.code === 'KeyN') {
        skipSession();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, timeRemaining, sessionType, breakType, workDuration, shortBreakDuration, longBreakDuration, start, pause, resume, reset, skipSession]);

  const initialDurationForSession = () => {
    if (sessionType === 'work') return workDuration * 60;
    return breakType === 'long' ? longBreakDuration * 60 : shortBreakDuration * 60;
  };

  const getSessionProgress = () => {
    const currentInCycle = (sessionCount % 4) + 1;
    return `Session ${currentInCycle} of 4`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderColor: colors.border,
        boxShadow: '0 8px 32px rgba(245, 168, 155, 0.2), 0 4px 16px rgba(212, 165, 212, 0.15)',
        transition: 'all 0.6s ease'
      }}
      className="w-full max-w-[520px] rounded-2xl px-8 md:px-12 py-8 md:py-12 border-2 theme-transition"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          key={sessionType}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            className="inline-block px-4 py-1.5 rounded-full mb-3"
            style={{ 
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              transition: 'all 0.6s ease'
            }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider">
              {sessionType === 'work' ? '🎯 Focus Mode' : breakType === 'long' ? '🌟 Long Break' : '☕ Short Break'}
            </span>
          </motion.div>
          
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2 font-sans text-shadow-soft"
            style={{ 
              color: colors.text,
              transition: 'color 0.6s ease'
            }}
          >
            {getSessionLabel()}
          </h2>
          
          {sessionType === 'work' && (
            <p 
              className="text-sm md:text-base opacity-80 font-sans"
              style={{ 
                color: colors.text,
                transition: 'color 0.6s ease'
              }}
            >
              {getSessionProgress()} before long break
            </p>
          )}
        </motion.div>

        <div
          className="text-6xl md:text-8xl font-bold tracking-tight font-sans text-shadow-soft"
          style={{ 
            color: colors.text,
            transition: 'color 0.6s ease'
          }}
        >
          {formatTime(timeRemaining)}
        </div>

        <div className="flex gap-3 mt-4">
          {!isRunning ? (
            <Button
              onClick={timeRemaining === initialDurationForSession() ? start : resume}
              className="rounded-xl px-8 py-6 font-sans font-medium transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`,
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              {timeRemaining === initialDurationForSession() ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button
              onClick={pause}
              className="rounded-xl px-8 py-6 font-sans font-medium transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`,
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={reset}
            variant="outline"
            className="rounded-xl px-5 py-6 font-sans font-medium transition-all duration-200 hover:scale-105 border-2"
            style={{ 
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease'
            }}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            onClick={skipSession}
            variant="outline"
            className="rounded-xl px-5 py-6 font-sans font-medium transition-all duration-200 hover:scale-105 border-2"
            style={{ 
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease'
            }}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <div 
          className="text-xs md:text-sm opacity-70 mt-2 font-sans"
          style={{ 
            color: colors.text,
            transition: 'color 0.6s ease'
          }}
        >
          <kbd className="px-2 py-1 rounded bg-white bg-opacity-70 shadow-sm">Space</kbd> Start/Pause · 
          <kbd className="px-2 py-1 rounded bg-white bg-opacity-70 shadow-sm ml-2">R</kbd> Reset · 
          <kbd className="px-2 py-1 rounded bg-white bg-opacity-70 shadow-sm ml-2">N</kbd> Skip
        </div>
      </div>
    </motion.div>
  );
};

export default Timer;