import { useEffect, useState } from 'react';

const TranslateWidget = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Avoid duplicate script loading
      if (document.querySelector('script[src*="translate_a/element.js"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script.');
        setLoading(false);
      };
      document.body.appendChild(script);
    };

    // Declare the callback globally *before* loading the script
    window.googleTranslateElementInit = () => {
      /* eslint-disable no-undef */
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
          gaTrack: false,
          // Note: `disablePoweredBy` and `attribute` are not valid options anymore
        },
        'google_translate_element'
      );
      setLoading(false);
    };

    setLoading(true);
    addGoogleTranslateScript();

    // Cleanup on unmount
    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Observe for dropdown and language changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dropdown = document.querySelector(
        '#google_translate_element select.goog-te-combo'
      );
      if (dropdown && !dropdown.dataset.listenerAdded) {
        dropdown.dataset.listenerAdded = 'true';
        dropdown.addEventListener('change', (event) => {
          const lang = event.target.value;
          localStorage.setItem('language', lang);
          // Optional: reload to re-apply translation
          // window.location.reload(); // Use sparingly
        });
      }

      // Restore last selected language
      const savedLang = localStorage.getItem('language');
      if (savedLang && dropdown && dropdown.value !== savedLang) {
        dropdown.value = savedLang;
        dropdown.dispatchEvent(new Event('change'));
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='transalte-style'>
      {loading && <div>Loading...</div>}
      <div id='google_translate_element' />
    </div>
  );
};

export default TranslateWidget;
