import { type DictionaryEntry, type InsertDictionaryEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  searchDictionaryEntries(query: string, limit?: number): Promise<DictionaryEntry[]>;
  getDictionaryEntriesByLetter(letter: string, script: 'traditional' | 'cyrillic'): Promise<DictionaryEntry[]>;
  getAllDictionaryEntries(): Promise<DictionaryEntry[]>;
  createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry>;
}

export class MemStorage implements IStorage {
  private entries: Map<string, DictionaryEntry>;

  constructor() {
    this.entries = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleEntries: InsertDictionaryEntry[] = [
      {
        mongolianTraditional: "ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ",
        mongolianCyrillic: "Монгол улс",
        korean: "몽골, 몽골국",
        english: "Mongolia, Mongolian state",
        pronunciation: "[몽골 울스]",
        partOfSpeech: "명사",
        examples: [
          {
            mongolianTraditional: "ᠮᠤᠩᠭᠤᠯ ᠤᠯᠤᠰ ᠤᠨ ᠨᠢᠶᠰᠯᠡᠯ ᠬᠣᠳᠠ ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Монгол улсын нийслэл хот Улаанбаатар байна.",
            korean: "몽골의 수도는 울란바토르입니다.",
            english: "The capital of Mongolia is Ulaanbaatar."
          }
        ]
      },
      {
        mongolianTraditional: "ᠨᠠᠷᠠᠨ",
        mongolianCyrillic: "наран",
        korean: "해, 태양",
        english: "sun",
        pronunciation: "[나란]",
        partOfSpeech: "명사",
        examples: [
          {
            mongolianTraditional: "ᠨᠠᠷᠠᠨ ᠮᠠᠨᠳᠤᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Наран мандаж байна.",
            korean: "해가 떠오르고 있습니다.",
            english: "The sun is rising."
          }
        ]
      },
      {
        mongolianTraditional: "ᠬᠦᠷᠬᠦ",
        mongolianCyrillic: "хүрэх",
        korean: "도달하다, 닿다",
        english: "to reach, to arrive",
        pronunciation: "[쿠르쿠]",
        partOfSpeech: "동사",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠭᠡᠷᠲᠦ ᠬᠦᠷᠦᠭᠦᠯᠦᠨ᠎ᠡ᠃",
            mongolianCyrillic: "Би гэртээ хүрэв.",
            korean: "나는 집에 도착했습니다.",
            english: "I arrived home."
          }
        ]
      },
      {
        mongolianTraditional: "ᠮᠤᠷᠢ",
        mongolianCyrillic: "морь",
        korean: "말",
        english: "horse",
        pronunciation: "[모리]",
        partOfSpeech: "명사",
        examples: [
          {
            mongolianTraditional: "ᠮᠤᠷᠢ ᠬᠦᠷᠳᠦᠨ ᠭᠦᠶᠦᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Морь хурдан гүйж байна.",
            korean: "말이 빠르게 달리고 있습니다.",
            english: "The horse is running fast."
          }
        ]
      },
      {
        mongolianTraditional: "ᠤᠰᠤ",
        mongolianCyrillic: "ус",
        korean: "물",
        english: "water",
        pronunciation: "[우스]",
        partOfSpeech: "명사",
        examples: [
          {
            mongolianTraditional: "ᠤᠰᠤ ᠴᠢᠩᠭᠡ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Ус тунгалаг байна.",
            korean: "물이 맑습니다.",
            english: "The water is clear."
          }
        ]
      },
      {
        mongolianTraditional: "ᠠᠪᠬᠤ",
        mongolianCyrillic: "авах",
        korean: "가져가다, 받다",
        english: "to take, to receive",
        pronunciation: "[아브쿠]",
        partOfSpeech: "동사",
        examples: [
          {
            mongolianTraditional: "ᠪᠢ ᠨᠣᠮ ᠠᠪᠬᠤ ᠬᠡᠷᠡᠭᠲᠡᠢ᠃",
            mongolianCyrillic: "Би ном авах хэрэгтэй.",
            korean: "나는 책을 가져가야 합니다.",
            english: "I need to take the book."
          }
        ]
      },
      {
        mongolianTraditional: "ᠬᠥᠭᠡᠷᠦᠬᠦᠨ",
        mongolianCyrillic: "хөөрхөн",
        korean: "귀엽다, 사랑스럽다",
        english: "cute, lovely, adorable",
        pronunciation: "[훠르헌]",
        partOfSpeech: "형용사",
        examples: [
          {
            mongolianTraditional: "ᠪᠠᠭᠠ ᠬᠦᠦᠬᠡᠳ ᠬᠥᠭᠡᠷᠦᠬᠦᠨ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
            mongolianCyrillic: "Бага хүүхэд хөөрхөн байна.",
            korean: "어린 아이가 귀엽습니다.",
            english: "The little child is cute."
          }
        ]
      }
    ];

    sampleEntries.forEach(entry => {
      const id = randomUUID();
      const fullEntry: DictionaryEntry = { ...entry, id };
      this.entries.set(id, fullEntry);
    });
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined> {
    return this.entries.get(id);
  }

  async searchDictionaryEntries(query: string, limit: number = 20): Promise<DictionaryEntry[]> {
    if (!query.trim()) {
      return Array.from(this.entries.values()).slice(0, limit);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = Array.from(this.entries.values()).filter(entry => 
      entry.mongolianTraditional.toLowerCase().includes(normalizedQuery) ||
      entry.mongolianCyrillic.toLowerCase().includes(normalizedQuery) ||
      entry.korean.toLowerCase().includes(normalizedQuery) ||
      entry.english.toLowerCase().includes(normalizedQuery) ||
      entry.pronunciation.toLowerCase().includes(normalizedQuery)
    );

    return results.slice(0, limit);
  }

  async getDictionaryEntriesByLetter(letter: string, script: 'traditional' | 'cyrillic'): Promise<DictionaryEntry[]> {
    const field = script === 'traditional' ? 'mongolianTraditional' : 'mongolianCyrillic';
    return Array.from(this.entries.values()).filter(entry => 
      entry[field].charAt(0).toLowerCase() === letter.toLowerCase()
    );
  }

  async getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
    return Array.from(this.entries.values());
  }

  async createDictionaryEntry(insertEntry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    const id = randomUUID();
    const entry: DictionaryEntry = { ...insertEntry, id };
    this.entries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
