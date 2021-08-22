import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

export const availableLanguages = ['en', 'de', 'tr', 'zh', 'es', 'fr', 'pt-br']
export const defaultLocale = 'en'

const determineLngFn = (code: string): string => {
  if (!code || code.length === 0) {
    return i18next.language = defaultLocale
  }

  // Full locale match
  if (availableLanguages.includes(code.toLowerCase())) {
    return i18next.language = code.toLowerCase()
  }

  // Base locale match
  const codeBase = code.split('-')[0].toLowerCase()
  if (availableLanguages.includes(codeBase)) {
    return i18next.language = codeBase
  }

  // Fallback
  return i18next.language = defaultLocale
}

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
    lowerCaseLng: true,
    fallbackLng: determineLngFn,
    preload: [defaultLocale],
    keySeparator: '.',
    interpolation: { escapeValue: false }
  })

export default i18next
