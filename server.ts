import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./src/db/index.js";
import { articles, users } from "./src/db/schema.js";
import { mockArticles } from "./src/data.js";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Date.now().toString();
      const newUser = await db.insert(users).values({
        id, email, name, role: role || "Viewer", password: hashedPassword
      }).returning({ id: users.id, email: users.email, name: users.name, role: users.role });
      res.status(201).json(newUser[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }
      const userList = await db.select().from(users).where(eq(users.email, email));
      if (userList.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const user = userList[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) return res.json([]);
      const allUsers = await db.select({ id: users.id, email: users.email, name: users.name, role: users.role }).from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put("/api/users/:id/role", async (req, res) => {
    try {
      const { role } = req.body;
      if (!process.env.DATABASE_URL) return res.json({ id: req.params.id, role });
      const updated = await db.update(users).set({ role }).where(eq(users.id, req.params.id)).returning({ id: users.id, email: users.email, name: users.name, role: users.role });
      if (updated.length === 0) return res.status(404).json({ error: "User not found" });
      res.json(updated[0]);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
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

  app.put("/api/articles/:id", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json({ ...req.body, id: req.params.id });
      }
      const updated = await db.update(articles)
        .set(req.body)
        .where(eq(articles.id, req.params.id))
        .returning();
      if (updated.length === 0) return res.status(404).json({ error: "Article not found" });
      res.json(updated[0]);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
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
