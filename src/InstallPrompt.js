import React, { useState, useEffect } from 'react';
import './button.css'

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default install prompt from appearing
      setDeferredPrompt(e); // Store the event to trigger later
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();  // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome); // Log user choice (either 'accepted' or 'dismissed')
        setDeferredPrompt(null); // Reset deferredPrompt
      });
    }
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center',paddingTop: '40px'}}>
      <button class="buttonD" onClick={handleInstallClick}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px">
    <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
    <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
    <g id="SVGRepo_iconCarrier">
      <g id="Interface / Download">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#f1f1f1" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path>
      </g>
    </g>
  </svg>
  Skini Aplikaciju
</button>
    </div>
  );
};

export default InstallPrompt;
