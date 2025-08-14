import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search dictionary entries
  app.get("/api/dictionary/search", async (req, res) => {
    try {
      const query = (req.query.q as string) || "";
      const limit = parseInt((req.query.limit as string) || "20");
      
      const entries = await storage.searchDictionaryEntries(query, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to search dictionary entries" });
    }
  });

  // Get dictionary entries by letter
  app.get("/api/dictionary/letter/:letter", async (req, res) => {
    try {
      const { letter } = req.params;
      const script = (req.query.script as 'traditional' | 'cyrillic') || 'traditional';
      
      const entries = await storage.getDictionaryEntriesByLetter(letter, script);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dictionary entries by letter" });
    }
  });

  // Get single dictionary entry
  app.get("/api/dictionary/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getDictionaryEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dictionary entry" });
    }
  });

  // Get all dictionary entries
  app.get("/api/dictionary", async (req, res) => {
    try {
      const entries = await storage.getAllDictionaryEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dictionary entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
