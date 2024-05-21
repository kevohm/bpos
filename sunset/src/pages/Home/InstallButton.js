import React, { useState, useEffect } from 'react';

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the browser's default install prompt
      event.preventDefault();
      // Store the event for later use
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check for any existing prompt
    const existingPrompt = localStorage.getItem('deferredPrompt');
    if (existingPrompt) {
      setDeferredPrompt(JSON.parse(existingPrompt));
      localStorage.removeItem('deferredPrompt');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Force component update to ensure button display
    forceUpdate();
  }, [deferredPrompt]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the browser's install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Reset the deferredPrompt variable
        setDeferredPrompt(null);
      });
    }
  };

  // Helper function to force component update
  const [, forceUpdate] = useState();

  return (
    <button id="installButton" style={{ display: deferredPrompt ? 'block' : 'none' }} onClick={handleInstallClick}>
      Install App
    </button>
  );
}

export default InstallButton;
