import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";
import kk from "./locales/kk/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kk: { translation: kk }
  },
  lng: localStorage.getItem("lang") || "ru",
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

export default i18n;
