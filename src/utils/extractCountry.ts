// assumes user's country based on locale
export default function getCountry(): string {
  const { languages } = navigator;
  for (let i = 0; i < languages.length; i++) {
    const [, countryCode] = languages[i].split("-");
    if (countryCode) {
      return countryCode.toUpperCase();
    }
  }
  return "US";
}