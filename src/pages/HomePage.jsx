import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Timer from '@/components/Timer';
import ProgressIndicator from '@/components/ProgressIndicator';
import RestGuidance from '@/components/RestGuidance';
import SettingsPanel from '@/components/SettingsPanel';
import FirstTimeUserModal from '@/components/FirstTimeUserModal';
import NotificationManager from '@/components/NotificationManager';
import InfoModal from '@/components/InfoModal';
import InfoLink from '@/components/InfoLink';

const HomePage = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('firstTimeUserSeen');
    if (!hasSeenWelcome) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const handleCloseFirstTimeModal = () => {
    setShowFirstTimeModal(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://horizons-cdn.hostinger.com/3a45db2b-9a6c-4099-8b66-130131c99bdb/ed3a6179b6e5bca1e74308b3d0bac087.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        imageRendering: '-webkit-optimize-contrast',
        WebkitBackfaceVisibility: 'hidden',
        MozBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      <div 
        className={`relative z-10 w-full max-w-[520px] flex flex-col items-center transition-all duration-300 ${
          showFirstTimeModal ? 'blur-sm scale-95' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex flex-col items-center"
          >
            <Timer />
            <ProgressIndicator />
            <RestGuidance />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6"
          >
            <InfoLink onClick={() => setIsInfoModalOpen(true)} />
          </motion.div>
        </motion.div>
      </div>

      <div className={showFirstTimeModal ? 'blur-sm' : ''}>
        <SettingsPanel />
      </div>
      
      <NotificationManager />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <FirstTimeUserModal isOpen={showFirstTimeModal} onClose={handleCloseFirstTimeModal} />
    </div>
  );
};

export default HomePage;