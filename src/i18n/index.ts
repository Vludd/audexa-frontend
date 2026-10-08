import { en } from "./locales/en"
import { kz } from "./locales/kz"
import { ru } from "./locales/ru"
import type { Locale, TranslationPath, TranslationTree } from "./types"

export type TranslationKey = TranslationPath<typeof ru>

const dictionaries: Record<Locale, TranslationTree> = { ru, en, kz }

// Russian remains the default until a language selector is added.
export const DEFAULT_LOCALE: Locale = "ru"
export const ACTIVE_LOCALE: Locale = DEFAULT_LOCALE

function resolveKey(
  dictionary: TranslationTree,
  key: string,
): string | undefined {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined
    return (current as Record<string, unknown>)[part]
  }, dictionary)

  return typeof value === "string" ? value : undefined
}

export function t(
  key: TranslationKey,
  variables?: Record<string, string | number>,
): string {
  const value = resolveKey(dictionaries[ACTIVE_LOCALE], key)

  if (!value) {
    return key
  }

  if (!variables) {
    return value
  }

  return value.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(variables[name] ?? `{${name}}`),
  )
}

export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale =
    ACTIVE_LOCALE === "kz"
      ? "kk-KZ"
      : ACTIVE_LOCALE === "en"
        ? "en-US"
        : "ru-RU"

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date)
}

export function formatTime(date: Date): string {
  const locale =
    ACTIVE_LOCALE === "kz"
      ? "kk-KZ"
      : ACTIVE_LOCALE === "en"
        ? "en-US"
        : "ru-RU"

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

export { dictionaries }
export type { Locale }
