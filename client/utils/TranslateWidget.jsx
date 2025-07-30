import { useEffect, useState } from "react";

const TranslateWidget = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {

    // Load the Google Translate script
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    const googleTranslateElementInit = () => {

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // Set your default language here
          includedLanguages: "en,ar", // Include only English and Arabic
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // Use SIMPLE layout
          autoDisplay: false,
          multilanguagePage: true,
          gaTrack: "no",
          disablePoweredBy: true,
          attribute: false,
        },
        "google_translate_element"
      );
    };

    window.googleTranslateElementInit = googleTranslateElementInit;
    addGoogleTranslateScript();

    const removeDuplicateLanguageSelectors = () => {
      const languageSelectors = document.getElementsByClassName(
        "skiptranslate goog-te-gadget"
      );

      const spanRemove = document.getElementsByClassName(
        "VIpgJd-ZVi9od-xl07Ob-lTBxed"
      );
      // Check if there are any span elements
      if (spanRemove.length > 0) {
        // Remove all but the last span element if there are duplicates
        if (spanRemove?.length > 1) {
          for (let i = 0; i < spanRemove?.length - 1; i++) {
            spanRemove[i].remove();
          }
        }
        // Loop through the span elements to get the language text
        for (let i = 0; i < spanRemove.length; i++) {
          const spanElement = spanRemove[i]?.querySelector("span");
          if (spanElement && spanElement?.textContent?.trim() != '' && spanElement?.textContent?.trim() != "Select Language") {
            const currentLanguage = localStorage.getItem("language");
            localStorage.setItem("language", spanElement?.textContent?.trim());
            if (spanElement?.textContent?.trim() !== currentLanguage) {
              setLoading(true); 
              window.location.reload(); // Refresh the page
            }
          }
        }
      }
      const dropdown = document.querySelector(".goog-te-combo");
      if (dropdown) {
        dropdown.addEventListener("change", (event) => {
          const selectedLanguage = event.target.value; // Get the selected value
          localStorage.setItem("language", selectedLanguage); // Store it in localStorage

        });
      }
    };
    const observer = new MutationObserver(removeDuplicateLanguageSelectors);
    observer.observe(document.getElementById("google_translate_element"), {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect(); // Cleanup observer on component unmount
    };
  }, []);

  return (
    <div className="transalte-style">
      {/* {loading && <Loading />} */}
      <div id="google_translate_element"></div>
   
    </div>
  );
};

export default TranslateWidget;
