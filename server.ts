import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./src/db/index.js";
import { articles, users, categories } from "./src/db/schema.js";
import { mockArticles, mockCategories } from "./src/data.js";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  let inMemoryArticles = [...mockArticles];

  let inMemoryCategories = [...mockCategories];

  app.get("/api/categories", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json(inMemoryCategories);
      }
      
      let allCategories = await db.select().from(categories);
      if (allCategories.length === 0) {
        allCategories = await db.insert(categories).values(mockCategories).returning();
      }
      
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        const newCat = { ...req.body, id: Date.now().toString() };
        inMemoryCategories.push(newCat);
        return res.status(201).json(newCat);
      }
      const newCat = await db.insert(categories).values(req.body).returning();
      res.status(201).json(newCat[0]);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

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
        id, email, name, role: role || "NEO", password: hashedPassword
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

  app.delete("/api/users/:id", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) return res.json({ success: true });
      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json(inMemoryArticles);
      }
      
      let allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
      
      // Seed database if empty
      if (allArticles.length === 0) {
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
        const newArt = { ...req.body, id: Date.now().toString() };
        inMemoryArticles.unshift(newArt);
        return res.status(201).json(newArt);
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
        const ix = inMemoryArticles.findIndex(a => a.id === req.params.id);
        if (ix !== -1) {
          inMemoryArticles[ix] = { ...inMemoryArticles[ix], ...req.body, id: req.params.id };
          return res.json(inMemoryArticles[ix]);
        }
        return res.status(404).json({ error: "Not found" });
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

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        inMemoryArticles = inMemoryArticles.filter(a => a.id !== req.params.id);
        return res.json({ success: true });
      }
      await db.delete(articles).where(eq(articles.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
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
