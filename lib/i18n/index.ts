import { id, type StringKey } from './id';
import { en } from './en';

export type UiLang = 'id' | 'en';
export type { StringKey };

const tables: Record<UiLang, Record<StringKey, string>> = { id, en };

export function translate(
  lang: UiLang,
  key: StringKey,
  vars?: Record<string, string | number>,
): string {
  let s = tables[lang][key] ?? tables.id[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}
