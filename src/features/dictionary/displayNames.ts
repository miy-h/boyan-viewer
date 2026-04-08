const cache: Record<string, string> = Object.create(null);
const languageNames = new Intl.DisplayNames("en", { type: "language" });

export function getLanguageName(locale: string) {
  return (cache[locale] ||= languageNames.of(locale)!);
}
