import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dictionaryEntries = pgTable("dictionary_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mongolianTraditional: text("mongolian_traditional").notNull(),
  mongolianCyrillic: text("mongolian_cyrillic").notNull(),
  korean: text("korean").notNull(),
  english: text("english").notNull(),
  pronunciation: text("pronunciation").notNull(),
  partOfSpeech: text("part_of_speech").notNull(), // noun, verb, adjective, etc.
  examples: jsonb("examples").notNull().default("[]"), // array of example objects
});

export const exampleSchema = z.object({
  mongolianTraditional: z.string(),
  mongolianCyrillic: z.string(),
  korean: z.string(),
  english: z.string(),
});

export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries, {
  examples: z.array(exampleSchema),
}).omit({
  id: true,
});

export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type Example = z.infer<typeof exampleSchema>;
