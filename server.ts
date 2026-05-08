import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./src/db/index.js";
import { articles } from "./src/db/schema.js";
import { mockArticles } from "./src/data.js";
import { desc } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/articles", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn("WARNING: DATABASE_URL is not set. Returning mock data.");
        return res.json(mockArticles);
      }
      
      let allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
      
      // Seed database if empty
      if (allArticles.length === 0) {
        console.log("Seeding database with mock articles...");
        allArticles = await db.insert(articles).values(mockArticles).returning();
      }
      
      res.json(allArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn("WARNING: DATABASE_URL is not set. Mock creation successful.");
        return res.status(201).json({ ...req.body, id: Date.now().toString() });
      }
      const newArticle = await db.insert(articles).values(req.body).returning();
      res.status(201).json(newArticle[0]);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Since Express v4, we use *
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
