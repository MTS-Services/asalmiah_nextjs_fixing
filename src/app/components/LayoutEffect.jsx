// app/components/LayoutEffect.jsx
'use client';
import { useEffect } from 'react';

export default function LayoutEffect() {
  useEffect(() => {
    const applyDirection = () => {
      const savedLang = localStorage.getItem('language') || 'en';
      const html = document.documentElement;

      if (savedLang === 'ar') {
        html.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        html.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
      }
    };

    // Run immediately
    applyDirection();

    // Observe changes (optional: if language changes from other sources)
    const interval = setInterval(applyDirection, 500); // Recheck every 500ms

    return () => clearInterval(interval);
  }, []);

  return null;
}
