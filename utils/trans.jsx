// translations.js
const translations = {
  en: {
    home: "Home",
    description: "Description",
    specifications: "Specifications",
    offarat: "Offarat",
    search:"Search",
    offerContent : "Offer Content"

  },
  ar: {
    home: "الصفحه رئيسيه",
    description: "وصف العرض",
    specifications:"المواصفات",
    offarat:"اوفرات",
    search:"البحث",
    offerContent:"محتوى العرض"
  },
};

// Function to get the current language code
const getLanguageCode = () => {
  let language = localStorage.getItem("language");
  return language && language.startsWith("Arabic") ? "ar" : "en";
};

// Function to get the translation for a given key
const trans = (key) => {
  const languageCode = getLanguageCode();
  return translations[languageCode][key] || key; // Return the key if translation is not found
};

// Export the translate function
export { trans };
