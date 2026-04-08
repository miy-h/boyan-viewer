export type CollatorFunction = (str1: string, str2: string) => number;

export const supportedLocales = ["en", "el", "grc", "ru"];

/**
 * create a collator for locales
 */
export function createCollatorForModernLocales(locale: string): CollatorFunction {
  return new Intl.Collator(locale, { collation: "dict", sensitivity: "base" }).compare;
}
