// This file contains utility functions for dictionary data management
import type { DictionaryEntry } from "@shared/schema";

export const MONGOLIAN_ALPHABET = [
  "ᠠ", "ᠡ", "ᠢ", "ᠣ", "ᠤ", "ᠥ", "ᠦ", "ᠨ", "ᠩ", "ᠪ",
  "ᠫ", "ᠬ", "ᠭ", "ᠮ", "ᠯ", "ᠰ", "ᠱ", "ᠲ", "ᠳ", "ᠴ",
  "ᠵ", "ᠶ", "ᠷ", "ᠸ", "ᠹ", "ᠺ", "ᠻ", "ᠼ", "ᠽ", "ᠾ"
];

export const CYRILLIC_ALPHABET = [
  "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И",
  "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С",
  "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ",
  "Ы", "Ь", "Э", "Ю", "Я"
];

export function sortEntriesByMongolian(entries: DictionaryEntry[]): DictionaryEntry[] {
  return [...entries].sort((a, b) => {
    return a.mongolianTraditional.localeCompare(b.mongolianTraditional);
  });
}

export function filterEntriesByFirstLetter(
  entries: DictionaryEntry[], 
  letter: string
): DictionaryEntry[] {
  return entries.filter(entry => 
    entry.mongolianTraditional.startsWith(letter)
  );
}

export function searchEntries(
  entries: DictionaryEntry[], 
  query: string
): DictionaryEntry[] {
  if (!query.trim()) return entries;
  
  const lowercaseQuery = query.toLowerCase();
  return entries.filter(entry => 
    entry.mongolianTraditional.toLowerCase().includes(lowercaseQuery) ||
    entry.mongolianCyrillic?.toLowerCase().includes(lowercaseQuery) ||
    entry.korean.toLowerCase().includes(lowercaseQuery) ||
    entry.english.toLowerCase().includes(lowercaseQuery) ||
    entry.pronunciation.toLowerCase().includes(lowercaseQuery)
  );
}
