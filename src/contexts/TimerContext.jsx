import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};

const DEFAULT_WORK_DURATION = 25; // minutes
const DEFAULT_SHORT_BREAK_DURATION = 5; // minutes
const DEFAULT_LONG_BREAK_DURATION = 15; // minutes
const SESSIONS_BEFORE_LONG_BREAK = 4;

// Pomodoro Presets
export const POMODORO_PRESETS = {
  classic: {
    name: 'Classic Pomodoro',
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    description: 'Traditional 25/5/15 minute intervals'
  },
  eyeStrain: {
    name: 'Eye Strain Pomodoro',
    work: 20,
    shortBreak: 0.33, // 20 seconds (20/60 = 0.333...)
    longBreak: 20,
    description: '20-20-20 rule: Every 20 minutes, look 20 feet away for 20 seconds'
  },
  deep: {
    name: 'Deep Work',
    work: 50,
    shortBreak: 10,
    longBreak: 30,
    description: 'Extended focus sessions for deep concentration'
  },
  short: {
    name: 'Short Sprint',
    work: 15,
    shortBreak: 3,
    longBreak: 10,
    description: 'Quick bursts of focused work'
  }
};

export const TimerProvider = ({ children }) => {
  // Load custom durations from localStorage
  const [workDuration, setWorkDurationState] = useState(() => {
    const saved = localStorage.getItem('pomodoroWorkDuration');
    return saved ? parseInt(saved, 10) : DEFAULT_WORK_DURATION;
  });
  
  const [shortBreakDuration, setShortBreakDurationState] = useState(() => {
    const saved = localStorage.getItem('pomodoroShortBreakDuration');
    return saved ? parseFloat(saved) : DEFAULT_SHORT_BREAK_DURATION;
  });
  
  const [longBreakDuration, setLongBreakDurationState] = useState(() => {
    const saved = localStorage.getItem('pomodoroLongBreakDuration');
    return saved ? parseInt(saved, 10) : DEFAULT_LONG_BREAK_DURATION;
  });

  const [sessionType, setSessionType] = useState('work'); // 'work' | 'rest'
  const [sessionCount, setSessionCount] = useState(0); // Completed work sessions
  const [currentTheme, setCurrentTheme] = useState('work');
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [totalTime, setTotalTime] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakType, setBreakType] = useState('short'); // 'short' | 'long'
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const intervalRef = useRef(null);
  const savedAdvanceSession = useRef(null);
  const onPhaseChangeRef = useRef(null);
  const audioContextRef = useRef(null);
  const prevSessionTypeRef = useRef(sessionType);

  // Initialize AudioContext on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('pomodoroWorkDuration', workDuration.toString());
  }, [workDuration]);

  useEffect(() => {
    localStorage.setItem('pomodoroShortBreakDuration', shortBreakDuration.toString());
  }, [shortBreakDuration]);

  useEffect(() => {
    localStorage.setItem('pomodoroLongBreakDuration', longBreakDuration.toString());
  }, [longBreakDuration]);

  // Session type change detection for notifications
  useEffect(() => {
    if (prevSessionTypeRef.current !== sessionType) {
      if (onPhaseChangeRef.current) {
        try {
          onPhaseChangeRef.current(sessionType, breakType);
        } catch (err) {
          console.error('[TimerContext] Error in phase change callback:', err);
        }
      }
      
      prevSessionTypeRef.current = sessionType;
    }
  }, [sessionType, breakType, isRunning]);

  // Update theme when session type changes
  useEffect(() => {
    setCurrentTheme(sessionType);
  }, [sessionType]);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      
      const createOscillator = (freq, oscType = 'sine', startTime, duration, attack = 0.1, decay = 1.0, vol = 0.3) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      if (type === 'work-start') {
        // Energetic, focused sound
        createOscillator(659.25, 'sine', now, 1.5, 0.05, 1.4);
        createOscillator(1318.5, 'sine', now, 1.5, 0.1, 1.2, 0.05);
      } else if (type === 'break-start') {
        // Calm, soothing sound
        createOscillator(220, 'sine', now, 1.5, 0.3, 1.2, 0.25);
      } else if (type === 'long-break-start') {
        // Warm, encouraging multi-note
        createOscillator(220, 'triangle', now, 2.0, 0.2, 1.8, 0.15);
        createOscillator(277.18, 'sine', now + 0.1, 1.9, 0.2, 1.7, 0.1);
        createOscillator(329.63, 'sine', now + 0.2, 1.8, 0.2, 1.6, 0.1);
      } else if (type === 'reset') {
        createOscillator(880, 'sine', now, 0.6, 0.02, 0.5, 0.15);
      }
    } catch (error) {
      console.error('[TimerContext] Error playing sound:', error);
    }
  }, [soundEnabled]);

  const advanceSession = useCallback(() => {
    setSessionType(prev => {
      if (prev === 'work') {
        // Work session completed
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);
        
        // Determine break type
        if (newSessionCount % SESSIONS_BEFORE_LONG_BREAK === 0) {
          // Long break
          setBreakType('long');
          playSound('long-break-start');
          setTotalTime(longBreakDuration * 60);
          setTimeRemaining(longBreakDuration * 60);
        } else {
          // Short break
          setBreakType('short');
          playSound('break-start');
          setTotalTime(shortBreakDuration * 60);
          setTimeRemaining(shortBreakDuration * 60);
        }
        return 'rest';
      } else {
        // Break completed, start new work session
        playSound('work-start');
        setTotalTime(workDuration * 60);
        setTimeRemaining(workDuration * 60);
        return 'work';
      }
    });
  }, [sessionCount, workDuration, shortBreakDuration, longBreakDuration, playSound]);

  // Keep the callback ref in sync so the stable interval always calls the latest advanceSession
  useEffect(() => {
    savedAdvanceSession.current = advanceSession;
  }, [advanceSession]);

  // Stable interval — only restarts when isRunning changes, no drift from timeRemaining deps
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          savedAdvanceSession.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = () => {
    initAudio();
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    initAudio();
    setIsRunning(true);
  };

  const reset = () => {
    initAudio();
    playSound('reset');
    setIsRunning(false);
    
    prevSessionTypeRef.current = 'work';
    
    setSessionType('work');
    setSessionCount(0);
    setBreakType('short');
    setCurrentTheme('work');
    setTimeRemaining(workDuration * 60);
    setTotalTime(workDuration * 60);
  };

  const skipSession = () => {
    initAudio();
    advanceSession();
  };

  const setWorkDuration = (minutes) => {
    const duration = Math.max(1, Math.min(60, minutes)); // 1-60 minutes
    setWorkDurationState(duration);
    
    // Update current timer if in work session and not running
    if (sessionType === 'work' && !isRunning) {
      setTimeRemaining(duration * 60);
      setTotalTime(duration * 60);
    }
  };

  const setShortBreakDuration = (minutes) => {
    const duration = Math.max(0.33, Math.min(30, minutes)); // 0.33-30 minutes (20 seconds to 30 minutes)
    setShortBreakDurationState(duration);
    
    // Update current timer if in short break and not running
    if (sessionType === 'rest' && breakType === 'short' && !isRunning) {
      setTimeRemaining(duration * 60);
      setTotalTime(duration * 60);
    }
  };

  const setLongBreakDuration = (minutes) => {
    const duration = Math.max(1, Math.min(60, minutes)); // 1-60 minutes
    setLongBreakDurationState(duration);
    
    // Update current timer if in long break and not running
    if (sessionType === 'rest' && breakType === 'long' && !isRunning) {
      setTimeRemaining(duration * 60);
      setTotalTime(duration * 60);
    }
  };

  const resetDurationsToDefaults = () => {
    setWorkDuration(DEFAULT_WORK_DURATION);
    setShortBreakDuration(DEFAULT_SHORT_BREAK_DURATION);
    setLongBreakDuration(DEFAULT_LONG_BREAK_DURATION);
  };

  const applyPreset = (presetKey) => {
    const preset = POMODORO_PRESETS[presetKey];
    if (!preset) return;

    // Pause timer if running
    if (isRunning) {
      setIsRunning(false);
    }

    // Apply preset durations
    setWorkDuration(preset.work);
    setShortBreakDuration(preset.shortBreak);
    setLongBreakDuration(preset.longBreak);

    // Reset to work session
    setSessionType('work');
    setSessionCount(0);
    setBreakType('short');
    setCurrentTheme('work');
    setTimeRemaining(preset.work * 60);
    setTotalTime(preset.work * 60);
  };

  const getSessionLabel = () => {
    if (sessionType === 'work') {
      return 'Work Session';
    } else {
      return breakType === 'long' ? 'Long Break' : 'Short Break';
    }
  };

  const registerPhaseChangeCallback = (callback) => {
    onPhaseChangeRef.current = callback;
  };

  const value = {
    sessionType,
    sessionCount,
    currentTheme,
    timeRemaining,
    totalTime,
    isRunning,
    breakType,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    soundEnabled,
    notificationsEnabled,
    start,
    pause,
    resume,
    reset,
    skipSession,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    resetDurationsToDefaults,
    applyPreset,
    getSessionLabel,
    setSoundEnabled,
    setNotificationsEnabled,
    registerPhaseChangeCallback,
    playSound
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};