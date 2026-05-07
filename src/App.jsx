import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TimerProvider } from '@/contexts/TimerContext';
import HomePage from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <TimerProvider>
      <Helmet>
        <title>Pomodoro Timer | Stay Focused & Productive</title>
        <meta name="description" content="A beautiful Pomodoro timer to help you stay focused and productive. Work for 25 minutes, take 5-minute breaks, and enjoy a long break after 4 sessions." />
      </Helmet>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      
      <Toaster />
    </TimerProvider>
  );
}

export default App;