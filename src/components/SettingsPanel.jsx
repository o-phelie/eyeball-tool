import React, { useState } from 'react';
import { useTimer, POMODORO_PRESETS } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Bell, Volume2, Clock, RotateCcw, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { 
    soundEnabled, 
    notificationsEnabled, 
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setSoundEnabled, 
    setNotificationsEnabled,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    resetDurationsToDefaults
  } = useTimer();

  const [tempWorkDuration, setTempWorkDuration] = useState(workDuration);
  const [tempShortBreak, setTempShortBreak] = useState(shortBreakDuration);
  const [tempLongBreak, setTempLongBreak] = useState(longBreakDuration);
  const [appliedPreset, setAppliedPreset] = useState(null);

  const handleNotificationToggle = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    
    if (newState && 'Notification' in window && Notification.permission === 'default') {
      try {
        console.log('[SettingsPanel] Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('[SettingsPanel] Permission result:', permission);
      } catch (error) {
        console.error('[SettingsPanel] Error requesting notification permission:', error);
      }
    }
  };

  const handleWorkDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 60) {
      setTempWorkDuration(value);
      setWorkDuration(value);
      setAppliedPreset(null);
    }
  };

  const handleShortBreakChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      setTempShortBreak(value);
      setShortBreakDuration(value);
      setAppliedPreset(null);
    }
  };

  const handleLongBreakChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 60) {
      setTempLongBreak(value);
      setLongBreakDuration(value);
      setAppliedPreset(null);
    }
  };

  const handleResetToDefaults = () => {
    resetDurationsToDefaults();
    setTempWorkDuration(25);
    setTempShortBreak(5);
    setTempLongBreak(15);
    setAppliedPreset(null);
    
    toast({
      title: "Settings Reset",
      description: "Timer durations reset to default values (25/5/15)",
    });
  };

  const applyPreset = (presetName, work, shortBreak, longBreak) => {
    setWorkDuration(work);
    setShortBreakDuration(shortBreak);
    setLongBreakDuration(longBreak);
    setTempWorkDuration(work);
    setTempShortBreak(shortBreak);
    setTempLongBreak(longBreak);
    
    localStorage.setItem('pomodoroWorkDuration', work.toString());
    localStorage.setItem('pomodoroShortBreakDuration', shortBreak.toString());
    localStorage.setItem('pomodoroLongBreakDuration', longBreak.toString());
    
    setAppliedPreset(presetName);
    
    const shortDisplay = shortBreak < 1
      ? `${Math.round(shortBreak * 60)} sec`
      : `${shortBreak} min`;
    const description = `Timer set to ${work} min work / ${shortDisplay} break / ${longBreak} min long break`;
    
    toast({
      title: `${presetName} Applied`,
      description: description,
    });
    
    setTimeout(() => setAppliedPreset(null), 2000);
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg z-30"
        style={{ 
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
          color: 'hsl(var(--primary-foreground))'
        }}
        aria-label="Settings"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 backdrop-blur-sm z-40"
              style={{ backgroundColor: 'rgba(245, 168, 155, 0.2)' }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md z-50 shadow-2xl p-8 overflow-y-auto"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-sans text-shadow-soft" style={{ color: 'hsl(var(--foreground))' }}>
                  Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-70 transition-all duration-200"
                  aria-label="Close settings"
                >
                  <X className="w-6 h-6" style={{ color: 'hsl(var(--foreground))' }} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                    <h3 className="text-lg font-semibold font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                      Timer Durations
                    </h3>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-sans font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                      Quick Presets
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <motion.button
                        onClick={() => applyPreset(POMODORO_PRESETS.classic.name, POMODORO_PRESETS.classic.work, POMODORO_PRESETS.classic.shortBreak, POMODORO_PRESETS.classic.longBreak)}
                        className="preset-button group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={appliedPreset === POMODORO_PRESETS.classic.name ? {
                          boxShadow: ['0 0 0 0 rgba(245, 168, 155, 0.4)', '0 0 0 10px rgba(245, 168, 155, 0)']
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="preset-icon">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-sans font-semibold text-base">{POMODORO_PRESETS.classic.name}</div>
                            <div className="font-sans text-xs opacity-90">{POMODORO_PRESETS.classic.description}</div>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={() => applyPreset(POMODORO_PRESETS.eyeStrain.name, POMODORO_PRESETS.eyeStrain.work, POMODORO_PRESETS.eyeStrain.shortBreak, POMODORO_PRESETS.eyeStrain.longBreak)}
                        className="preset-button group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={appliedPreset === POMODORO_PRESETS.eyeStrain.name ? {
                          boxShadow: ['0 0 0 0 rgba(245, 168, 155, 0.4)', '0 0 0 10px rgba(245, 168, 155, 0)']
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="preset-icon">
                            <Eye className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-sans font-semibold text-base">{POMODORO_PRESETS.eyeStrain.name}</div>
                            <div className="font-sans text-xs opacity-90">{POMODORO_PRESETS.eyeStrain.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-sans font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                      Custom Durations
                    </p>
                    
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.1)' }}>
                      <Label htmlFor="work-duration" className="font-sans font-medium mb-2 block" style={{ color: 'hsl(var(--foreground))' }}>
                        Work Session (minutes)
                      </Label>
                      <Input
                        id="work-duration"
                        type="number"
                        min="1"
                        max="60"
                        value={tempWorkDuration}
                        onChange={handleWorkDurationChange}
                        className="w-full font-sans"
                        style={{ 
                          borderColor: 'hsl(var(--border))',
                          backgroundColor: 'white',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <p className="text-xs mt-1 opacity-70 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                        Default: 25 minutes
                      </p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.1)' }}>
                      <Label htmlFor="short-break" className="font-sans font-medium mb-2 block" style={{ color: 'hsl(var(--foreground))' }}>
                        Short Break (minutes)
                      </Label>
                      <Input
                        id="short-break"
                        type="number"
                        min="1"
                        max="30"
                        value={tempShortBreak}
                        onChange={handleShortBreakChange}
                        className="w-full font-sans"
                        style={{ 
                          borderColor: 'hsl(var(--border))',
                          backgroundColor: 'white',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <p className="text-xs mt-1 opacity-70 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                        Default: 5 minutes
                      </p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.1)' }}>
                      <Label htmlFor="long-break" className="font-sans font-medium mb-2 block" style={{ color: 'hsl(var(--foreground))' }}>
                        Long Break (minutes)
                      </Label>
                      <Input
                        id="long-break"
                        type="number"
                        min="1"
                        max="60"
                        value={tempLongBreak}
                        onChange={handleLongBreakChange}
                        className="w-full font-sans"
                        style={{ 
                          borderColor: 'hsl(var(--border))',
                          backgroundColor: 'white',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <p className="text-xs mt-1 opacity-70 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                        Default: 15 minutes
                      </p>
                    </div>

                    <Button
                      onClick={handleResetToDefaults}
                      variant="outline"
                      className="w-full rounded-lg px-4 py-3 font-sans font-medium transition-all duration-200 hover:scale-105 border-2"
                      style={{ 
                        borderColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                    Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.1)' }}>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                        <div>
                          <label htmlFor="sound-toggle" className="font-sans font-medium cursor-pointer" style={{ color: 'hsl(var(--foreground))' }}>
                            Sound Notifications
                          </label>
                          <p className="text-sm opacity-70 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                            Play sound on session changes
                          </p>
                        </div>
                      </div>
                      <button
                        id="sound-toggle"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200`}
                        style={{ 
                          backgroundColor: soundEnabled ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                        }}
                        role="switch"
                        aria-checked={soundEnabled}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ left: soundEnabled ? '28px' : '4px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 168, 155, 0.1)' }}>
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                        <div>
                          <label htmlFor="notification-toggle" className="font-sans font-medium cursor-pointer" style={{ color: 'hsl(var(--foreground))' }}>
                            Browser Notifications
                          </label>
                          <p className="text-sm opacity-70 font-sans" style={{ color: 'hsl(var(--foreground))' }}>
                            Get notified when sessions start
                          </p>
                        </div>
                      </div>
                      <button
                        id="notification-toggle"
                        onClick={handleNotificationToggle}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200`}
                        style={{ 
                          backgroundColor: notificationsEnabled ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                        }}
                        role="switch"
                        aria-checked={notificationsEnabled}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ left: notificationsEnabled ? '28px' : '4px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;