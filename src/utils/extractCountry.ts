// assumes user's country based on locale
export default function getCountry(): string {
  const { languages } = navigator
  for (const langague of languages) {
    const [, countryCode] = langague.split('-')
    if (countryCode) {
      return countryCode.toUpperCase()
    }
  }
  return 'US'
}
