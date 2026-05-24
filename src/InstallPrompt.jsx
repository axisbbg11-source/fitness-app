import React, { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function beforeInstallHandler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    function installedHandler() {
      setDeferredPrompt(null);
      setVisible(false);
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
    // optional: report choice
    console.log('PWA install choice:', choice.outcome);
  };

  if (!visible) return null;

  return (
    <div style={{position: 'fixed', right: 16, bottom: 16, zIndex: 1000}}>
      <button
        onClick={handleInstallClick}
        style={{
          background: '#111827',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        Install App
      </button>
    </div>
  );
}
