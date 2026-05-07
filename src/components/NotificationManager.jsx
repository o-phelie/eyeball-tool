import React, { useEffect, useRef } from 'react';
import { useTimer } from '@/contexts/TimerContext';

const NotificationManager = () => {
  const { notificationsEnabled, registerPhaseChangeCallback } = useTimer();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handlePhaseChange = async (sessionType, breakType) => {
      // Skip notification on initial mount
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (!notificationsEnabled) {
        console.log('[NotificationManager] Notifications disabled');
        return;
      }

      if (!('Notification' in window)) {
        console.log('[NotificationManager] Notifications not supported');
        return;
      }

      let permission = Notification.permission;
      
      if (permission === 'default') {
        console.log('[NotificationManager] Requesting permission...');
        try {
          permission = await Notification.requestPermission();
          console.log('[NotificationManager] Permission granted:', permission);
        } catch (error) {
          console.error('[NotificationManager] Permission request error:', error);
          return;
        }
      }

      if (permission === 'granted') {
        let title, body, icon;

        if (sessionType === 'work') {
          title = '🎯 Work Session Started';
          body = 'Time to focus! Stay concentrated on your task.';
          icon = '🎯';
        } else if (sessionType === 'rest') {
          if (breakType === 'long') {
            title = '🌟 Long Break Time';
            body = 'Great work! Take a 15-minute break to recharge.';
            icon = '🌟';
          } else {
            title = '☕ Short Break Time';
            body = 'Take a 5-minute break. Stretch and refresh!';
            icon = '☕';
          }
        }

        try {
          const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            requireInteraction: false,
            silent: false
          });

          setTimeout(() => {
            notification.close();
          }, 5000);

          console.log('[NotificationManager] Notification shown:', title);
        } catch (error) {
          console.error('[NotificationManager] Error showing notification:', error);
        }
      } else {
        console.log('[NotificationManager] Permission denied or dismissed');
      }
    };

    registerPhaseChangeCallback(handlePhaseChange);
  }, [notificationsEnabled, registerPhaseChangeCallback]);

  return null;
};

export default NotificationManager;