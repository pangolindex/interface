import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `./locales/{{lng}}.json`
    },
    react: {
      useSuspense: true
    },
    fallbackLng: 'en',
    preload: ['en'],
    whitelist: ['en', 'de', 'es-AR', 'es-US', 'it-IT', 'iw', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW'],
    keySeparator: false,
    interpolation: { escapeValue: false }
  })

export default i18next
