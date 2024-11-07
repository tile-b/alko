import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();  // Prevent the default prompt from showing
      setDeferredPrompt(e); // Store the event so it can be triggered later
      setShowInstallButton(true); // Show the install button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Function to trigger the install prompt
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();  // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome); // Log the user's choice (either "accepted" or "dismissed")
        setDeferredPrompt(null); // Reset the deferred prompt
        setShowInstallButton(false); // Hide the install button after the prompt
      });
    }
  };

  return (
    <div>
      {showInstallButton && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </div>
  );
};

export default InstallPrompt;
